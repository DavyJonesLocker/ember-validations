var model, options;

module('Acceptance Validator', {
  setup: function() {
    model = new Ember.Object();
  }
});

test('when attribute is true', function() {
  model.set('attribute', true);
  options = { message: 'failed validation' };
  equal(Ember.Validations.validators.local.acceptance(model, 'attribute', options), undefined);
});

test('when attribute is not true', function() {
  options = { message: 'failed validation' };
  equal(Ember.Validations.validators.local.acceptance(model, 'attribute', options), 'failed validation');
});

test('when attribute is value of 1', function() {
  model.set('attribute', 1);
  options = { message: 'failed validation' };
  equal(Ember.Validations.validators.local.acceptance(model, 'attribute', options), undefined);
});

test('when attribute value is 2 and accept value is 2', function() {
  model.set('attribute', 2);
  options = { message: 'failed validation', accept: 2 };
  equal(Ember.Validations.validators.local.acceptance(model, 'attribute', options), undefined);
});

test('when attribute value is 1 and accept value is 2', function() {
  model.set('attribute', 1);
  options = { message: 'failed validation', accept: 2 };
  equal(Ember.Validations.validators.local.acceptance(model, 'attribute', options), 'failed validation');
});

test('when options is true', function() {
  options = true;
  equal(Ember.Validations.validators.local.acceptance(model, 'attribute', options), 'must be accepted');
});

test('when no message is passed', function() {
  options = { accept: 2 };
  equal(Ember.Validations.validators.local.acceptance(model, 'attribute', options), 'must be accepted');
});

test('when deferred object is passed', function() {
  options = true;
  var deferredObject = new Ember.$.Deferred();
  Ember.Validations.validators.local.acceptance(model, 'attribute', options, deferredObject);
  equal(deferredObject.state(), 'resolved');
});
