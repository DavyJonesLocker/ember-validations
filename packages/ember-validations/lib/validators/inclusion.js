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

    if (Ember.Validations.Utilities.isBlank(model.get(property))) {
      if (options.allowBlank === undefined) {
        model.errors.add(property, options.message);
      }
    } else if (options['in']) {
      if (Ember.$.inArray(model.get(property), options['in']) === -1) {
        model.errors.add(property, options.message);
      }
    } else if (options.range) {
      lower = options.range[0];
      upper = options.range[1];

      if (model.get(property) < lower || model.get(property) > upper) {
        model.errors.add(property, options.message);
      }
    }
    deferredObject && deferredObject.resolve();
  }
});
