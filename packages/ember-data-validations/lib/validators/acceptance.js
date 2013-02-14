DS.Validations.validators.local.reopen({
  acceptance: function(model, property, options) {
    if (options.accept) {
      if (model.get(property) !== options.accept) {
        return options.message;
      } else {
        return;
      }
    }
    if (model.get(property) !== '1' && model.get(property) !== 1 && model.get(property) !== true) {
      return options.message;
    }
  }
});
