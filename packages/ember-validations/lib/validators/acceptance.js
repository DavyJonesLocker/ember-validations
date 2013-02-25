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
        deferredObject && deferredObject.resolve();
        return options.message;
      } else {
        deferredObject && deferredObject.resolve();
        return;
      }
    }
    if (model.get(property) !== '1' && model.get(property) !== 1 && model.get(property) !== true) {
      deferredObject && deferredObject.resolve();
      return options.message;
    }
    deferredObject && deferredObject.resolve();
  }
});
