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
  validate: function(model, resolve, reject) {
    var check, fn, message, operator;

    if (Ember.Validations.Utilities.isBlank(model.get(this.property))) {
      if (this.options.allowBlank === undefined && (this.options.is || this.options.minimum)) {
        model.errors.add(this.property, this.allowBlankOptions.message);
        return reject();
      }
    } else {
      for (check in this.CHECKS) {
        operator = this.CHECKS[check];
        if (!this.options[check]) {
          continue;
        }

        fn = new Function('return ' + this.tokenizedLength(model.get(this.property)) + ' ' + operator + ' ' + this.options[check]);
        if (!fn()) {
          model.errors.add(this.property, this.options.messages[this.MESSAGES[check]]);
          return reject();
        }
      }
    }
    return resolve();
  }
});
