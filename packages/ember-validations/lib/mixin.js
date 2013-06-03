Ember.Validations.Mixin = Ember.Mixin.create({
  init: function() {
    this._super();
    this.set('errors', Ember.Validations.Errors.create());
    this.set('validators', Ember.A([]));
    if (this.get('validations') === undefined) {
      this.set('validations', {});
    }
    this.buildValidators();
  },
  buildValidators: function() {
    var index, findValidator, property, validator;

    findValidator = function(validator) {
      var klass = validator.classify();
      return Ember.Validations.validators.local[klass] || Ember.Validations.validator.remote[klass];
    };

    for (property in this.validations) {
      if (this.validations.hasOwnProperty(property)) {
        for (validator in this.validations[property]) {
          if (this.validations[property].hasOwnProperty(validator)) {
            this.validators.pushObject(findValidator(validator).create({property: property, options: this.validations[property][validator]}));
          }
        }
      }
    }
  },
  validate: function(property) {
    var model = this, promises;
    model.errors.clear();

    promises = this.validators.map(function(validator) {
      if (property) {
        if (validator.property === property) {
          return validator.run(model);
        }
      } else {
        return validator.run(model);
      }
    }).without(undefined);

    return Ember.RSVP.all(promises).then(function(x) {
      if (model.get('stateManager')) {
        if (model.get('isDirty')) {
          model.get('stateManager').transitionTo('uncommitted');
        }
      } else {
        model.set('isValid', true);
      }

      return Ember.RSVP.resolve();
    }, function() {
      if (model.get('stateManager')) {
        model.get('stateManager').transitionTo('invalid');
      } else {
        model.set('isValid', false);
      }

      return Ember.RSVP.reject();
    });
  }
});
