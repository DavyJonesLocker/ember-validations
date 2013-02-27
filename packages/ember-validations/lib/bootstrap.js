Ember.Application.reopen({
  bootstrapValidations: function(validations) {
    var objectName, property, validator, option, value, tmp,
    normalizedValidations = {}, existingValidations;
    function normalizeObject(object) {
      var key, value, normalizedObject = {};

      for (key in object) {
        if (typeof(object[key]) === 'object') {
          value = normalizeObject(object[key]);
        } else {
          value = object[key];
        }
        normalizedObject[key.camelize()] = value;
      }
      return normalizedObject;
    }

    for (objectName in validations) {
      existingValidations = (new this[objectName.camelize().capitalize()]()).get('validations');
      normalizedValidations = normalizeObject(validations[objectName]);
      this[objectName.camelize().capitalize()].reopen({
        validations: Ember.$.extend(true, {}, normalizedValidations, existingValidations)
      });

    }
  }
});
