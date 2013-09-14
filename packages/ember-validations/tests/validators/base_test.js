var model, Model, options, CustomValidator, validator;

module('Base Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    CustomValidator = Ember.Validations.validators.Base.extend({
      init: function() {
        this._super();
        this._dependentValidationKeys.pushObject('otherAttribute');
      },
      call: function() {}
    });
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function() {
  Ember.run(function() {
    validator = CustomValidator.create({model: model, property: 'attribute'});
  });
  equal(validator.get('isValid'), true);
});

test('generates _dependentValidationKeys on the model', function() {
  Ember.run(function() {
    validator = CustomValidator.create({model: model, property: 'attribute'});
  });
  deepEqual(model.get('_dependentValidationKeys'), {attribute: ['otherAttribute']});
});
