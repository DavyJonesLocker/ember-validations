Ember.Validations.validators.local.reopen({
  custom: function(model, property, validator, deferredObject) {
    /*jshint expr:true*/
    var message;

    message = model[validator]();

    if (message) {
      model.errors.add(property, message);
    }

    deferredObject && deferredObject.resolve();
  }
});