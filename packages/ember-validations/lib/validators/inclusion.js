Ember.Validations.validators.local.reopen({
  inclusion: function(model, property, options, deferredObject) {
    /*jshint expr:true*/
    var message, lower, upper;

    if (options.constructor === Array) {
      options = { 'in': options };
    }

    if (options.message === undefined) {
      options.message = Ember.Validations.messages.render('inclusion', options);
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

    if (options['in']) {
      if (Ember.$.inArray(model.get(property), options['in']) === -1) {
        deferredObject && deferredObject.resolve();
        return options.message;
      }
    }

    if (options.range) {
      lower = options.range[0];
      upper = options.range[1];

      if (model.get(property) < lower || model.get(property) > upper) {
        deferredObject && deferredObject.resolve();
        return options.message;
      }
    }
    deferredObject && deferredObject.resolve();
  }
});
