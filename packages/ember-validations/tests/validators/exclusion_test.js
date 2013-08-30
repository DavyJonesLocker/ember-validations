var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Exclusion Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is not in the list', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 4);
  });
  deepEqual(validator.errors, []);
});

test('when value is in the list', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 1);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3], allowBlank: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
  });
  deepEqual(validator.errors, []);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when value is not in the range', function() {
  options = { 'message': 'failed validation', 'range': [1, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 4);
  });
  deepEqual(validator.errors, []);
});

test('when value is in the range', function() {
  options = { 'message': 'failed validation', 'range': [1, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 1);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is an array', function() {
  options = [1, 2, 3];
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is reserved']);
});

test('when no message is passed', function() {
  options = { in: [1, 2, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is reserved']);
});
