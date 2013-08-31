Ember.Validations.validators.local.Absence = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();
    /*jshint expr:true*/
    if (this.options === true) {
      this.set('options', {});
    }

    if (this.options.message === undefined) {
      this.set('options.message', Ember.Validations.messages.render('present', this.options));
    }
  },
  call: function(resolve, reject) {
    if (!Ember.Validations.Utilities.isBlank(this.model.get(this.property))) {
      this.errors.pushObject(this.options.message);
      return reject();
    }
    return resolve();
  }
});
