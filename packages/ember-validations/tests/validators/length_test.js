var model, Model, options;

module('Length Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    model = Model.create();
  }
});

test('when allowed length is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowed length is 3 and value length is 4', function() {
  model.set('attribute', '1234');
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowed length is 3 and value length is 2', function() {
  model.set('attribute', '12');
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowing blank and allowed length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3, allowBlank: true };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowing blank and minimum length is 3 and maximum length is 100', function() {
  options = { messages: { tooShort: 'failed minimum validation', tooLong: 'failed maximum validation' }, minimum: 3, maximum: 100, allowBlank: true };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when not allowing blank and allowed length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowed length is 3 and a differnet tokenizer', function() {
  model.set('attribute', 'one two three');
  options = { messages: { wrongLength: 'failed validation' }, is: 3, tokenizer: 'match(/\\w+/g)' };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowed length minimum is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowed length minimum is 3 and value length is 2', function() {
  model.set('attribute', '12');
  options = { messages: { tooShort: 'failed validation' }, minimum: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowed length maximum is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowed length maximum is 3 and value length is 4', function() {
  model.set('attribute', '1234');
  options = { messages: { tooLong: 'failed validation' }, maximum: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowed length maximum is 3 and value is blank', function() {
  model.set('attribute', '');
  options = { maximum: 3 };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), undefined);
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

test('when passed a model property as maximum value, value is 2 and maximum is 4', function() {
	model.set('attribute', 'ab');
	model.set('validationProperty', 4);
	options = { maximum: 'validationProperty' };
	Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when passed a model property as maximum value, value is 2 and maximum is 2', function() {
	model.set('attribute', 'ab');
	model.set('validationProperty', 2);
	options = { maximum: 'validationProperty'};
	Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when passed a model property as maximum value, value is 2 and maximum is 1', function() {
  model.set('attribute', 'ab');
  model.set('validationProperty', 1);
  options = { maximum: 'validationProperty'};
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['is too long (maximum is 1 characters)']);
});

test('when passed a model property as minimum value, value is 1 and minimum is 1', function() {
  model.set('attribute', 'a');
  model.set('validationProperty', 1);
  options = { minimum: 'validationProperty' };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when passed a model attribute as minimum value, value is 1 and minimum is 0', function() {
  model.set('attribute', 'a');
  model.set('validationProperty', 0);
  options = { minimum: 'validationProperty' };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when passed a model attribute as minimum value, value is 1 and minimum is 2', function() {
  model.set('attribute', 'a');
  model.set('validationProperty', 2);
  options = { minimum: 'validationProperty' };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['is too short (minimum is 2 characters)']);
});

test('when passed a model attribute as a number value, value is 1 and number value is 1', function() {
  model.set('attribute', 'a');
  model.set('validationProperty', 1);
  options = { is: 'validationProperty' };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when passed a model attribute as a number value, value is 1 and number value is 2', function() {
  model.set('attribute', 'a');
  model.set('validationProperty', 2);
  options = { is: 'validationProperty' };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['is the wrong length (should be 2 characters)']);
});

test('when passed a model attribute as a number value, value is 3 and number value is 2', function() {
  model.set('attribute', 'abc');
  model.set('validationProperty', 2);
  options = { is: 'validationProperty' };
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['is the wrong length (should be 2 characters)']);
});

test('when passed an undefined model attribute as minimum value, value is 1', function() {
  model.set('attribute', 'a');
  options = {minimum: 'validationProperty'};
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), undefined);
});

test('when passed an undefined model attribute as maximum value, value is 1', function() {
  model.set('attribute', 'a');
  options = {maximum: 'validationProperty'};
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), undefined);
});

test('when passed an undefined model attribute as number value, value is 1', function() {
  model.set('attribute', 'a');
  options = {is: 'validationProperty'};
  Ember.Validations.validators.local.length(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), undefined);
});