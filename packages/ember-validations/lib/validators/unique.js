Ember.Validations.validators.local.Uniqueness = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();
    /*jshint expr:true*/

    // This only makes sense if we can get ember-validations to
    // build a default url endpoint.
    if (this.options === true) {
      this.set('options', {});
    }

    // It would be nice to get rid of this and have ember-validations
    // be smart enough to build a default url endpoint. Eg: for user email uniquness
    // default to /users/email_uniqueness or something similar
    if (this.options.url === undefined) {
      try {
        // This thrown error can be deleted if we can build a default url.
        throw 'Must specify url for uniqueness validation';
      }
      catch(error) {
        Ember.Logger.error(error)
      }
    }

    if (this.options.data === undefined) {
      this.set('options.data', {});
    } else {
      this.set('options.tmpData', this.options.data);
    }

    if (this.options.message === undefined) {
      this.set('options.message', Ember.Validations.messages.render('unique', this.options));
    }
  },

  setData: function() {
    // The data hash that is sent along with the ajax request defaults to a hash
    // that contains a property key (for the property being validated) and an
    // object key which is a proxy for the controller's model. Eg:
    //
    // data: {
    //  property: {
    //    email: 'test@example.com'
    //  },
    //  object: {
    //    email: 'test@example.com',
    //    username: 'Test'
    //  }
    // }
    //
    // Additional parameters can be added by passing in the data option to the validation:
    // validations: {
    //  email: {
    //    uniqueness: {
    //      url: 'http://localhost:3000/api/v1/unique_email',
    //      data: {
    //        otherParam: 'More data!'
    //      }
    //    }
    //  }
    // }
    var tmpData = {};
    var property = {};
    var modelProxy = this.get('model.model._attributes');

    property[this.property] = modelProxy[this.property];
    tmpData['property'] = property;
    tmpData['object'] = modelProxy;
    var data = Ember.$.extend(tmpData, this.get('options.tmpData'));

    this.set('options.data', data);
  },

  validateRemotely: function() {
    var self = this;
    this.setData();

    Ember.$.ajax(self.get('options')).then(null,
      function(data, textStatus, xhr) {
        // check to see if response status is 400 or 422
        // If the response status is some other 4xx response or a 500 we don't
        // want to add errors.
        if (data.status == 400 || data.status == 422) {
          self.errors.pushObject(self.options.message);
        }
      });
  },

  call: function() {
    var self = this;

    if (!Ember.isEmpty(self.model.get(self.property))) {
      Ember.run.debounce(self, self.validateRemotely, self.getWithDefault('options.debounce', 300));
    }
  }
});
