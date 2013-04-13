Ember.Validations.validators.local.reopen({
  length: function(model, property, options, deferredObject) {
    /*jshint expr:true*/
    var CHECKS, MESSAGES, allowBlankOptions, check, fn, message, operator, tokenizedLength, tokenizer, index, keys, key;

    CHECKS = {
      'is'      : '==',
      'minimum' : '>=',
      'maximum' : '<='
    };

    MESSAGES = {
      'is'      : 'wrongLength',
      'minimum' : 'tooShort',
      'maximum' : 'tooLong'
    };

    if (typeof(options) === 'number') {
      options = { 'is': options };
    }

    if (options.messages === undefined) {
      options.messages = {};
    }

    keys = Object.keys(MESSAGES);
    for (index = 0; index < keys.length; index++) {
      key = keys[index];
      if (options[key] !== undefined && options.messages[MESSAGES[key]] === undefined) {
        if (Ember.$.inArray(key, Object.keys(CHECKS)) !== -1) {
          options.count = options[key];
        }
        options.messages[MESSAGES[key]] = Ember.Validations.messages.render(MESSAGES[key], options);
        if (options.count !== undefined) {
          delete options.count;
        }
      }
    }

    tokenizer = options.tokenizer || 'split("")';
    tokenizedLength = new Function('value', 'return value.' + tokenizer + '.length')(model.get(property) || '');

    allowBlankOptions = {};
    if (options.is) {
      allowBlankOptions.message = options.messages.wrongLength;
    } else if (options.minimum) {
      allowBlankOptions.message = options.messages.tooShort;
    }

    if (Ember.Validations.Utilities.isBlank(model.get(property))) {
      if (options.allowBlank === undefined) {
        model.errors.add(property, allowBlankOptions.message);
      }
    } else {
      for (check in CHECKS) {
        operator = CHECKS[check];
        if (!options[check]) {
          continue;
        }

        fn = new Function("return " + tokenizedLength + " " + operator + " " + options[check]);
        if (!fn()) {
          model.errors.add(property, options.messages[MESSAGES[check]]);
        }
      }
    }
    deferredObject && deferredObject.resolve();
  }
});
