Ember.Validations.validators.local.Length = Ember.Validations.validators.Base.extend({
  init: function() {
    var index, key, validationProperty;
    this._super();
    /*jshint expr:true*/
    if (typeof(this.options) === 'number') {
      this.set('options', { 'is': this.options });
    }

    if (this.options.messages === undefined) {
      this.set('options.messages', {});
    }

    for (index = 0; index < this.messageKeys().length; index++) {
      key = this.messageKeys()[index],
      validationProperty = this.options[key];

      if (isNaN(validationProperty)) {
        this.model.addObserver(validationProperty, this, this.validate);
      }

      if (validationProperty !== undefined && this.options.messages[this.MESSAGES[key]] === undefined) {
        if (Ember.$.inArray(key, this.checkKeys()) !== -1) {
          if (isNaN(parseFloat(validationProperty)) && typeof this.model.get(validationProperty) !== "undefined") {
            this.options.count = this.model.get(validationProperty);
          } else {
            this.options.count = validationProperty;
          }
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
        var checkValue;
        operator = this.CHECKS[check];
        if (!this.options[check]) {
          continue;
        }

        if (!isNaN(parseFloat(this.options[check])) && isFinite(this.options[check])) {
          checkValue = this.options[check];
        } else if (this.model.get(this.options[check]) !== undefined) {
          checkValue = this.model.get(this.options[check]);
        }

        if (checkValue !== undefined) {
          fn = new Function('return ' + this.tokenizedLength(this.model.get(this.property)) + ' ' + operator + ' ' + checkValue);
          if (!fn()) {
            this.errors.pushObject(this.options.messages[this.MESSAGES[check]]);
          }
        }
      }
    }
  }
});
