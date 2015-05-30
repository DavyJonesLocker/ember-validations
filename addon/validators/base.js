import Ember from 'ember';

const {
  A,
  RSVP,
  computed,
  on
} = Ember;

const {
  empty,
  not
} = computed;

const EmberObject = Ember.Object;

const get = Ember.get;
const set = Ember.set;

export default EmberObject.extend({
  init() {
    set(this, 'errors', A());
    this.dependentValidationKeys = A();
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

  pushDependentValidationKeyToModel: on('init', function() {
    const model = get(this, 'model');
    if (model.dependentValidationKeys[this.property] === undefined) {
      model.dependentValidationKeys[this.property] = Ember.A();
    }
    model.dependentValidationKeys[this.property].addObjects(this.dependentValidationKeys);
  }),

  call() {
    throw 'Not implemented!';
  },

  unknownProperty(key) {
    const model = get(this, 'model');
    if (model) {
      return get(model, key);
    }
  },

  isValid: empty('errors.[]'),
  isInvalid: not('isValid'),

  validate() {
    const self = this;
    return this._validate().then(function(success) {
      // Convert validation failures to rejects.
      const errors = get(self, 'model.errors');
      if (success) {
        return errors;
      } else {
        return RSVP.reject(errors);
      }
    });
  },

  _validate: on('init', function() {
    this.errors.clear();
    if (this.canValidate()) {
      this.call();
    }
    if (get(this, 'isValid')) {
      return RSVP.resolve(true);
    } else {
      return RSVP.resolve(false);
    }
  }),

  canValidate() {
    if (typeof (this.conditionals) === 'object') {
      if (this.conditionals.if) {
        if (typeof (this.conditionals.if) === 'function') {
          return this.conditionals.if(this.model, this.property);
        } else if (typeof (this.conditionals.if) === 'string') {
          if (typeof (this.model[this.conditionals.if]) === 'function') {
            return this.model[this.conditionals.if]();
          } else {
            return get(this.model, this.conditionals.if);
          }
        }
      } else if (this.conditionals.unless) {
        if (typeof (this.conditionals.unless) === 'function') {
          return !this.conditionals.unless(this.model, this.property);
        } else if (typeof (this.conditionals.unless) === 'string') {
          if (typeof (this.model[this.conditionals.unless]) === 'function') {
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

  compare(a, b, operator) {
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
