Ember.Validations.validators.local.reopen({
  presence: function(model, property, options, deferredObject) {
    /*jshint expr:true*/
    if (options === true) {
      options = {};
    }

    if (options.message === undefined) {
      options.message = Ember.Validations.messages.render('blank', options);
    }

    if (/^\s*$/.test(model.get(property) || '')) {
      deferredObject && deferredObject.resolve();
      return options.message;
    }
    deferredObject && deferredObject.resolve();
  }
});
