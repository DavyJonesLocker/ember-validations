Ember.Validations.validators.local.reopen({
  acceptance: function(model, property, options, deferredObject) {
    /*jshint expr:true*/
    if (options === true) {
      options = {};
    }

    if (options.message === undefined) {
      options.message = Ember.Validations.messages.render('accepted', options);
    }

    if (options.accept) {
      if (model.get(property) !== options.accept) {
        model.errors.add(property, options.message);
      }
    } else if (model.get(property) !== '1' && model.get(property) !== 1 && model.get(property) !== true) {
      model.errors.add(property, options.message);
    }
    deferredObject && deferredObject.resolve();
  }
});
