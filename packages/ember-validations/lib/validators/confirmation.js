Ember.Validations.validators.local.Confirmation = Ember.Validations.validators.Base.extend({
  init: function() {
    this.originalProperty = this.property;
    this.property = this.property + 'Confirmation';
    this._super();
    this._dependentValidationKeys.pushObject(this.originalProperty);
    /*jshint expr:true*/
    if (this.options === true) {
      this.set('options', { attribute: this.originalProperty });
      this.set('options', { message: Ember.Validations.messages.render('confirmation', this.options) });
    }
  },
  call: function() {
    var original = this.model.get(this.originalProperty);
    var confirmation = this.model.get(this.property);

    if(!Ember.isEmpty(original) || !Ember.isEmpty(confirmation)) {
      if (original !== confirmation) {
        this.errors.pushObject(this.options.message);
      }
    }
  }
});
