var model, options;

module('Length Validator', {
  setup: function() {
    model = new DS.Model();
  }
});

test('when allowed length is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { is: 'failed validation' }, is: 3 };
  equal(DS.Validations.validators.local.length(model, 'attribute', options), undefined);
});

test('when allowed length is 3 and value length is 4', function() {
  model.set('attribute', '1234');
  options = { messages: { is: 'failed validation' }, is: 3 };
  equal(DS.Validations.validators.local.length(model, 'attribute', options), 'failed validation');
});

test('when allowed length is 3 and value length is 2', function() {
  model.set('attribute', '12');
  options = { messages: { is: 'failed validation' }, is: 3 };
  equal(DS.Validations.validators.local.length(model, 'attribute', options), 'failed validation');
});

test('when allowing blank and allowed length is 3', function() {
  options = { messages: { is: 'failed validation' }, is: 3, allow_blank: true };
  equal(DS.Validations.validators.local.length(model, 'attribute', options), undefined);
});

test('when allowing blank and minimum length is 3 and maximum length is 100', function() {
  options = { messages: { minimum: 'failed minimum validation', maximum: 'failed maximum validation' }, minimum: 3, maximum: 100, allow_blank: true };
  equal(DS.Validations.validators.local.length(model, 'attribute', options), undefined);
});

test('when not allowing blank and allowed length is 3', function() {
  options = { messages: { is: 'failed validation' }, is: 3 };
  equal(DS.Validations.validators.local.length(model, 'attribute', options), 'failed validation');
});

test('when allowed length is 3 and a differnet tokenizer', function() {
  model.set('attribute', 'one two three');
  options = { messages: { is: 'failed validation' }, is: 3, tokenizer: 'match(/\\w+/g)' };
  equal(DS.Validations.validators.local.length(model, 'attribute', options), undefined);
});

test('when allowed length minimum is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { is: 'failed validation' }, is: 3 };
  equal(DS.Validations.validators.local.length(model, 'attribute', options), undefined);
});

test('when allowed length minimum is 3 and value length is 2', function() {
  model.set('attribute', '12');
  options = { messages: { minimum: 'failed validation' }, minimum: 3 };
  equal(DS.Validations.validators.local.length(model, 'attribute', options), 'failed validation');
});

test('when allowed length maximum is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { is: 'failed validation' }, is: 3 };
  equal(DS.Validations.validators.local.length(model, 'attribute', options), undefined);
});

test('when allowed length maximum is 3 and value length is 4', function() {
  model.set('attribute', '1234');
  options = { messages: { maximum: 'failed validation' }, maximum: 3 };
  equal(DS.Validations.validators.local.length(model, 'attribute', options), 'failed validation');
});

