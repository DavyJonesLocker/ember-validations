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
  call: function(resolve, reject) {
    if (this.options.accept) {
      if (this.model.get(this.property) !== this.options.accept) {
        this.model.errors.add(this.property, this.options.message);
        return reject();
      }
    } else if (this.model.get(this.property) !== '1' && this.model.get(this.property) !== 1 && this.model.get(this.property) !== true) {
      this.model.errors.add(this.property, this.options.message);
      return reject();
    }
    return resolve();
  }
});
