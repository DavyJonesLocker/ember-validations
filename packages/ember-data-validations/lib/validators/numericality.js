DS.Validations.validators.local.reopen({
  numericality: function(model, property, options) {
    var CHECKS, check, checkValue, fn, form, operator, val, index, keys, key;

    CHECKS = {
      equal_to                  :'===',
      greater_than              : '>',
      greater_than_or_equal_to : '>=',
      less_than                 : '<',
      less_than_or_equal_to     : '<='
    };

    if (options === true) {
      options = {};
    }

    if (options.messages === undefined) {
      options.messages = { numericality: DS.Validations.messages.render('not_a_number', options) };
    }

    if (options.only_integer !== undefined && options.messages.only_integer === undefined) {
      options.messages.only_integer = DS.Validations.messages.render('not_an_integer', options);
    }

    keys = Object.keys(CHECKS).concat(['odd', 'even']);
    for(index = 0; index < keys.length; index++) {
      key = keys[index];
      if (options[key] !== undefined && options.messages[key] === undefined) {
        if (Ember.$.inArray(key, Object.keys(CHECKS)) !== -1) {
          options.count = options[key];
        }
        options.messages[key] = DS.Validations.messages.render(key, options);
        if (options.count !== undefined) {
          delete options.count;
        }
      }
    }

    if (!DS.Validations.patterns.numericality.test(model.get(property))) {
      if (options.allow_blank === true && this.presence(model, property, { message: options.messages.numericality })) {
        return;
      } else {
        return options.messages.numericality;
      }
    }

    if (options.only_integer === true && !(/^[+\-]?\d+$/.test(model.get(property)))) {
      return options.messages.only_integer;
    }

    for (check in CHECKS) {
      operator = CHECKS[check];

      if (options[check] === undefined) {
        continue;
      }

      if (!isNaN(parseFloat(options[check])) && isFinite(options[check])) {
        checkValue = options[check];
      } else if (model.get(options[check])) {
        checkValue = model.get(options[check]);
      } else {
        return;
      }

      fn = new Function('return ' + model.get(property) + ' ' + operator + ' ' + checkValue);

      if (!fn()) {
        return options.messages[check];
      }
    }

    if (options.odd && parseInt(model.get(property), 10) % 2 === 0) {
      return options.messages.odd;
    }

    if (options.even && parseInt(model.get(property), 10) % 2 !== 0) {
      return options.messages.even;
    }
  }
});
