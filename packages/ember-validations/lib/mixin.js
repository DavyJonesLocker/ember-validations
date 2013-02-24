Ember.Validations.Mixin = Ember.Mixin.create({
  init: function() {
    this.set('errors', Ember.Validations.Errors.create());
    if (this.get('validations') === undefined) {
      this.set('validations', {});
    }
  },
  validate: function(filter) {
    var options, message, property, validator, toRun, value, index1, index2, valid = true;
    if (filter !== undefined) {
      toRun = [filter];
    } else {
      toRun = Object.keys(this.validations);
    }
    for(index1 = 0; index1 < toRun.length; index1++) {
      property = toRun[index1];
      this.errors.set(property, undefined);
      delete this.errors[property];

      for(validator in this.validations[property]) {
        value = this.validations[property][validator];
        if (typeof(value) !== 'object' || (typeof(value) === 'object' && value.constructor !== Array)) {
          value = [value];
        }

        for(index2 = 0; index2 < value.length; index2++) {
          message = Ember.Validations.validators.local[validator](this, property, value[index2]);
          if (message) {
            break;
          }
        }

        if (message) {
          this.errors.set(property, message);
          valid = false;
          break;
        }
      }
    }

    return valid;
  }
});
