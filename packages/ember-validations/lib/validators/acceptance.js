Ember.Validations.validators.local.Acceptance = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();
    /*jshint expr:true*/
    if (this.options === true) {
      this.set('options', {});
    }

    if (this.options.message === undefined) {
      this.set('options.message', Ember.Validations.messages.render('accepted', this.options));
    }
  },
  validate: function(model, resolve, reject) {
    if (this.options.accept) {
      if (model.get(this.property) !== this.options.accept) {
        model.errors.add(this.property, this.options.message);
        return reject();
      }
    } else if (model.get(this.property) !== '1' && model.get(this.property) !== 1 && model.get(this.property) !== true) {
      model.errors.add(this.property, this.options.message);
      return reject();
    }
    return resolve();
  }
});
