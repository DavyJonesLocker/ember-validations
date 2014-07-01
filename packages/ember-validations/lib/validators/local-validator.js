Ember.Validations.validators.LocalValidator = Ember.Validations.validators.Base.extend({
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
  }.on('init')
});
