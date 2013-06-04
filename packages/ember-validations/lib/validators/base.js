Ember.Validations.validators.Base = Ember.Object.extend({
  init: function() {
    this.conditionals = {
      'if': this.get('options.if'),
      unless: this.get('options.unless')
    };
  },
  call: function () {
    throw 'Not implemented!';
  },
  validate: function() {
    var _this = this;
    if (this.canValidate()) {
      return Ember.RSVP.Promise(function(resolve, reject) {
        _this.call(resolve, reject);
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
  },
});
