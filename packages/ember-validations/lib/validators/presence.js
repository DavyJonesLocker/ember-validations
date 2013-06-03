Ember.Validations.validators.local.Presence = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();
    /*jshint expr:true*/
    if (this.options === true) {
      this.options = {};
    }

    if (this.options.message === undefined) {
      this.options.message = Ember.Validations.messages.render('blank', this.options);
    }
  },
  validate: function(model, resolve, reject) {
    if (Ember.Validations.Utilities.isBlank(model.get(this.property))) {
      model.errors.add(this.property, this.options.message);
      return reject();
    }
    return resolve();
  }
});
