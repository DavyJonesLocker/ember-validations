var model, Model, options, CustomValidator, validator;

module('Base Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    CustomValidator = Ember.Validations.validators.Base.extend({
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
