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
  validate: function(model, resolve, reject) {
    if (model.get(this.originalProperty) !== model.get(this.property)) {
      model.errors.add(this.property, this.options.message);
      return reject();
    } else {
      return resolve();
    }
  }
});
