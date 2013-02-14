DS.Validations.validators.local.reopen({
  presence: function(model, property, options) {
    if (/^\s*$/.test(model.get(property) || '')) {
      return options.message;
    }
  }
});
