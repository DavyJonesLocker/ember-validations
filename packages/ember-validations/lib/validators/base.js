Ember.Validations.validators.Base = Ember.Object.extend({
  init: function() {
    this.set('errors', Ember.makeArray());
    this._dependentValidationKeys = Ember.makeArray();
    this.conditionals = {
      'if': this.get('options.if'),
      unless: this.get('options.unless'),
      tokenizer: this.get('options.tokenizer')
    };
    this.model.addObserver(this.property, this, this._validate);
    this.abstractOptions();
  },
  abstractOptions: function() {
    var key, keysToSkip = [];
    for (key in this.conditionals) {
      keysToSkip.push(key);
    }
    if (this.options && typeof(this.options) === 'object') {
      // For memory/performance reasons, only clone original object if we have functions on the object
      if (this.hasDynamic(this.options, keysToSkip)) {
        // Clone the options object, so any transformations don't effect the original options
        this.options = this.cloneObject(this.options, keysToSkip);
        this.bindOptions(this.options);
      }
    }
  },
  hasDynamic: function(options, keysToSkip) {
    for(var key in options) {
      if (keysToSkip.contains(key))
        continue;
      var option = options[key];
      // Dynamic option property
      if (typeof(option) === 'object' && option.constructor === Object) {
        if (this.hasDynamic(option, keysToSkip)) return true;
      }
      else if (typeof(option) === 'function') {
        return true;
      }
    }
  },
  cloneObject: function(entity, keysToSkip) {
    if (typeof(entity) === 'object' && entity.constructor === Object) {
      var clone = {};
      for (var key in entity) {
        if (keysToSkip.contains(key)) continue; // Don't need to clone conditionals
        if (entity.hasOwnProperty(key)) clone[key] = this.cloneObject(entity[key], keysToSkip);
      }
      return clone;
    }
    return entity;
  },
  bindOptions: function(options) {
    for(var key in options) {
      var option = options[key];
      if (typeof(option) === 'object' && option.constructor === Object) {
        this.bindOptions(option);
      }
      else if (typeof(option) === 'function') {
        this.bindOption(options, key);
      }
    }
  },
  bindOption: function(options, key) {
    var option = options[key];
    if (delete options[key]) {
      var me = this;
      var getter = function() {
        return option(me.model);
      };
      if (Object.defineProperty) {
        Object.defineProperty(options, key, {
          get: getter,
          enumerable: true,
          configurable: true
        });
      }
      else if (Object.prototype.__defineGetter__) {
        Object.prototype.__defineGetter__.call(options, key, getter);
      } else {
        // Revert, getter/setter not supported
        options[key] = option;
      }
    }
  },
  addObserversForDependentValidationKeys: function() {
    this._dependentValidationKeys.forEach(function(key) {
      this.model.addObserver(key, this, this._validate);
    }, this);
  }.on('init'),
  pushDependentValidationKeyToModel: function() {
    var model = this.get('model');
    if (model._dependentValidationKeys[this.property] === undefined) {
      model._dependentValidationKeys[this.property] = Ember.makeArray();
    }
    model._dependentValidationKeys[this.property].addObjects(this._dependentValidationKeys);
  }.on('init'),
  call: function () {
    throw 'Not implemented!';
  },
  unknownProperty: function(key) {
    var model = this.get('model');
    if (model) {
      return model.get(key);
    }
  },
  isValid: Ember.computed.empty('errors.[]'),
  validate: function() {
    var self = this;
    return this._validate().then(function(success) {
      // Convert validation failures to rejects.
      var errors = self.get('model.errors');
      if (success) {
        return errors;
      } else {
        return Ember.RSVP.reject(errors);
      }
    });
  },
  _validate: function() {
    this.errors.clear();
    if (this.canValidate()) {
      this.call();
    }
    if (this.get('isValid')) {
      return Ember.RSVP.resolve(true);
    } else {
      return Ember.RSVP.resolve(false);
    }
  }.on('init'),
  canValidate: function() {
    if (typeof(this.conditionals) === 'object') {
      if (this.conditionals['if']) {
        if (typeof(this.conditionals['if']) === 'function') {
          return this.conditionals['if'](this.model, this.property);
        } else if (typeof(this.conditionals['if']) === 'string') {
          if (typeof(this.model[this.conditionals['if']]) === 'function') {
            return this.model[this.conditionals['if']]();
          } else {
            return this.model.get(this.conditionals['if']);
          }
        }
      } else if (this.conditionals.unless) {
        if (typeof(this.conditionals.unless) === 'function') {
          return !this.conditionals.unless(this.model, this.property);
        } else if (typeof(this.conditionals.unless) === 'string') {
          if (typeof(this.model[this.conditionals.unless]) === 'function') {
            return !this.model[this.conditionals.unless]();
          } else {
            return !this.model.get(this.conditionals.unless);
          }
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
});
