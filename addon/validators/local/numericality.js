import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';
import Patterns from 'ember-validations/patterns';

var get = Ember.get;

export default Base.extend({
  init: function() {
    /*jshint expr:true*/
    var index, keys, key, digitGroupSeparator, decimalMark;
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
      this.options.messages.numericality = Messages.render('notANumber', this.options);
    }

    if (this.options.onlyInteger !== undefined && this.options.messages.onlyInteger === undefined) {
      this.options.messages.onlyInteger = Messages.render('notAnInteger', this.options);
    }

    keys = Ember.keys(this.CHECKS).concat(['odd', 'even']);
    for(index = 0; index < keys.length; index++) {
      key = keys[index];

      var prop = this.options[key];
      // I have no idea what the hell is going on here. This seems to do nothing.
      // The observer's key is being set to the values in the options hash?
      if (key in this.options && isNaN(prop)) {
        this.model.addObserver(prop, this, this._validate);
      }

      if (prop !== undefined && this.options.messages[key] === undefined) {
        if (Ember.$.inArray(key, Ember.keys(this.CHECKS)) !== -1) {
          this.options.count = prop;
        }
        this.options.messages[key] = Messages.render(key, this.options);
        if (this.options.count !== undefined) {
          delete this.options.count;
        }
      }
    }

    if (this.options.allowDigitGroupSeparators === true) {
      digitGroupSeparator = ',';
    } else if (this.options.allowDigitGroupSeparators !== undefined) {
      digitGroupSeparator = Patterns.escape(this.options.allowDigitGroupSeparators);
    }

    if (this.options.decimalMark !== undefined) {
      decimalMark = Patterns.escape(this.options.decimalMark);
    } else {
      decimalMark = '\\.';
    }

    if (this.options.onlyInteger) {
      if (digitGroupSeparator !== undefined) {
        this.pattern = new RegExp('^(-|\\+)?(?:\\d+|\\d{1,3}(?:' +digitGroupSeparator+ '\\d{3})+)$');
      } else {
        this.pattern = /^(-|\+)?\d+$/;
      }
    } else if (digitGroupSeparator !== undefined) {
      this.pattern = new RegExp('^(-|\\+)?(?:\\d+|\\d{1,3}(?:' +digitGroupSeparator+ '\\d{3})+)(?:' +decimalMark+ '\\d*)?$');
    } else {
      this.pattern = new RegExp('^(-|\\+)?\\d+(?:' +decimalMark+ '\\d*)?$');
    }
  },
  CHECKS: {
    equalTo              : '===',
    greaterThan          : '>',
    greaterThanOrEqualTo : '>=',
    lessThan             : '<',
    lessThanOrEqualTo    : '<='
  },
  call: function() {
    var check, checkValue, comparisonResult;

    if (Ember.isEmpty(get(this.model, this.property))) {
      if (this.options.allowBlank === undefined) {
        this.errors.pushObject(this.options.messages.numericality);
      }
    } else if (!this.pattern.test(get(this.model, this.property))) {
      if (this.options.onlyInteger === true) {
        this.errors.pushObject(this.options.messages.onlyInteger);
      } else {
        this.errors.pushObject(this.options.messages.numericality);
      }
    } else if (this.options.odd  && parseInt(get(this.model, this.property), 10) % 2 === 0) {
      this.errors.pushObject(this.options.messages.odd);
    } else if (this.options.even && parseInt(get(this.model, this.property), 10) % 2 !== 0) {
      this.errors.pushObject(this.options.messages.even);
    } else {
      for (check in this.CHECKS) {
        if (this.options[check] === undefined) {
          continue;
        }

        if (!isNaN(parseFloat(this.options[check])) && isFinite(this.options[check])) {
          checkValue = this.options[check];
        } else if (get(this.model, this.options[check]) !== undefined) {
          checkValue = get(this.model, this.options[check]);
        }

        comparisonResult = this.compare(
          get(this.model, this.property),
          checkValue,
          this.CHECKS[check]
        );

        if (!comparisonResult) {
          this.errors.pushObject(this.options.messages[check]);
        }
      }
    }
  }
});
