DS.Validations.validators.local.reopen({
  length: function(model, property, options) {
    var CHECKS, allowBlankOptions, check, fn, message, operator, tokenized_length, tokenizer;
    tokenizer = options.tokenizer || 'split("")';
    tokenized_length = new Function('value', 'return value.' + tokenizer + '.length')(model.get(property) || '');

    CHECKS = {
      'is'      : '==',
      'minimum' : '>=',
      'maximum' : '<='
    };

    allowBlankOptions = {};
    if (options.is) {
      allowBlankOptions.message = options.messages.is;
    } else if (options.minimum) {
      allowBlankOptions.message = options.messages.minimum;
    }

    message = this.presence(model, property, allowBlankOptions);
    if (message) {
      if (options.allow_blank === true) {
        return;
      } else {
        return message;
      }
    }

    for (check in CHECKS) {
      operator = CHECKS[check];
      if (!options[check]) {
        continue;
      }

      fn = new Function("return " + tokenized_length + " " + operator + " " + options[check]);
      if (!fn()) {
        return options.messages[check];
      }
    }
  }
});
