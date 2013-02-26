var model, Model, options;

module('Acceptance Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    model = Model.create();
  }
});

test('when attribute is true', function() {
  model.set('attribute', true);
  options = { message: 'failed validation' };
  Ember.Validations.validators.local.acceptance(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when attribute is not true', function() {
  options = { message: 'failed validation' };
  Ember.Validations.validators.local.acceptance(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when attribute is value of 1', function() {
  model.set('attribute', 1);
  options = { message: 'failed validation' };
  Ember.Validations.validators.local.acceptance(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when attribute value is 2 and accept value is 2', function() {
  model.set('attribute', 2);
  options = { message: 'failed validation', accept: 2 };
  Ember.Validations.validators.local.acceptance(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when attribute value is 1 and accept value is 2', function() {
  model.set('attribute', 1);
  options = { message: 'failed validation', accept: 2 };
  Ember.Validations.validators.local.acceptance(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when options is true', function() {
  options = true;
  Ember.Validations.validators.local.acceptance(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['must be accepted']);
});

test('when no message is passed', function() {
  options = { accept: 2 };
  Ember.Validations.validators.local.acceptance(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['must be accepted']);
});

test('when deferred object is passed', function() {
  options = true;
  var deferredObject = new Ember.$.Deferred();
  Ember.Validations.validators.local.acceptance(model, 'attribute', options, deferredObject);
  equal(deferredObject.state(), 'resolved');
});
