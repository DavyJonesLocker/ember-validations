Ember.Validations.validators.local.Email = Ember.Validations.validators.Base.extend({
  regexp: null,

  init: function() {
    this._super();

    if (this.get('options.message') === undefined) {
      this.set('options.message', Ember.Validations.messages.render('email', this.options));
    }

    // Build Regular Expression
    // http://www.regular-expressions.info/email.html
    var regex_str = "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$";


    // RegExp
    this.regexp = new RegExp(regex_str);
  },
  call: function() {
    var email = this.model.get(this.property);

    if (Ember.isEmpty(email)) {
      if (this.get('options.allowBlank') !== true) {
        this.errors.pushObject(this.get('options.message'));
      }
    } else if (!this.regexp.test(email)) {
      this.errors.pushObject(this.get('options.message'));
    }
  }
});


