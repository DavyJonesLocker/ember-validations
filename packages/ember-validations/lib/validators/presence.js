Ember.Validations.validators.local.reopen({
  presence: function(model, property, options) {
    if (options === true) {
      options = {};
    }

    if (options.message === undefined) {
      options.message = Ember.Validations.messages.render('blank', options);
    }

    if (/^\s*$/.test(model.get(property) || '')) {
      return options.message;
    }
  }
});
