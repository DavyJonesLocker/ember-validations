Ember.Validations.validators.local.reopen({
  confirmation: function(model, property, options, deferredObject) {
    /*jshint expr:true*/
    var propertyToMatch = property.substring(0, property.length - 'Confirmation'.length);
    if (options === true) {
      options = { propertyToMatch: propertyToMatch };
      options = { message: Ember.Validations.messages.render('confirmation', options) };
    }
    if (model.get(property) !== model.get(propertyToMatch)) {
      model.errors.add(property, options.message);
    }
    deferredObject && deferredObject.resolve();
  }

});
