Ember.Validations.validators.local.Exclusion = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();
    if (this.options.constructor === Array) {
      this.set('options', { 'in': this.options });
    }

    if (this.options.message === undefined) {
      this.set('options.message', Ember.Validations.messages.render('exclusion', this.options));
    }
  },
  call: function(resolve, reject) {
    /*jshint expr:true*/
    var message, lower, upper;

    if (Ember.Validations.Utilities.isBlank(this.model.get(this.property))) {
      if (this.options.allowBlank === undefined) {
        this.model.errors.add(this.property, this.options.message);
        return reject();
      }
    } else if (this.options['in']) {
      if (Ember.$.inArray(this.model.get(this.property), this.options['in']) !== -1) {
        this.model.errors.add(this.property, this.options.message);
        return reject();
      }
    } else if (this.options.range) {
      lower = this.options.range[0];
      upper = this.options.range[1];

      if (this.model.get(this.property) >= lower && this.model.get(this.property) <= upper) {
        this.model.errors.add(this.property, this.options.message);
        return reject();
      }
    }
    return resolve();
  }
});
