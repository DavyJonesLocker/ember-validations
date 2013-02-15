var model, options;

module('Exclusion Validator', {
  setup: function() {
    model = new DS.Model();
  }
});

test('when value is not in the list', function() {
  model.set('attribute', 4);
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  equal(DS.Validations.validators.local.exclusion(model, 'attribute', options), undefined);
});

test('when value is in the list', function() {
  model.set('attribute', 1);
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  equal(DS.Validations.validators.local.exclusion(model, 'attribute', options), 'failed validation');
});

test('when allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3], allow_blank: true };
  equal(DS.Validations.validators.local.exclusion(model, 'attribute', options), undefined);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  equal(DS.Validations.validators.local.exclusion(model, 'attribute', options), 'failed validation');
});

test('when value is not in the range', function() {
  model.set('attribute', 4);
  options = { 'message': 'failed validation', 'range': [1, 3] };
  equal(DS.Validations.validators.local.exclusion(model, 'attribute', options), undefined);
});

test('when value is in the range', function() {
  model.set('attribute', 1);
  options = { 'message': 'failed validation', 'range': [1, 3] };
  equal(DS.Validations.validators.local.exclusion(model, 'attribute', options), 'failed validation');
});

test('when options is array', function() {
  options = [1, 2, 3];
  equal(DS.Validations.validators.local.exclusion(model, 'attribute', options), 'is reserved');
});

test('when no message is passed', function() {
  options = { in: [1, 2, 3] };
  equal(DS.Validations.validators.local.exclusion(model, 'attribute', options), 'is reserved');
});
