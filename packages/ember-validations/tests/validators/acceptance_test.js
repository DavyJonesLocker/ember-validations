var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Acceptance Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    model = Model.create();
  }
});

test('when attribute is true', function() {
  model.set('attribute', true);
  options = { message: 'failed validation' };
  validator = Ember.Validations.validators.local.Acceptance.create({property: 'attribute', options: options});
  validator.call(model, pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when attribute is not true', function() {
  options = { message: 'failed validation' };
  validator = Ember.Validations.validators.local.Acceptance.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when attribute is value of 1', function() {
  model.set('attribute', 1);
  options = { message: 'failed validation' };
  validator = Ember.Validations.validators.local.Acceptance.create({property: 'attribute', options: options});
  validator.call(model, pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when attribute value is 2 and accept value is 2', function() {
  model.set('attribute', 2);
  options = { message: 'failed validation', accept: 2 };
  validator = Ember.Validations.validators.local.Acceptance.create({property: 'attribute', options: options});
  validator.call(model, pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when attribute value is 1 and accept value is 2', function() {
  model.set('attribute', 1);
  options = { message: 'failed validation', accept: 2 };
  validator = Ember.Validations.validators.local.Acceptance.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when options is true', function() {
  options = true;
  validator = Ember.Validations.validators.local.Acceptance.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['must be accepted']);
});

test('when no message is passed', function() {
  options = { accept: 2 };
  validator = Ember.Validations.validators.local.Acceptance.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['must be accepted']);
});
