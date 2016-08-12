import Ember from 'ember';
import { module, test } from 'qunit';
import Acceptance from 'ember-validations/validators/local/acceptance';

let model;
let Model;
let options;
let validator;

const {
  Object: EmberObject,
  run,
  set
} = Ember;

module('Acceptance Validator', {
  setup() {
    Model = EmberObject.extend({
      dependentValidationKeys: {}
    });
    run(() => model = Model.create());
  }
});

test('when attribute is true', function(assert) {
  options = { message: 'failed validation' };
  run(function() {
    validator = Acceptance.create({ model, property: 'attribute', options });
    set(model, 'attribute', true);
  });
  assert.deepEqual(validator.errors, []);
});

test('when attribute is not true', function(assert) {
  options = { message: 'failed validation' };
  run(function() {
    validator = Acceptance.create({ model, property: 'attribute', options });
    set(model, 'attribute', false);
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when attribute is value of 1', function(assert) {
  options = { message: 'failed validation' };
  run(function() {
    validator = Acceptance.create({ model, property: 'attribute', options });
    set(model, 'attribute', 1);
  });
  assert.deepEqual(validator.errors, []);
});

test('when attribute value is 2 and accept value is 2', function(assert) {
  options = { message: 'failed validation', accept: 2 };
  run(function() {
    validator = Acceptance.create({ model, property: 'attribute', options });
    set(model, 'attribute', 2);
  });
  assert.deepEqual(validator.errors, []);
});

test('when attribute value is 1 and accept value is 2', function(assert) {
  options = { message: 'failed validation', accept: 2 };
  run(function() {
    validator = Acceptance.create({ model, property: 'attribute', options });
    set(model, 'attribute', 1);
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when options is true', function(assert) {
  options = true;
  run(function() {
    validator = Acceptance.create({ model, property: 'attribute', options });
    set(model, 'attribute', false);
  });
  assert.deepEqual(validator.errors, ['must be accepted']);
});

test('when no message is passed', function(assert) {
  options = { accept: 2 };
  run(function() {
    validator = Acceptance.create({ model, property: 'attribute', options });
    set(model, 'attribute', false);
  });
  assert.deepEqual(validator.errors, ['must be accepted']);
});
