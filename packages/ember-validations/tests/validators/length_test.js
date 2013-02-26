var model, Model, options;

module('Length Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    model = Model.create();
  }
});

test('when allowed length is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { is: 'failed validation' }, is: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowed length is 3 and value length is 4', function() {
  model.set('attribute', '1234');
  options = { messages: { is: 'failed validation' }, is: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowed length is 3 and value length is 2', function() {
  model.set('attribute', '12');
  options = { messages: { is: 'failed validation' }, is: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowing blank and allowed length is 3', function() {
  options = { messages: { is: 'failed validation' }, is: 3, allowBlank: true };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowing blank and minimum length is 3 and maximum length is 100', function() {
  options = { messages: { minimum: 'failed minimum validation', maximum: 'failed maximum validation' }, minimum: 3, maximum: 100, allowBlank: true };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when not allowing blank and allowed length is 3', function() {
  options = { messages: { is: 'failed validation' }, is: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowed length is 3 and a differnet tokenizer', function() {
  model.set('attribute', 'one two three');
  options = { messages: { is: 'failed validation' }, is: 3, tokenizer: 'match(/\\w+/g)' };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowed length minimum is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { is: 'failed validation' }, is: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowed length minimum is 3 and value length is 2', function() {
  model.set('attribute', '12');
  options = { messages: { minimum: 'failed validation' }, minimum: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowed length maximum is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { is: 'failed validation' }, is: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowed length maximum is 3 and value length is 4', function() {
  model.set('attribute', '1234');
  options = { messages: { maximum: 'failed validation' }, maximum: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when options is a number', function() {
  model.set('attribute', '1234');
  options = 3;
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['is the wrong length (should be 3 characters)']);
});

test('when allowed length is 3, value length is 4 and no message is set', function() {
  model.set('attribute', '1234');
  options = { is: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['is the wrong length (should be 3 characters)']);
});

test('when allowed length minimum is 3, value length is 2 and no message is set', function() {
  model.set('attribute', '12');
  options = { minimum: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['is too short (minimum is 3 characters)']);
});

test('when allowed length maximum is 3, value length is 4 and no message is set', function() {
  model.set('attribute', '1234');
  options = { maximum: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['is too long (maximum is 3 characters)']);
});

test('when deferred object is passed', function() {
  options = 3;
  var deferredObject = new Ember.$.Deferred();
  Ember.Validations.validators.local.length(model, 'attribute', options, deferredObject);
  equal(deferredObject.state(), 'resolved');
});
