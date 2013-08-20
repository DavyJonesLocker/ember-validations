// Last commit: 365d185 (2013-08-14 05:34:39 -0700)


(function() {
Ember.Validations = Ember.Namespace.create({
  VERSION: '0.2.1'
});

})();



(function() {
Ember.Application.reopen({
  bootstrapValidations: function(validations) {
    var objectName, property, validator, option, value, tmp,
    normalizedValidations = {}, existingValidations;
    function normalizeObject(object) {
      var key, value, normalizedObject = {};

      for (key in object) {
        if (typeof(object[key]) === 'object') {
          value = normalizeObject(object[key]);
        } else {
          value = object[key];
        }
        normalizedObject[key.camelize()] = value;
      }
      return normalizedObject;
    }

    for (objectName in validations) {
      existingValidations = (new this[objectName.camelize().capitalize()]()).get('validations');
      normalizedValidations = normalizeObject(validations[objectName]);
      this[objectName.camelize().capitalize()].reopen({
        validations: Ember.$.extend(true, {}, normalizedValidations, existingValidations)
      });

    }
  }
});

})();



(function() {
Ember.Validations.messages = {
  render: function(attribute, context) {
    return Handlebars.compile(Ember.Validations.messages.defaults[attribute])(context);
  },
  defaults: {
    inclusion: "is not included in the list",
    exclusion: "is reserved",
    invalid: "is invalid",
    confirmation: "doesn't match {{attribute}}",
    accepted: "must be accepted",
    empty: "can't be empty",
    blank: "can't be blank",
    present: "must be blank",
    tooLong: "is too long (maximum is {{count}} characters)",
    tooShort: "is too short (minimum is {{count}} characters)",
    wrongLength: "is the wrong length (should be {{count}} characters)",
    notANumber: "is not a number",
    notAnInteger: "must be an integer",
    greaterThan: "must be greater than {{count}}",
    greaterThanOrEqualTo: "must be greater than or equal to {{count}}",
    equalTo: "must be equal to {{count}}",
    lessThan: "must be less than {{count}}",
    lessThanOrEqualTo: "must be less than or equal to {{count}}",
    otherThan: "must be other than {{count}}",
    odd: "must be odd",
    even: "must be even"
  }
};

})();



(function() {
Ember.Validations.Errors = Ember.Object.extend({
  unknownProperty: function(property) {
    this.set(property, Ember.makeArray());
    return this.get(property);
  }
});

})();



(function() {
var setValidity = function(sender, key, value, context, rev) {
  if (this.get('validators').filterProperty('isValid', false).get('length') > 0) {
    if (this.get('isValid') === false) {
      this.notifyPropertyChange('isValid');
    } else {
      this.set('isValid', false);
    }
  } else {
    if (this.get('isValid') === true) {
      this.notifyPropertyChange('isValid');
    } else {
      this.set('isValid', true);
    }
  }
};

var ArrayValidator = Ember.Object.extend({
  init: function() {
    this._super();
    this.addObserver('validators.@each.isValid', this, setValidity);
    this.model.addObserver(''+this.property+'.[]', this, setValidity);
  },
  validate: function() {
    var promises;

    promises = this.get('validators').map(function(validator) {
      return validator.validate();
    }).without(undefined);

    return Ember.RSVP.all(promises);
  }
});

Ember.Validations.Mixin = Ember.Mixin.create({
  init: function() {
    this._super();
    this.set('errors', Ember.Validations.Errors.create());
    if (this.get('validations') === undefined) {
      this.set('validations', {});
    }
    this.buildValidators();
    this.addObserver('validators.@each.isValid', this, setValidity);
    this.validators.forEach(function(validator) {
      validator.addObserver('errors.[]', this, function(sender, key, value, context, rev) {
        var errors = Ember.makeArray();
        this.validators.forEach(function(validator) {
          if (validator.property === sender.property) {
            errors = errors.concat(validator.errors);
          }
        }, this);
        this.set('errors.' + sender.property, errors);
      });
    }, this);
    this.validate();
  },
  isInvalid: function() {
    return !this.get('isValid');
  }.property('isValid'),
  buildValidators: function() {
    this.set('validators', Ember.A([]));
    if (this.validations.constructor === Array) {
      this.buildCompositeValidators(this.validations);
    } else {
      this.buildPropertyValidators(this.validations);
    }
  },
  buildCompositeValidators: function(validations) {
    var i, validator;

    for (i = 0; i < validations.length; i++) {
      validator = validations[i];

      if (validator.constructor === Object) {
        this.buildPropertyValidators(validator);
      } else if (validator.constructor === String) {
        if (this.get(validator).constructor === Array) {
          this.validators.pushObject(ArrayValidator.create({model: this, property: validator, validators: this.get(validator)}));
        } else {
          this.validators.pushObject(this.get(validator));
        }
      } else if (validator.validate === undefined) {
        this.validators.pushObject(validator.create({model: this}));
      } else {
        this.validators.pushObject(validator);
      }
    }
  },
  buildPropertyValidators: function(validations) {
    var findValidator, property, validator;

    findValidator = function(validator) {
      var klass = validator.classify();
      return Ember.Validations.validators.local[klass] || Ember.Validations.validators.remote[klass];
    };

    for (property in validations) {
      if (validations.hasOwnProperty(property)) {
        for (validator in validations[property]) {
          if (validations[property].hasOwnProperty(validator)) {
            this.validators.pushObject(findValidator(validator).create({model: this, property: property, options: validations[property][validator]}));
          }
        }
      }
    }
  },
  validate: function() {
    var promises;

    // this is not ideal
    this.set('isValid', true);

    promises = this.validators.map(function(validator) {
      return validator.validate();
    }).without(undefined);

    return Ember.RSVP.all(promises);
  }
});

})();



(function() {
Ember.Validations.patterns = Ember.Namespace.create({
  numericality: /^(-|\+)?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/,
  blank: /^\s*$/
});

})();



(function() {
Ember.Validations.validators        = Ember.Namespace.create();
Ember.Validations.validators.local  = Ember.Namespace.create();
Ember.Validations.validators.remote = Ember.Namespace.create();

})();



(function() {
Ember.Validations.validators.Base = Ember.Object.extend({
  init: function() {
    this.set('errors', Ember.makeArray());
    this.conditionals = {
      'if': this.get('options.if'),
      unless: this.get('options.unless')
    };
    this.model.addObserver(this.property, this, this.validate);
  },
  call: function () {
    throw 'Not implemented!';
  },
  unknownProperty: function(key) {
    var model = this.get('model');
    if (model) {
      return model.get(key);
    }
  },
  validate: function() {
    if (this.canValidate()) {
      this.errors.clear();
      this.call();
      if (this.errors.length > 0) {
        if (this.get('isValid') === false) {
          this.notifyPropertyChange('isValid');
        } else {
          this.set('isValid', false);
        }
        return Ember.RSVP.reject();
      } else {
        if (this.get('isValid') === true) {
          this.notifyPropertyChange('isValid');
        } else {
          this.set('isValid', true);
        }
        return Ember.RSVP.resolve();
      }
    }
  },
  canValidate: function() {
    if (typeof(this.conditionals) === 'object') {
      if (this.conditionals['if']) {
        if (typeof(this.conditionals['if']) === 'function') {
          return this.conditionals['if'](this.model);
        } else if (typeof(this.conditionals['if']) === 'string') {
          if (typeof(this.model[this.conditionals['if']]) === 'function') {
            return this.model[this.conditionals['if']]();
          } else {
            return this.model.get(this.conditionals['if']);
          }
        }
      } else if (this.conditionals.unless) {
        if (typeof(this.conditionals.unless) === 'function') {
          return !this.conditionals.unless(this.model);
        } else if (typeof(this.conditionals.unless) === 'string') {
          if (typeof(this.model[this.conditionals.unless]) === 'function') {
            return !this.model[this.conditionals.unless]();
          } else {
            return !this.model.get(this.conditionals.unless);
          }
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
});

})();



(function() {
Ember.Validations.validators.local.Absence = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();
    /*jshint expr:true*/
    if (this.options === true) {
      this.set('options', {});
    }

    if (this.options.message === undefined) {
      this.set('options.message', Ember.Validations.messages.render('present', this.options));
    }
  },
  call: function() {
    if (!Ember.Validations.Utilities.isBlank(this.model.get(this.property))) {
      this.errors.pushObject(this.options.message);
    }
  }
});

})();



(function() {
Ember.Validations.validators.local.Acceptance = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();
    /*jshint expr:true*/
    if (this.options === true) {
      this.set('options', {});
    }

    if (this.options.message === undefined) {
      this.set('options.message', Ember.Validations.messages.render('accepted', this.options));
    }
  },
  call: function() {
    if (this.options.accept) {
      if (this.model.get(this.property) !== this.options.accept) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.model.get(this.property) !== '1' && this.model.get(this.property) !== 1 && this.model.get(this.property) !== true) {
      this.errors.pushObject(this.options.message);
    }
  }
});

})();



(function() {
Ember.Validations.validators.local.Confirmation = Ember.Validations.validators.Base.extend({
  init: function() {
    this.originalProperty = this.property;
    this.property = this.property + 'Confirmation';
    this._super();
    this.model.addObserver(this.originalProperty, this, this.validate);
    /*jshint expr:true*/
    if (this.options === true) {
      this.set('options', { attribute: this.originalProperty });
      this.set('options', { message: Ember.Validations.messages.render('confirmation', this.options) });
    }
  },
  call: function() {
    if (this.model.get(this.originalProperty) !== this.model.get(this.property)) {
      this.errors.pushObject(this.options.message);
    }
  }
});

})();



(function() {
Ember.Validations.validators.local.Exclusion = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();
    if (this.options.constructor === Array) {
      this.set('options', { 'in': this.options });
    }

    if (this.options.message === undefined) {
      this.set('options.message', Ember.Validations.messages.render('exclusion', this.options));
    }
  },
  call: function() {
    /*jshint expr:true*/
    var message, lower, upper;

    if (Ember.Validations.Utilities.isBlank(this.model.get(this.property))) {
      if (this.options.allowBlank === undefined) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.options['in']) {
      if (Ember.$.inArray(this.model.get(this.property), this.options['in']) !== -1) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.options.range) {
      lower = this.options.range[0];
      upper = this.options.range[1];

      if (this.model.get(this.property) >= lower && this.model.get(this.property) <= upper) {
        this.errors.pushObject(this.options.message);
      }
    }
  }
});

})();



(function() {
Ember.Validations.validators.local.Format = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();
    if (this.options.constructor === RegExp) {
      this.set('options', { 'with': this.options });
    }

    if (this.options.message === undefined) {
      this.set('options.message',  Ember.Validations.messages.render('invalid', this.options));
    }
   },
   call: function() {
    if (Ember.Validations.Utilities.isBlank(this.model.get(this.property))) {
      if (this.options.allowBlank === undefined) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.options['with'] && !this.options['with'].test(this.model.get(this.property))) {
      this.errors.pushObject(this.options.message);
    } else if (this.options.without && this.options.without.test(this.model.get(this.property))) {
      this.errors.pushObject(this.options.message);
    }
  }
});

})();



(function() {
Ember.Validations.validators.local.Inclusion = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();
    if (this.options.constructor === Array) {
      this.set('options', { 'in': this.options });
    }

    if (this.options.message === undefined) {
      this.set('options.message', Ember.Validations.messages.render('inclusion', this.options));
    }
  },
  call: function() {
    var message, lower, upper;
    if (Ember.Validations.Utilities.isBlank(this.model.get(this.property))) {
      if (this.options.allowBlank === undefined) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.options['in']) {
      if (Ember.$.inArray(this.model.get(this.property), this.options['in']) === -1) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.options.range) {
      lower = this.options.range[0];
      upper = this.options.range[1];

      if (this.model.get(this.property) < lower || this.model.get(this.property) > upper) {
        this.errors.pushObject(this.options.message);
      }
    }
  }
});

})();



(function() {
Ember.Validations.validators.local.Length = Ember.Validations.validators.Base.extend({
  init: function() {
    var index, key;
    this._super();
    /*jshint expr:true*/
    if (typeof(this.options) === 'number') {
      this.set('options', { 'is': this.options });
    }

    if (this.options.messages === undefined) {
      this.set('options.messages', {});
    }

    for (index = 0; index < this.messageKeys().length; index++) {
      key = this.messageKeys()[index];
      if (this.options[key] !== undefined && this.options.messages[this.MESSAGES[key]] === undefined) {
        if (Ember.$.inArray(key, this.checkKeys()) !== -1) {
          this.options.count = this.options[key];
        }
        this.options.messages[this.MESSAGES[key]] = Ember.Validations.messages.render(this.MESSAGES[key], this.options);
        if (this.options.count !== undefined) {
          delete this.options.count;
        }
      }
    }

    this.allowBlankOptions = {};
    if (this.options.is) {
      this.allowBlankOptions.message = this.options.messages.wrongLength;
    } else if (this.options.minimum) {
      this.allowBlankOptions.message = this.options.messages.tooShort;
    }

    this.tokenizedLength = new Function('value', 'return (value || "").' + (this.options.tokenizer || 'split("")') + '.length');
  },
  CHECKS: {
    'is'      : '==',
    'minimum' : '>=',
    'maximum' : '<='
  },
  MESSAGES: {
    'is'      : 'wrongLength',
    'minimum' : 'tooShort',
    'maximum' : 'tooLong'
  },
  messageKeys: function() {
    return Object.keys(this.MESSAGES);
  },
  checkKeys: function() {
    return Object.keys(this.CHECKS);
  },
  call: function() {
    var check, fn, message, operator;

    if (Ember.Validations.Utilities.isBlank(this.model.get(this.property))) {
      if (this.options.allowBlank === undefined && (this.options.is || this.options.minimum)) {
        this.errors.pushObject(this.allowBlankOptions.message);
      }
    } else {
      for (check in this.CHECKS) {
        operator = this.CHECKS[check];
        if (!this.options[check]) {
          continue;
        }

        fn = new Function('return ' + this.tokenizedLength(this.model.get(this.property)) + ' ' + operator + ' ' + this.options[check]);
        if (!fn()) {
          this.errors.pushObject(this.options.messages[this.MESSAGES[check]]);
        }
      }
    }
  }
});

})();



(function() {
Ember.Validations.validators.local.Numericality = Ember.Validations.validators.Base.extend({
  init: function() {
    /*jshint expr:true*/
    var index, keys, key;
    this._super();

    if (this.options === true) {
      this.options = {};
    }

    if (this.options.messages === undefined) {
      this.options.messages = { numericality: Ember.Validations.messages.render('notANumber', this.options) };
    }

    if (this.options.onlyInteger !== undefined && this.options.messages.onlyInteger === undefined) {
      this.options.messages.onlyInteger = Ember.Validations.messages.render('notAnInteger', this.options);
    }

    keys = Object.keys(this.CHECKS).concat(['odd', 'even']);
    for(index = 0; index < keys.length; index++) {
      key = keys[index];

      if (isNaN(this.options[key])) {
        this.model.addObserver(this.options[key], this, this.validate);
      }

      if (this.options[key] !== undefined && this.options.messages[key] === undefined) {
        if (Ember.$.inArray(key, Object.keys(this.CHECKS)) !== -1) {
          this.options.count = this.options[key];
        }
        this.options.messages[key] = Ember.Validations.messages.render(key, this.options);
        if (this.options.count !== undefined) {
          delete this.options.count;
        }
      }
    }
  },
  CHECKS: {
    equalTo              :'===',
    greaterThan          : '>',
    greaterThanOrEqualTo : '>=',
    lessThan             : '<',
    lessThanOrEqualTo    : '<='
  },
  call: function() {
    var check, checkValue, fn, form, operator, val;

    if (Ember.Validations.Utilities.isBlank(this.model.get(this.property))) {
      if (this.options.allowBlank === undefined) {
        this.errors.pushObject(this.options.messages.numericality);
      }
    } else if (!Ember.Validations.patterns.numericality.test(this.model.get(this.property))) {
      this.errors.pushObject(this.options.messages.numericality);
    } else if (this.options.onlyInteger === true && !(/^[+\-]?\d+$/.test(this.model.get(this.property)))) {
      this.errors.pushObject(this.options.messages.onlyInteger);
    } else if (this.options.odd  && parseInt(this.model.get(this.property), 10) % 2 === 0) {
      this.errors.pushObject(this.options.messages.odd);
    } else if (this.options.even && parseInt(this.model.get(this.property), 10) % 2 !== 0) {
      this.errors.pushObject(this.options.messages.even);
    } else {
      for (check in this.CHECKS) {
        operator = this.CHECKS[check];

        if (this.options[check] === undefined) {
          continue;
        }

        if (!isNaN(parseFloat(this.options[check])) && isFinite(this.options[check])) {
          checkValue = this.options[check];
        } else if (this.model.get(this.options[check]) !== undefined) {
          checkValue = this.model.get(this.options[check]);
        }

        fn = new Function('return ' + this.model.get(this.property) + ' ' + operator + ' ' + checkValue);

        if (!fn()) {
          this.errors.pushObject(this.options.messages[check]);
        }
      }
    }
  }
});

})();



(function() {
Ember.Validations.validators.local.Presence = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();
    /*jshint expr:true*/
    if (this.options === true) {
      this.options = {};
    }

    if (this.options.message === undefined) {
      this.options.message = Ember.Validations.messages.render('blank', this.options);
    }
  },
  call: function() {
    if (Ember.Validations.Utilities.isBlank(this.model.get(this.property))) {
      this.errors.pushObject(this.options.message);
    }
  }
});

})();



(function() {

})();



(function() {
Ember.Validations.Utilities = {
  isBlank: function(value) {
    return value !== 0 && (!value || /^\s*$/.test(''+value));
  }
};

})();



(function() {

})();

