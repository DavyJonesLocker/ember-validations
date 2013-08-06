Ember.Validations.validators.Base = Ember.Object.extend({
  init: function() {
    this.set('errors', Ember.makeArray());
    this.conditionals = {
      'if': this.get('options.if'),
      unless: this.get('options.unless')
    };
    this.model.addObserver(this.property, this, this.validate);
  },
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
    var _this = this;
    if (this.canValidate()) {
      return Ember.RSVP.Promise(function(resolve, reject) {
        _this.errors.clear();
        _this.call(resolve, reject);
      }).then(function() {
        if (_this.get('isValid') === true) {
          _this.notifyPropertyChange('isValid');
        } else {
          _this.set('isValid', true);
        }
        return Ember.RSVP.resolve();
      }, function() {
        if (_this.get('isValid') === false) {
          _this.notifyPropertyChange('isValid');
        } else {
          _this.set('isValid', false);
        }
        return Ember.RSVP.reject();
      });
    }
  },
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
