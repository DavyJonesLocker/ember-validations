Ember.Validations.Mixin = Ember.Mixin.create({
  init: function() {
    this._super();
    this.set('errors', Ember.Validations.Errors.create());
    if (this.get('validations') === undefined) {
      this.set('validations', {});
    }
  },
  buildValidators: function() {
    this.set('validators', Ember.A([]));
    if (this.validations.constructor === Array) {
      this.buildCompositeValidators(this.validations);
    } else {
      this.buildPropertyValidators(this.validations);
    }
  },
  buildCompositeValidators: function(validations) {
    var i, validator;

    for (i = 0; i < validations.length; i++) {
      validator = validations[i];

      if (validator.constructor === Object && validator.validate === undefined) {
        this.buildPropertyValidators(validator);
      } else {
        this.validators.pushObject(validator);
      }
    }
  },
  buildPropertyValidators: function(validations) {
    var findValidator, property, validator;

    findValidator = function(validator) {
      var klass = validator.classify();
      return Ember.Validations.validators.local[klass] || Ember.Validations.validators.remote[klass];
    };

    for (property in validations) {
      if (validations.hasOwnProperty(property)) {
        for (validator in validations[property]) {
          if (validations[property].hasOwnProperty(validator)) {
            this.validators.pushObject(findValidator(validator).create({model: this, property: property, options: validations[property][validator]}));
          }
        }
      }
    }
  },
  validate: function(property) {
    var model = this, promises;
    this.buildValidators();
    model.errors.clear();

    promises = this.validators.map(function(validator) {
      if (property) {
        if (validator.property === property) {
          return validator.validate();
        }
      } else {
        return validator.validate();
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
