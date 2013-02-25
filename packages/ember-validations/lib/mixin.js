Ember.Validations.Mixin = Ember.Mixin.create({
  init: function() {
    this.set('errors', Ember.Validations.Errors.create());
    if (this.get('validations') === undefined) {
      this.set('validations', {});
    }
  },
  validate: function(filter) {
    var options, message, property, validator, toRun, value, index1, index2, valid = true, deferreds = [];
    var object = this;
    if (filter !== undefined) {
      toRun = [filter];
    } else {
      toRun = Object.keys(object.validations);
    }
    for(index1 = 0; index1 < toRun.length; index1++) {
      property = toRun[index1];
      this.errors.set(property, undefined);
      delete this.errors[property];

      for(validator in this.validations[property]) {
        value = object.validations[property][validator];
        if (typeof(value) !== 'object' || (typeof(value) === 'object' && value.constructor !== Array)) {
          value = [value];
        }

        for(index2 = 0; index2 < value.length; index2++) {
          var deferredObject = new Ember.Deferred();
          deferreds = deferreds.concat(deferredObject);
          message = Ember.Validations.validators.local[validator](object, property, value[index2], deferredObject);
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
    Ember.RSVP.all(deferreds).then(function() {
      object.set('isValid', valid);
    });
  }
});
