Ember.Validations.Mixin = Ember.Mixin.create({
  init: function() {
    this._super();
    this.set('errors', Ember.Validations.Errors.create());
    if (this.get('validations') === undefined) {
      this.set('validations', {});
    }
    this.buildValidators();
    this.addObserver('validators.@each.isValid', this, function(sender, key, value, context, rev) {
      if (this.validators.filterProperty('isValid', false).get('length') > 0) {
        this.set('isValid', false);
      } else {
        this.set('isValid', true);
      }
    });
    this.validators.forEach(function(validator) {
      validator.addObserver('errors.[]', this, function(sender, key, value, context, rev) {
        var errors = Ember.makeArray();
        this.validators.forEach(function(validator) {
          if (validator.property === sender.property) {
            errors = errors.concat(validator.errors);
          }
        }, this);
        this.set('errors.' + sender.property, errors);
      });
    }, this);
    this.validate();
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
  validate: function() {
    var model = this, promises;

    promises = this.validators.map(function(validator) {
      return validator.validate();
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
