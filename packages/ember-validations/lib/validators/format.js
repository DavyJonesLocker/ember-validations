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

    message = this.presence(model, property, options);

    if (message) {
      if (options.allow_blank === true) {
        deferredObject && deferredObject.resolve();
        return;
      } else {
        deferredObject && deferredObject.resolve();
        return message;
      }
    }

    if (options['with'] && !options['with'].test(model.get(property))) {
      deferredObject && deferredObject.resolve();
      return options.message;
    }

    if (options.without && options.without.test(model.get(property))) {
      deferredObject && deferredObject.resolve();
      return options.message;
    }
    deferredObject && deferredObject.resolve();
  }
});
