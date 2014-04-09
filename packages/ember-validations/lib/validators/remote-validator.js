Ember.Validations.validators.RemoteValidator = Ember.Validations.validators.Base.extend({
  init: function() {
    /*jshint expr:true*/
    this._super();

    if (typeof(this.options) === 'function') {
      this.set('optionsCallBack', this.options);
    } else if (this.options === true) {
      // Do nothing
    } else {
      try {
        throw 'remote validations must be declared as a function';
      }
      catch(error) {
        Ember.Logger.error(error);
      }
    }

    this.set('options', {});
    this.setOptions();

    // Make model invalid by default
    // Not the best - should have a default error message that is added to the
    // errors hash before server validations have run. Eg: 'has not been validated'
    this.errors.pushObject(this.options.message);
  },

  _validate: function() {
    if (this.canValidate()) {
      this.validateRemotely();
    }
    if (this.get('isValid')) {
      return Ember.RSVP.resolve(true);
    } else {
      return Ember.RSVP.resolve(false);
    }
  }.on('init'),

  // Sets the options to send with the ajax request and wraps the call() funciton in a debounce
  validateRemotely: function() {
    this.setOptions();

    if (this.options.url !== undefined) {
      Ember.run.debounce(this, this.call, this.options.debounce);
    }
  },

  setOptions: function() {
    this.setDefaultOptions();

    // Run the optionsCallBack and merge it with the options hash if the validation was
    // declared as a function.
    if (this.get('optionsCallBack')) {
      // Maybe add a guard in here to check that the value returned by the optionsCallBack is a hash before trying to merge it.
      var updatedOptions = Ember.$.extend({}, this.get('options'), this.optionsCallBack());
      this.set('options', updatedOptions);
    }

    this.verifyRequiredOptions();
  },

  setDefaultOptions: function() {
    // This function can be overwritten to set default options for the ajax request.
    // Eg:
    //
    // this.set('options', {
      // url: '/api/v1/remote_validation',
      // debounce: 700,
      // errorOnStauts: [200, 500],
      // message: 'that email has been blacklisted....',
      // data: {
        // email: this.get('model.email')
      // }
    // });

    if (this.options.data === undefined) {
      this.set('options.data', {});
    }

    if (this.options.message === undefined) {
      this.set('options.message', Ember.Validations.messages.render('defaultRemoteValidation', this.options));
    }

    if (this.options.debounce === undefined) {
      this.set('options.debounce', 300);
    }

    if (this.options.errorOnStatus === undefined) {
      this.set('options.errorOnStatus', Ember.makeArray([404, 422, 500]));
    }
  },

  verifyRequiredOptions: function() {
    var self = this,
    requiredOptions = Ember.makeArray(['url', 'message', 'debounce', 'errorOnStatus']);

    requiredOptions.forEach(function(option) {
      // Throw error if option in requiredOptions array is undefined.
      if (self.get('options.' + option) === undefined) {
        try {
          throw 'must specify ' + option  + ' option for remote validation';
        }
        catch(error) {
          Ember.Logger.error(error);
        }
      }
    });
  },

  call: function() {
    this._super();

    // This function should be overwritten when creating a new Validator and inheriting from RemoteValidator.
    // It should initiate an asyc request to the back end, passing in self.get('options'). Errors should be cleared
    // out and added depending on the response from the server. Eg:
    //
    // var self = this,
    //     errorOnStatus = Ember.makeArray(this.get('options.errorOnStatus'));

    // function resolveServerResponse(data, textStatus, xhr) {
      // self.errors.clear();

      // // Add errors if server responds with http status code contained within the errorOnStatus array.
      // if (errorOnStatus.contains(data.status) || errorOnStatus.contains(xhr.status)) {
        // self.errors.pushObject(self.options.message);
      // }
    // }

    // // Use resolveServerResponse function for both resolve and reject states
    // Ember.$.ajax(self.get('options')).then(resolveServerResponse, resolveServerResponse);
  }
});
