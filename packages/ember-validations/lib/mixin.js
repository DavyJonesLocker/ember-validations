Ember.Validations.Mixin = Ember.Mixin.create({
  init: function() {
    this._super();
    this.set('errors', Ember.Validations.Errors.create());
    if (this.get('validations') === undefined) {
      this.set('validations', {});
    }
  },
  validate: function(filter) {
    var options, message, property, validator, toRun, value, index1, index2, valid = true, deferreds = [];
    var object = this;
    var canValidate = function(options, validator) {
      if (typeof(options) === 'object') {
        if (options.if) {
          if (typeof(options.if) === 'function') {
            return options.if(object, validator);
          } else if (typeof(options.if) === 'string') {
            if (typeof(object[options.if]) === 'function') {
              return object[options.if]();
            } else {
              return object.get(options.if);
            }
          }
        } else if (options.unless) {
          if (typeof(options.unless) === 'function') {
            return !options.unless(object, validator);
          } else if (typeof(options.unless) === 'string') {
            if (typeof(object[options.unless]) === 'function') {
              return !object[options.unless]();
            } else {
              return !object.get(options.unless);
            }
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    };
    if (filter !== undefined) {
      toRun = [filter];
    } else {
      toRun = Object.keys(object.validations);
    }
    for(index1 = 0; index1 < toRun.length; index1++) {
      property = toRun[index1];
      this.errors.set(property, undefined);
      delete this.errors[property];

      for(validator in object.validations[property]) {
        value = object.validations[property][validator];
        if (typeof(value) !== 'object' || (typeof(value) === 'object' && value.constructor !== Array)) {
          value = [value];
        }

        for(index2 = 0; index2 < value.length; index2++) {
          if (canValidate(value[index2], validator)) {
            var deferredObject = new Ember.Deferred();
            deferreds = deferreds.concat(deferredObject);
            message = Ember.Validations.validators.local[validator](object, property, value[index2], deferredObject);
          }
        }
      }
    }

    return Ember.RSVP.all(deferreds).then(function() {
      if (object.get('stateManager')) {
        if (Object.keys(object.errors).length === 0) {
          object.get('stateManager').transitionTo('uncommitted');
        } else {
          object.get('stateManager').transitionTo('invalid');
        }
      } else {
        object.set('isValid', Object.keys(object.errors).length === 0);
      }
    });
  }
});
