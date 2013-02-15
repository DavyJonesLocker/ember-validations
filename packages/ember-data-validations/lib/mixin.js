DS.Validations.Mixin = Ember.Object.create({
  errors: DS.Validations.Errors.create(),
  validate: function() {
    var options, message, property, validator;
    for(property in this.validations) {
      this.errors.set(property, undefined);
      delete this.errors[property];

      for(validator in this.validations[property]) {
        message = DS.Validations.validators.local[validator](this, property, this.validations[property][validator]);
        if (message) {
          this.errors.set(property, message);
          break;
        }
      }
    }
  }
});
