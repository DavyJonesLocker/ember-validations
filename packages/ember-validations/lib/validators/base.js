Ember.Validations.validators.Base = Ember.Object.extend({
  init: function() {
    this.set('errors', Ember.makeArray());
    this.isValid = undefined;
    this._dependentValidationKeys = Ember.makeArray();
    this.conditionals = {
      'if': this.get('options.if'),
      unless: this.get('options.unless')
    };
    this.model.addObserver(this.property, this, this.validate);
  },
  addObserversForDependentValidationKeys: function() {
    this._dependentValidationKeys.forEach(function(key) {
      this.model.addObserver(key, this, this.validate);
    }, this);
  }.on('init'),
  pushDependentValidaionKeyToModel: function() {
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
  validate: function() {
    if (this.canValidate()) {
      this.errors.clear();
      var validation_result = this.call();
      var validation_promise;      
      if (validation_result && typeof validation_result === 'object' && validation_result.constructor === Ember.RSVP.Promise) {
        validation_promise = validation_result;
      } else {
        validation_promise = Ember.RSVP.Promise(function(resolve) {
          resolve(validation_result);
        });
      }
      var self = this;
      return validation_promise.then(function() {
        if (self.errors.length > 0) {
          if (self.get('isValid') === false) {
            self.notifyPropertyChange('isValid');
          } else {
            self.set('isValid', false);
          }
          return Ember.RSVP.reject(self.get('model.errors'));
        } else {
          if (self.get('isValid') === true) {
            self.notifyPropertyChange('isValid');
          } else {
            self.set('isValid', true);
          }
          return Ember.RSVP.resolve(self.get('model.errors'));
        }
        
      });
    }
  }.on('init'),
  canValidate: function() {
    if (typeof(this.conditionals) === 'object') {
      if (this.conditionals['if']) {
        if (typeof(this.conditionals['if']) === 'function') {
          return this.conditionals['if'](this.model);
        } else if (typeof(this.conditionals['if']) === 'string') {
          if (typeof(this.model[this.conditionals['if']]) === 'function') {
            return this.model[this.conditionals['if']]();
          } else {
            return this.model.get(this.conditionals['if']);
          }
        }
      } else if (this.conditionals.unless) {
        if (typeof(this.conditionals.unless) === 'function') {
          return !this.conditionals.unless(this.model);
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
