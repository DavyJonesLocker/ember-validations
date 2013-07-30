Ember.Validations.validators.local.Confirmation = Ember.Validations.validators.Base.extend({
  init: function() {
    this.originalProperty = this.property;
    this.property = this.property + 'Confirmation';
    this._super();
    this.model.addObserver(this.originalProperty, this, this.validate);
    /*jshint expr:true*/
    if (this.options === true) {
      this.set('options', { attribute: this.originalProperty });
      this.set('options', { message: Ember.Validations.messages.render('confirmation', this.options) });
    }
  },
  call: function(resolve, reject) {
    if (this.model.get(this.originalProperty) !== this.model.get(this.property)) {
      this.errors.pushObject(this.options.message);
      return reject();
    } else {
      return resolve();
    }
  }
});
