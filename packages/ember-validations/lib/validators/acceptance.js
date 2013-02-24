Ember.Validations.validators.local.reopen({
  acceptance: function(model, property, options) {
    if (options === true) {
      options = {};
    }

    if (options.message === undefined) {
      options.message = Ember.Validations.messages.render('accepted', options);
    }

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
