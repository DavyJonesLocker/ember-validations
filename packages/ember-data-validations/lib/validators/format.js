DS.Validations.validators.local.reopen({
  format: function(model, property, options) {
    var message = this.presence(model, property, options);

    if (message) {
      if (options.allow_blank === true) {
        return;
      } else {
        return message;
      }
    }

    if (options['with'] && !options['with'].test(model.get(property))) {
      return options.message;
    }

    if (options.without && options.without.test(model.get(property))) {
      return options.message;
    }
  }
});
