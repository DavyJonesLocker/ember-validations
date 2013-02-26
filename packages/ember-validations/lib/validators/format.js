Ember.Validations.validators.local.reopen({
  format: function(model, property, options, deferredObject) {
    /*jshint expr:true*/
    var message;

    if (options.constructor === RegExp) {
      options = { 'with': options };
    }

    if (options.message === undefined) {
      options.message = Ember.Validations.messages.render('invalid', options);
    }

    if (Ember.Validations.Utilities.isBlank(model.get(property))) {
      if (options.allowBlank === undefined) {
        model.errors.add(property, options.message);
      }
    } else if (options['with'] && !options['with'].test(model.get(property))) {
      model.errors.add(property, options.message);
    } else if (options.without && options.without.test(model.get(property))) {
      model.errors.add(property, options.message);
    }

    deferredObject && deferredObject.resolve();
  }
});
