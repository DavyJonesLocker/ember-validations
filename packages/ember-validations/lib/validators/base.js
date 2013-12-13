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
    this.errors.clear();
    if (this.canValidate()) {
      this.call();
    }
    if (this.errors.length > 0) {
      if (this.get('isValid') === false) {
        this.notifyPropertyChange('isValid');
      } else {
        this.set('isValid', false);
      }
      return Ember.RSVP.reject(this.get('model.errors'));
    } else {
      if (this.get('isValid') === true) {
        this.notifyPropertyChange('isValid');
      } else {
        this.set('isValid', true);
      }
      return Ember.RSVP.resolve(this.get('model.errors'));
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
