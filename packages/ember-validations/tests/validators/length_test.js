var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Length Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    model = Model.create();
  }
});

test('when allowed length is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowed length is 3 and value length is 4', function() {
  model.set('attribute', '1234');
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowed length is 3 and value length is 2', function() {
  model.set('attribute', '12');
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowing blank and allowed length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3, allowBlank: true };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowing blank and minimum length is 3 and maximum length is 100', function() {
  options = { messages: { tooShort: 'failed minimum validation', tooLong: 'failed maximum validation' }, minimum: 3, maximum: 100, allowBlank: true };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when not allowing blank and allowed length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowed length is 3 and a differnet tokenizer', function() {
  model.set('attribute', 'one two three');
  options = { messages: { wrongLength: 'failed validation' }, is: 3, tokenizer: 'match(/\\w+/g)' };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowed length minimum is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowed length minimum is 3 and value length is 2', function() {
  model.set('attribute', '12');
  options = { messages: { tooShort: 'failed validation' }, minimum: 3 };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowed length maximum is 3 and value length is 3', function() {
  model.set('attribute', '123');
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when allowed length maximum is 3 and value length is 4', function() {
  model.set('attribute', '1234');
  options = { messages: { tooLong: 'failed validation' }, maximum: 3 };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowed length maximum is 3 and value is blank', function() {
  model.set('attribute', '');
  options = { maximum: 3 };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, pass, fail);
  deepEqual(model.errors.get('attribute'), undefined);
});

test('when options is a number', function() {
  model.set('attribute', '1234');
  options = 3;
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['is the wrong length (should be 3 characters)']);
});

test('when options is a number and value is undefined', function() {
  options = 3;
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['is the wrong length (should be 3 characters)']);
});

test('when allowed length is 3, value length is 4 and no message is set', function() {
  model.set('attribute', '1234');
  options = { is: 3 };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['is the wrong length (should be 3 characters)']);
});

test('when allowed length minimum is 3, value length is 2 and no message is set', function() {
  model.set('attribute', '12');
  options = { minimum: 3 };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['is too short (minimum is 3 characters)']);
});

test('when allowed length maximum is 3, value length is 4 and no message is set', function() {
  model.set('attribute', '1234');
  options = { maximum: 3 };
  validator = Ember.Validations.validators.local.Length.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['is too long (maximum is 3 characters)']);
});
