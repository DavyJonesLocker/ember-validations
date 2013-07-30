var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Inclusion Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is in the list', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 1);
  });
  deepEqual(validator.errors, []);
});

test('when value is not in the list', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 4);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3], allowBlank: true };
  validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when value is in the range', function() {
  options = { 'message': 'failed validation', 'range': [1, 3] };
  validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 1);
  });
  deepEqual(validator.errors, []);
});

test('when value is not in the range', function() {
  options = { 'message': 'failed validation', 'range': [1, 3] };
  validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 4);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is array', function() {
  options = [1, 2, 3];
  validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is not included in the list']);
});

test('when no message is passed', function() {
  options = { in: [1, 2, 3] };
  validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is not included in the list']);
});
