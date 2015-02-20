import Ember from 'ember';
import Messages from 'ember-validations/messages';

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
    var self = this;
    return this._validate().then(function(success) {
      // Convert validation failures to rejects.
      var errors = get(self, 'model.errors');
      if (success) {
        return errors;
      } else {
        return Ember.RSVP.reject(errors);
      }
    });
  },
  _validate: Ember.on('init', function() {
    this.errors.clear();
    if (this.canValidate()) {
      this.call();
    }
    if (get(this, 'isValid')) {
      return Ember.RSVP.resolve(true);
    } else {
      return Ember.RSVP.resolve(false);
    }
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
  },
  getMessage: function(attribute, context) {
    var container = get(this, 'container');
    var messageService = container.lookup('validations:messages');
    var message;
    if (messageService) {
      message = messageService.render(attribute, context);
    }
    // fall back if the message service did not have a message for the given attribute
    if (message === undefined) {
      message = Messages.render(attribute, context);
    }
    return message;
  }
});
