import Ember from 'ember';
import { module, test } from 'qunit';
import Length from 'ember-validations/validators/local/length';
import Mixin from 'ember-validations/mixin';

var model, Model, options, validator;
var set = Ember.set;
var run = Ember.run;

module('Length Validator', {
  setup: function() {
    Model = Ember.Object.extend(Mixin);
    run(function() {
      model = Model.create();
    });
  }
});

test('when allowed length is 3 and value length is 3', function(assert) {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '123');
  });
  assert.deepEqual(validator.errors, []);
});

test('when allowed length is 3 and value length is 4', function(assert) {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '1234');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when allowed length is 3 and value length is 2', function(assert) {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '12');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when allowing blank and allowed length is 3', function(assert) {
  options = { messages: { wrongLength: 'failed validation' }, is: 3, allowBlank: true };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, []);
});

test('when allowing blank and minimum length is 3 and maximum length is 100', function(assert) {
  options = { messages: { tooShort: 'failed minimum validation', tooLong: 'failed maximum validation' }, minimum: 3, maximum: 100, allowBlank: true };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, []);
});

test('when not allowing blank and allowed length is 3', function(assert) {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when allowed length is 3 and a different tokenizer', function(assert) {
  options = { messages: { wrongLength: 'failed validation' }, is: 3, tokenizer: function(value) { return value.split(' '); } };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'one two three');
  });
  assert.deepEqual(validator.errors, []);
});

test('when allowed length minimum is 3 and value length is 3', function(assert) {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '123');
  });
  assert.deepEqual(validator.errors, []);
});

test('when allowed length minimum is 3 and value length is 2', function(assert) {
  options = { messages: { tooShort: 'failed validation' }, minimum: 3 };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '12');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when allowed length maximum is 3 and value length is 3', function(assert) {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '123');
  });
  assert.deepEqual(validator.errors, []);
});

test('when allowed length maximum is 3 and value length is 4', function(assert) {
  options = { messages: { tooLong: 'failed validation' }, maximum: 3 };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '1234');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when allowed length maximum is 3 and value is blank', function(assert) {
  options = { maximum: 3 };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, []);
});

test('when options is a number', function(assert) {
  set(model, 'attribute', '1234');
  options = 3;
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, ['is the wrong length (should be 3 characters)']);
});

test('when options is a number and value is undefined', function(assert) {
  options = 3;
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, ['is the wrong length (should be 3 characters)']);
});

test('when allowed length is 3, value length is 4 and no message is set', function(assert) {
  options = { is: 3 };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '1234');
  });
  assert.deepEqual(validator.errors, ['is the wrong length (should be 3 characters)']);
});

test('when allowed length minimum is 3, value length is 2 and no message is set', function(assert) {
  options = { minimum: 3 };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '12');
  });
  assert.deepEqual(validator.errors, ['is too short (minimum is 3 characters)']);
});

test('when allowed length maximum is 3, value length is 4 and no message is set', function(assert) {
  options = { maximum: 3 };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '1234');
  });
  assert.deepEqual(validator.errors, ['is too long (maximum is 3 characters)']);
});

test('when value is non-string, then the value is still checked', function(assert) {
  options = { maximum: 3 };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 1234);
  });
  assert.deepEqual(validator.errors, ['is too long (maximum is 3 characters)']);
});

test('when using a property instead of a number', function(assert) {
  options = { is: 'countProperty' };
  run(function() {
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '123');
  });
  assert.deepEqual(validator.errors, ['is the wrong length (should be 0 characters)']);
  run(function() {
    set(model, 'countProperty', 3);
  });
  assert.deepEqual(validator.errors, []);
  run(function() {
    set(model, 'countProperty', 5);
  });
  assert.deepEqual(validator.errors, ['is the wrong length (should be 5 characters)']);
});

test('when using a property for "minimum" and model property is 0 allow blank', function(assert) {
  options = { minimum: 'minLength' };
  run(function() {
    set(model, 'minLength', 0);
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, []);
});

test('when using property for "is" and model property is 0 allow blank', function(assert) {
  options = { is: 'isLength' };
  run(function() {
    set(model, 'isLength', 0);
    validator = Length.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, []);
});