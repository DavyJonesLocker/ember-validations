Ember.Validations.validators.local.reopen({
  numericality: function(model, property, options, deferredObject) {
    /*jshint expr:true*/
    var CHECKS, check, checkValue, fn, form, operator, val, index, keys, key;

    CHECKS = {
      equal_to                  :'===',
      greater_than              : '>',
      greater_than_or_equal_to  : '>=',
      less_than                 : '<',
      less_than_or_equal_to     : '<='
    };

    if (options === true) {
      options = {};
    }

    if (options.messages === undefined) {
      options.messages = { numericality: Ember.Validations.messages.render('not_a_number', options) };
    }

    if (options.only_integer !== undefined && options.messages.only_integer === undefined) {
      options.messages.only_integer = Ember.Validations.messages.render('not_an_integer', options);
    }

    keys = Object.keys(CHECKS).concat(['odd', 'even']);
    for(index = 0; index < keys.length; index++) {
      key = keys[index];
      if (options[key] !== undefined && options.messages[key] === undefined) {
        if (Ember.$.inArray(key, Object.keys(CHECKS)) !== -1) {
          options.count = options[key];
        }
        options.messages[key] = Ember.Validations.messages.render(key, options);
        if (options.count !== undefined) {
          delete options.count;
        }
      }
    }

    if (Ember.Validations.Utilities.isBlank(model.get(property))) {
      if (options.allow_blank === undefined) {
        model.errors.add(property, options.messages.numericality);
      }
    } else if (!Ember.Validations.patterns.numericality.test(model.get(property))) {
      model.errors.add(property, options.messages.numericality);
    } else if (options.only_integer === true && !(/^[+\-]?\d+$/.test(model.get(property)))) {
      model.errors.add(property, options.messages.only_integer);
    } else if (options.odd  && parseInt(model.get(property), 10) % 2 === 0) {
      model.errors.add(property, options.messages.odd);
    } else if (options.even && parseInt(model.get(property), 10) % 2 !== 0) {
      model.errors.add(property, options.messages.even);
    } else {

      for (check in CHECKS) {
        operator = CHECKS[check];

        if (options[check] === undefined) {
          continue;
        }

        if (!isNaN(parseFloat(options[check])) && isFinite(options[check])) {
          checkValue = options[check];
        } else if (model.get(options[check]) !== undefined) {
          checkValue = model.get(options[check]);
        } else {
          deferredObject && deferredObject.resolve();
          return;
        }

        fn = new Function('return ' + model.get(property) + ' ' + operator + ' ' + checkValue);

        if (!fn()) {
          model.errors.add(property, options.messages[check]);
        }
      }
    }
    deferredObject && deferredObject.resolve();
  }
});
