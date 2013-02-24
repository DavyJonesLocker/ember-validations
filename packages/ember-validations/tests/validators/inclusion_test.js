var model, options;

module('Inclusion Validator', {
  setup: function() {
    model = new Ember.Object();
  }
});

test('when value is in the list', function() {
  model.set('attribute', 1);
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  equal(Ember.Validations.validators.local.inclusion(model, 'attribute', options), undefined);
});

test('when value is not in the list', function() {
  model.set('attribute', 4);
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  equal(Ember.Validations.validators.local.inclusion(model, 'attribute', options), 'failed validation');
});

test('when allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3], allow_blank: true };
  equal(Ember.Validations.validators.local.inclusion(model, 'attribute', options), undefined);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  equal(Ember.Validations.validators.local.inclusion(model, 'attribute', options), 'failed validation');
});

test('when value is in the range', function() {
  model.set('attribute', 1);
  options = { 'message': 'failed validation', 'range': [1, 3] };
  equal(Ember.Validations.validators.local.inclusion(model, 'attribute', options), undefined);
});

test('when value is not in the range', function() {
  model.set('attribute', 4);
  options = { 'message': 'failed validation', 'range': [1, 3] };
  equal(Ember.Validations.validators.local.inclusion(model, 'attribute', options), 'failed validation');
});

test('when options is array', function() {
  options = [1, 2, 3];
  equal(Ember.Validations.validators.local.inclusion(model, 'attribute', options), 'is not included in the list');
});

test('when no message is passed', function() {
  options = { in: [1, 2, 3] };
  equal(Ember.Validations.validators.local.inclusion(model, 'attribute', options), 'is not included in the list');
});
