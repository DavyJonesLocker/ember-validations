Ember.Validations.validators.remote.Uniqueness = Ember.Validations.validators.RemoteValidator.extend({
  setDefaultOptions: function() {
    var self         = this,
        propertyData = {};

    propertyData[this.property] = this.model.get(this.property);

    function options() {
      return {
        // Would like some feedback on a good default url endpoint for validation.
        // Was originally thinking something Ember.Router.namespace + this.property + '/uniqueness'
        // url: '/api/v1/' + this.property + '/uniqueness',
        message: Ember.Validations.messages.defaults.uniqueness,
        debounce: 300,
        errorOnStatus: [404, 422, 500],
        data: {
          object: self.get('model.model._attributes'),
          property: propertyData
        }
      };
    }

    this.set('options', options());
  },

  call: function() {
    var self = this,
        errorOnStatus = Ember.makeArray(this.get('options.errorOnStatus'));

    function resolveServerResponse(data, textStatus, xhr) {
      self.errors.clear();

      // Add errors if server responds with http status code contained within the errorOnStatus array.
      if (errorOnStatus.contains(data.status) || errorOnStatus.contains(xhr.status)) {
        self.errors.pushObject(self.options.message);
      }
    }

    // Use resolveServerResponse function for both resolve and reject states
    Ember.$.ajax(self.get('options')).then(resolveServerResponse, resolveServerResponse);
  }
});
