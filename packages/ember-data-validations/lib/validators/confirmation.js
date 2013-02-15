DS.Validations.validators.local.reopen({
  confirmation: function(model, property, options) {
    if (options === true) {
      options = { attribute: property };
      options = { message: DS.Validations.messages.render('confirmation', options) };
    }

    if (model.get(property) !== model.get('' + property + '_confirmation')) {
      return options.message;
    }
  }
});
