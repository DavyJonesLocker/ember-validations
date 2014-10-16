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
      if (this.options[key] !== undefined && this.options[key].constructor === String) {
        this.model.addObserver(this.options[key], this, this._validate);
      }
    }

    this.options.tokenizer = this.options.tokenizer || function(value) { return value.split(''); };
    // if (typeof(this.options.tokenizer) === 'function') {
      // debugger;
      // // this.tokenizedLength = new Function('value', 'return '
    // } else {
      // this.tokenizedLength = new Function('value', 'return (value || "").' + (this.options.tokenizer || 'split("")') + '.length');
    // }
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
  getValue: function(key) {
    if (this.options[key].constructor === String) {
      return this.model.get(this.options[key]) || 0;
    } else {
      return this.options[key];
    }
  },
  messageKeys: function() {
    return Ember.keys(this.MESSAGES);
  },
  checkKeys: function() {
    return Ember.keys(this.CHECKS);
  },
  renderMessageFor: function(key) {
    var options = {count: this.getValue(key)}, _key;
    for (_key in this.options) {
      options[_key] = this.options[_key];
    }

    return this.options.messages[this.MESSAGES[key]] || Ember.Validations.messages.render(this.MESSAGES[key], options);
  },
  renderBlankMessage: function() {
    if (this.options.is) {
      return this.renderMessageFor('is');
    } else if (this.options.minimum) {
      return this.renderMessageFor('minimum');
    }
  },
  call: function() {
    var check, fn, message, operator, key;

    if (Ember.isEmpty(this.model.get(this.property))) {
      if (this.options.allowBlank === undefined && (this.options.is || this.options.minimum)) {
        this.errors.pushObject(this.renderBlankMessage());
      }
    } else {
      for (key in this.CHECKS) {
        operator = this.CHECKS[key];
        if (!this.options[key]) {
          continue;
        }

        fn = new Function('return ' + this.options.tokenizer(this.model.get(this.property)).length + ' ' + operator + ' ' + this.getValue(key));
        if (!fn()) {
          this.errors.pushObject(this.renderMessageFor(key));
        }
      }
    }
  }
});
