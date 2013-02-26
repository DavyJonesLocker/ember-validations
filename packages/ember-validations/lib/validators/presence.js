Ember.Validations.validators.local.reopen({
  presence: function(model, property, options, deferredObject) {
    /*jshint expr:true*/
    if (options === true) {
      options = {};
    }

    if (options.message === undefined) {
      options.message = Ember.Validations.messages.render('blank', options);
    }

    if (Ember.Validations.Utilities.isBlank(model.get(property))) {
      model.errors.add(property, options.message);
    }

    deferredObject && deferredObject.resolve();
  }
});
