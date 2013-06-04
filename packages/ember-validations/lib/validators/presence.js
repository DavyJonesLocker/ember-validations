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
  call: function(resolve, reject) {
    if (Ember.Validations.Utilities.isBlank(this.model.get(this.property))) {
      this.model.errors.add(this.property, this.options.message);
      return reject();
    }
    return resolve();
  }
});
