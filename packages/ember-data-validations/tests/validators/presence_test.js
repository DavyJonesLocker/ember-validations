var model, options;

module('Presence Validator', {
  setup: function() {
    model = new DS.Model();
  }
});

test('when value is not empty', function() {
  model.set('attribute', 'not empty');
  options = { message: 'failed validation' };
  equal(DS.Validations.validators.local.presence(model, 'attribute', options), undefined);
});

test('when value is empty', function() {
  options = { message: 'failed validation' };
  equal(DS.Validations.validators.local.presence(model, 'attribute', options), 'failed validation');
});

test('when value is null from non-selected multi-select element', function() {
  options = { message: 'failed validation' };
  equal(DS.Validations.validators.local.presence(model, 'attribute', options), 'failed validation');
});
