Ember.Validations.validators.Base = Ember.Object.extend({
  init: function() {
    this.conditionals = {
      'if': this.get('options.if'),
      unless: this.get('options.unless')
    };
  },
  call: function (model) {
    throw 'Not implemented!';
  },
  validate: function(model) {
    var _this = this;
    if (this.canValidate(model)) {
      return Ember.RSVP.Promise(function(resolve, reject) {
        _this.call(model, resolve, reject);
      });
    }
  },
  canValidate: function(model) {
    if (typeof(this.conditionals) === 'object') {
      if (this.conditionals['if']) {
        if (typeof(this.conditionals['if']) === 'function') {
          return this.conditionals['if'](model);
        } else if (typeof(this.conditionals['if']) === 'string') {
          if (typeof(model[this.conditionals['if']]) === 'function') {
            return model[this.conditionals['if']]();
          } else {
            return model.get(this.conditionals['if']);
          }
        }
      } else if (this.conditionals.unless) {
        if (typeof(this.conditionals.unless) === 'function') {
          return !this.conditionals.unless(model);
        } else if (typeof(this.conditionals.unless) === 'string') {
          if (typeof(model[this.conditionals.unless]) === 'function') {
            return !model[this.conditionals.unless]();
          } else {
            return !model.get(this.conditionals.unless);
          }
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  },
});
