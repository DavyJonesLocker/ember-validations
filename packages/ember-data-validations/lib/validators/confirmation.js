DS.Validations.validators.local.reopen({
  confirmation: function(model, property, options) {
    if (model.get(property) !== model.get('' + property + '_confirmation')) {
      return options.message;
    }
  }
});
