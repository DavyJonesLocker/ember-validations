var model, options;

module('Length Validator', {
  setup: function() {
    model = new Ember.Object();
  }
});

test('when allowed length is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { is: 'failed validation' }, is: 3 };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), undefined);
});

test('when allowed length is 3 and value length is 4', function() {
  model.set('attribute', '1234');
  options = { messages: { is: 'failed validation' }, is: 3 };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), 'failed validation');
});

test('when allowed length is 3 and value length is 2', function() {
  model.set('attribute', '12');
  options = { messages: { is: 'failed validation' }, is: 3 };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), 'failed validation');
});

test('when allowing blank and allowed length is 3', function() {
  options = { messages: { is: 'failed validation' }, is: 3, allow_blank: true };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), undefined);
});

test('when allowing blank and minimum length is 3 and maximum length is 100', function() {
  options = { messages: { minimum: 'failed minimum validation', maximum: 'failed maximum validation' }, minimum: 3, maximum: 100, allow_blank: true };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), undefined);
});

test('when not allowing blank and allowed length is 3', function() {
  options = { messages: { is: 'failed validation' }, is: 3 };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), 'failed validation');
});

test('when allowed length is 3 and a differnet tokenizer', function() {
  model.set('attribute', 'one two three');
  options = { messages: { is: 'failed validation' }, is: 3, tokenizer: 'match(/\\w+/g)' };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), undefined);
});

test('when allowed length minimum is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { is: 'failed validation' }, is: 3 };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), undefined);
});

test('when allowed length minimum is 3 and value length is 2', function() {
  model.set('attribute', '12');
  options = { messages: { minimum: 'failed validation' }, minimum: 3 };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), 'failed validation');
});

test('when allowed length maximum is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { is: 'failed validation' }, is: 3 };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), undefined);
});

test('when allowed length maximum is 3 and value length is 4', function() {
  model.set('attribute', '1234');
  options = { messages: { maximum: 'failed validation' }, maximum: 3 };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), 'failed validation');
});

test('when options is a number', function() {
  model.set('attribute', '1234');
  options = 3;
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), 'is the wrong length (should be 3 characters)');
});

test('when allowed length is 3, value length is 4 and no message is set', function() {
  model.set('attribute', '1234');
  options = { is: 3 };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), 'is the wrong length (should be 3 characters)');
});

test('when allowed length minimum is 3, value length is 2 and no message is set', function() {
  model.set('attribute', '12');
  options = { minimum: 3 };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), 'is too short (minimum is 3 characters)');
});

test('when allowed length maximum is 3, value length is 4 and no message is set', function() {
  model.set('attribute', '1234');
  options = { maximum: 3 };
  equal(Ember.Validations.validators.local.length(model, 'attribute', options), 'is too long (maximum is 3 characters)');
});

test('when deferred object is passed', function() {
  options = 3;
  var deferredObject = new Ember.$.Deferred();
  Ember.Validations.validators.local.length(model, 'attribute', options, deferredObject);
  equal(deferredObject.state(), 'resolved');
});
