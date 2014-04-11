Ember.Validations.validators.local.Numericality = Ember.Validations.validators.Base.extend({
  init: function() {
    /*jshint expr:true*/
    var index, keys, key;
    this._super();

    if (this.options === true) {
      this.options = {};
    } else if (this.options.constructor === String) {
      key = this.options;
      this.options = {};
      this.options[key] = true;
    }

    if (this.options.messages === undefined || this.options.messages.numericality === undefined) {
      this.options.messages = this.options.messages || {};
      this.options.messages = { numericality: Ember.Validations.messages.render('notANumber', this.options) };
    }

    if (this.options.onlyInteger !== undefined && this.options.messages.onlyInteger === undefined) {
      this.options.messages.onlyInteger = Ember.Validations.messages.render('notAnInteger', this.options);
    }

    keys = Ember.keys(this.CHECKS).concat(['odd', 'even']);
    for(index = 0; index < keys.length; index++) {
      key = keys[index];

      var prop = this.options[key];
      if (key in this.options && isNaN(prop)) {
        this.model.addObserver(prop, this, this._validate);
      }

      if (prop !== undefined && this.options.messages[key] === undefined) {
        if (Ember.$.inArray(key, Ember.keys(this.CHECKS)) !== -1) {
          this.options.count = prop;
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

    if (Ember.isEmpty(this.model.get(this.property))) {
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
