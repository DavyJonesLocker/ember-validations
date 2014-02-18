var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Email Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

// Test allowBlank

test('when allowing blank', function() {
  options = { 'message': 'failed validation', allowBlank: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Email.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Email.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});


// Test emails

test('when valid email', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Email.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'user&user+label@example.com');
  });
  deepEqual(validator.errors, []);
});

test('when email has space', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Email.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'user&user+ label@example.com');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when email has no domain extension', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Email.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'user&user+label@example');
  });
  deepEqual(validator.errors, ['failed validation']);
});


test('when email has no @ symbol', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Email.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'user&user+labelexample.com');
  });
  deepEqual(validator.errors, ['failed validation']);
});
