import Ember from 'ember';

const { get, set, on, A } = Ember;
const { empty, not } = Ember.computed;
const { reject, resolve, Promise } = Ember.RSVP;

export default Ember.Object.extend({
  init: function() {
    set(this, 'errors', new A());
    this.dependentValidationKeys = new A();
    this.conditionals = {
      'if': get(this, 'options.if'),
      unless: get(this, 'options.unless')
    };
    this.model.addObserver(this.property, this, this._validate);
  },
  addObserversForDependentValidationKeys: on('init', function() {
    this.dependentValidationKeys.forEach(function(key) {
      this.model.addObserver(key, this, this._validate);
    }, this);
  }),
  pushConditionalDependentValidationKeys: on('init', function() {
    new A(['if', 'unless']).forEach((conditionalKind) => {
      let conditional = this.conditionals[conditionalKind];
      if (typeof(conditional) === 'string' && typeof(this.model[conditional]) !== 'function') {
        this.dependentValidationKeys.pushObject(conditional);
      }
    });
  }),
  pushDependentValidationKeyToModel: on('init', function() {
    let model = get(this, 'model');
    let dependentValidationKeys = model.dependentValidationKeys[this.property];
    if (dependentValidationKeys === undefined) {
      model.dependentValidationKeys[this.property] = new A();
    }
    model.dependentValidationKeys[this.property].addObjects(this.dependentValidationKeys);
  }),
  call: function () {
    throw 'Not implemented!';
  },
  unknownProperty: function(key) {
    let model = get(this, 'model');
    if (model) {
      return get(model, key);
    }
  },
  isValid: empty('errors.[]'),
  isInvalid: not('isValid'),
  validate: function() {
    return this._validate().then((success) => {
      let errors = this.errors;
      return success ? errors : reject(errors);
    });
  },
  handlePropertyRetrievalError(error) {
    this.errors.pushObject(error);
  },
  _validate: on('init', function() {
    this.errors.clear();
    let isValid = get(this, 'isValid');
    if (!this.canValidate()) {
      return resolve(isValid);
    }
    let valuePromise = get(this.model, this.property);
    return new Promise((resolve) => {
      resolve(valuePromise);
    }).then((results) => {
      this.errors.clear();
      this.call(results);
      let isValid = get(this, 'isValid');
      return resolve(isValid);
    }, (error) => {
      this.handlePropertyRetrievalError(error);
    });
  }),
  canValidate: function() {
    let conditionals = this.conditionals;
    if (typeof(conditionals) !== 'object') { return true; }

    let ifConditional = conditionals['if'];
    let unlessConditional = conditionals['unless'];

    if (ifConditional) {
      return this._handleConditional(ifConditional, false);
    } else if (unlessConditional) {
      return this._handleConditional(unlessConditional, true);
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
  },
  // invert handles the unless condition
  _handleConditional(conditional, invert=false) {
    let result;

    if (typeof(conditional) === 'function') {
      result = conditional(this.model, this.property);
    } else if (typeof(conditional) === 'string') {
      result = get(this.model, conditional);

      if (typeof(this.model[conditional]) === 'function') {
        result = this.model[conditional]();
      }
    }

    return invert ? !result : result;
  }

});
