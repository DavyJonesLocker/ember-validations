var model, options;

module('Format Validator', {
  setup: function() {
    model = new DS.Model();
  }
});

test('when matching format', function() {
  model.set('attribute',  '123');
  options = { 'message': 'failed validation', 'with': /\d+/ };
  equal(DS.Validations.validators.local.format(model, 'attribute', options), undefined);
});

test('when not matching format', function() {
  model.set('attribute', 'abc');
  options = { 'message': 'failed validation', 'with': /\d+/ };
  equal(DS.Validations.validators.local.format(model, 'attribute', options), 'failed validation');
});

test('when allowing blank', function() {
  options = { 'message': 'failed validation', 'with': /\d+/, 'allow_blank': true };
  equal(DS.Validations.validators.local.format(model, 'attribute', options), undefined);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  equal(DS.Validations.validators.local.format(model, 'attribute', options), 'failed validation');
});

test('when options is regexp', function() {
  options = /\d+/;
  equal(DS.Validations.validators.local.format(model, 'attribute', options), 'is invalid');
});

test('when no message is passed', function() {
  options = { 'with': /\d+/ };
  equal(DS.Validations.validators.local.format(model, 'attribute', options), 'is invalid');
});
