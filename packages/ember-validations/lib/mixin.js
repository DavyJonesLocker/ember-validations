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

var eventualValidator = function(sender, validator) {
  if (this.get(validator).constructor === Array) {
    this.removeObserver(validator, this);
    this.validators.pushObject(ArrayValidator.create({model: this, property: validator, validators: this.get(validator)}));
  } else if (this.get(validator).validate) {
    this.removeObserver(validator, this);
    this.validators.pushObject(this.get(validator));
  }
};

Ember.Validations.Mixin = Ember.Mixin.create({
  init: function() {
    this._super();
    this.errors = Ember.Validations.Errors.create();
    this.isValid = undefined;
    if (this.get('validations') === undefined) {
      this.validations = {};
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
    this.validators = Ember.makeArray();
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
        if (this.get(validator) === undefined) {
          this.addObserver(validator, this, eventualValidator);
        } else if (this.get(validator).constructor === Array) {
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
