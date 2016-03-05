import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Object.extend({
  init: function() {
    set(this, 'errors', Ember.A());
    this.dependentValidationKeys = Ember.A();
    this.conditionals = {
      'if': get(this, 'options.if'),
      unless: get(this, 'options.unless')
    };
    this.model.addObserver(this.property, this, this._validate);
  },
  addObserversForDependentValidationKeys: Ember.on('init', function() {
    this.dependentValidationKeys.forEach(function(key) {
      this.model.addObserver(key, this, this._validate);
    }, this);
  }),
  pushConditionalDependentValidationKeys: Ember.on('init', function() {
    Ember.A(['if', 'unless']).forEach((conditionalKind) => {
      const conditional = this.conditionals[conditionalKind];
      if (typeof(conditional) === 'string' && typeof(this.model[conditional]) !== 'function') {
        this.dependentValidationKeys.pushObject(conditional);
      }
    });
  }),
  pushDependentValidationKeyToModel: Ember.on('init', function() {
    var model = get(this, 'model');
    if (model.dependentValidationKeys[this.property] === undefined) {
      model.dependentValidationKeys[this.property] = Ember.A();
    }
    model.dependentValidationKeys[this.property].addObjects(this.dependentValidationKeys);
  }),
  call: function () {
    throw 'Not implemented!';
  },
  unknownProperty: function(key) {
    var model = get(this, 'model');
    if (model) {
      return get(model, key);
    }
  },
  isValid: Ember.computed.empty('errors.[]'),
  isInvalid: Ember.computed.not('isValid'),
  validate: function() {
    return this._validate().then((success) => {
      const errors = this.errors;
      return success ? errors : Ember.RSVP.reject(errors);
    });
  },

  handlePropertyRetrievalError(error) {
    this.errors.pushObject(error);
  },

  _validate: Ember.on('init', function() {
    this.errors.clear();
    const isValid = get(this, 'isValid');

    if (!this.canValidate()) {
      return Ember.RSVP.resolve(isValid);
    }

    const valuePromise = get(this.model, this.property);
    return new Ember.RSVP.Promise((resolve) => {
      resolve(valuePromise);
    }).then((results) => {
      this.errors.clear();
      this.call(results);
      const isValid = get(this, 'isValid');
      return Ember.RSVP.resolve(isValid);
    }, (error) => {
      this.handlePropertyRetrievalError(error);
    });
  }),

  canValidate: function() {
    if (typeof(this.conditionals) === 'object') {
      if (this.conditionals['if']) {
        if (typeof(this.conditionals['if']) === 'function') {
          return this.conditionals['if'](this.model, this.property);
        } else if (typeof(this.conditionals['if']) === 'string') {
          if (typeof(this.model[this.conditionals['if']]) === 'function') {
            return this.model[this.conditionals['if']]();
          } else {
            return get(this.model, this.conditionals['if']);
          }
        }
      } else if (this.conditionals.unless) {
        if (typeof(this.conditionals.unless) === 'function') {
          return !this.conditionals.unless(this.model, this.property);
        } else if (typeof(this.conditionals.unless) === 'string') {
          if (typeof(this.model[this.conditionals.unless]) === 'function') {
            return !this.model[this.conditionals.unless]();
          } else {
            return !get(this.model, this.conditionals.unless);
          }
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  },
  compare: function (a, b, operator) {
    switch (operator) {
      case '==':  return a == b; // jshint ignore:line
      case '===': return a === b;
      case '>=':  return a >= b;
      case '<=':  return a <= b;
      case '>':   return a > b;
      case '<':   return a < b;
      default:    return false;
    }
  }
});
