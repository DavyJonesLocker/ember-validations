var model, Model, options, validator;

module('Presence Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Presence.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'not empty');
  });
  deepEqual(validator.errors, []);
});

test('when value is empty', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Presence.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is true', function() {
  options = true;
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Presence.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ["can't be blank"]);
});
