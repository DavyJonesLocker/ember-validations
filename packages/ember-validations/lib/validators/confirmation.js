Ember.Validations.validators.local.Confirmation = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();
    this.originalProperty = this.property;
    this.property = this.property + 'Confirmation';
    /*jshint expr:true*/
    if (this.options === true) {
      this.set('options', { attribute: this.originalProperty });
      this.set('options', { message: Ember.Validations.messages.render('confirmation', this.options) });
    }
  },
  call: function(resolve, reject) {
    if (this.model.get(this.originalProperty) !== this.model.get(this.property)) {
      this.model.errors.add(this.property, this.options.message);
      return reject();
    } else {
      return resolve();
    }
  }
});
