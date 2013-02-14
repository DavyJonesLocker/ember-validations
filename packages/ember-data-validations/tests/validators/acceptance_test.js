var model, options;

module('Acceptance Validator', {
  setup: function() {
    model = new DS.Model();
  }
});

test('when attribute is true', function() {
  model.set('attribute', true);
  options = { message: 'failed validation' };
  equal(DS.Validations.validators.local.acceptance(model, 'attribute', options), undefined);
});

test('when attribute is not true', function() {
  options = { message: 'failed validation' };
  equal(DS.Validations.validators.local.acceptance(model, 'attribute', options), 'failed validation');
});

test('when attribute is value of 1', function() {
  model.set('attribute', 1);
  options = { message: 'failed validation' };
  equal(DS.Validations.validators.local.acceptance(model, 'attribute', options), undefined);
});

test('when attribute value is 2 and accept value is 2', function() {
  model.set('attribute', 2);
  options = { message: 'failed validation', accept: 2 };
  equal(DS.Validations.validators.local.acceptance(model, 'attribute', options), undefined);
});

test('when attribute value is 1 and accept value is 2', function() {
  model.set('attribute', 1);
  options = { message: 'failed validation', accept: 2 };
  equal(DS.Validations.validators.local.acceptance(model, 'attribute', options), 'failed validation');
});
