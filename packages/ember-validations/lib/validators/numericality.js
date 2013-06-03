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
  validate: function(model, resolve, reject) {
    var check, checkValue, fn, form, operator, val;

    if (Ember.Validations.Utilities.isBlank(model.get(this.property))) {
      if (this.options.allowBlank === undefined) {
        model.errors.add(this.property, this.options.messages.numericality);
        return reject();
      }
    } else if (!Ember.Validations.patterns.numericality.test(model.get(this.property))) {
      model.errors.add(this.property, this.options.messages.numericality);
      return reject();
    } else if (this.options.onlyInteger === true && !(/^[+\-]?\d+$/.test(model.get(this.property)))) {
      model.errors.add(this.property, this.options.messages.onlyInteger);
      return reject();
    } else if (this.options.odd  && parseInt(model.get(this.property), 10) % 2 === 0) {
      model.errors.add(this.property, this.options.messages.odd);
      return reject();
    } else if (this.options.even && parseInt(model.get(this.property), 10) % 2 !== 0) {
      model.errors.add(this.property, this.options.messages.even);
      return reject();
    } else {
      for (check in this.CHECKS) {
        operator = this.CHECKS[check];

        if (this.options[check] === undefined) {
          continue;
        }

        if (!isNaN(parseFloat(this.options[check])) && isFinite(this.options[check])) {
          checkValue = this.options[check];
        } else if (model.get(this.options[check]) !== undefined) {
          checkValue = model.get(this.options[check]);
        } else {
          return resolve();
        }

        fn = new Function('return ' + model.get(this.property) + ' ' + operator + ' ' + checkValue);

        if (!fn()) {
          model.errors.add(this.property, this.options.messages[check]);
          return reject();
        }
      }
    }
    return resolve();
  }
});
