Ember.Validations.validators.local.Format = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();
    if (this.options.constructor === RegExp) {
      this.set('options', { 'with': this.options });
    }

    if (this.options.message === undefined) {
      this.set('options.message',  Ember.Validations.messages.render('invalid', this.options));
    }
   },
   call: function(resolve, reject) {
    if (Ember.Validations.Utilities.isBlank(this.model.get(this.property))) {
      if (this.options.allowBlank === undefined) {
        this.model.errors.add(this.property, this.options.message);
        return reject();
      }
    } else if (this.options['with'] && !this.options['with'].test(this.model.get(this.property))) {
      this.model.errors.add(this.property, this.options.message);
      return reject();
    } else if (this.options.without && this.options.without.test(this.model.get(this.property))) {
      this.model.errors.add(this.property, this.options.message);
      return reject();
    }
    return resolve();
  }
});
