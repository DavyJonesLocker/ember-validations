import Ember from 'ember';

const {
  A: emberArray,
  Object: EmberObject,
  RSVP: { reject, resolve },
  computed: { empty, not },
  get,
  on,
  set
} = Ember;

export default EmberObject.extend({
  init() {
    set(this, 'errors', emberArray());
    this.dependentValidationKeys = emberArray();
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
    emberArray(['if', 'unless']).forEach((conditionalKind) => {
      let conditional = this.conditionals[conditionalKind];
      if (typeof conditional === 'string' && typeof this.model[conditional] !== 'function') {
        this.dependentValidationKeys.pushObject(conditional);
      }
    });
  }),

  pushDependentValidationKeyToModel: on('init', function() {
    let model = get(this, 'model');
    if (model.dependentValidationKeys[this.property] === undefined) {
      model.dependentValidationKeys[this.property] = emberArray();
    }
    model.dependentValidationKeys[this.property].addObjects(this.dependentValidationKeys);
  }),

  call() {
    throw 'Not implemented!';
  },

  unknownProperty(key) {
    let model = get(this, 'model');
    if (model) {
      return get(model, key);
    }
  },

  isValid: empty('errors.[]'),
  isInvalid: not('isValid'),

  validate() {
    return this._validate().then((success) => {
      // Convert validation failures to rejects.
      let errors = get(this, 'model.errors');
      if (success) {
        return errors;
      } else {
        return reject(errors);
      }
    });
  },

  _validate: on('init', function() {
    this.errors.clear();
    if (this.canValidate()) {
      this.call();
    }
    if (get(this, 'isValid')) {
      return resolve(true);
    } else {
      return resolve(false);
    }
  }),

  canValidate() {
    if (typeof this.conditionals === 'object') {
      if (this.conditionals['if']) {
        if (typeof this.conditionals['if'] === 'function') {
          return this.conditionals['if'](this.model, this.property);
        } else if (typeof this.conditionals['if'] === 'string') {
          if (typeof this.model[this.conditionals['if']] === 'function') {
            return this.model[this.conditionals['if']]();
          } else {
            return get(this.model, this.conditionals['if']);
          }
        }
      } else if (this.conditionals.unless) {
        if (typeof this.conditionals.unless === 'function') {
          return !this.conditionals.unless(this.model, this.property);
        } else if (typeof this.conditionals.unless === 'string') {
          if (typeof this.model[this.conditionals.unless] === 'function') {
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
