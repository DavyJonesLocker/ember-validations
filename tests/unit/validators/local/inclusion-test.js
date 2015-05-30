import Ember from 'ember';
import { module, test } from 'qunit';
import Inclusion from 'ember-validations/validators/local/inclusion';
import Mixin from 'ember-validations/mixin';

const {
  run
} = Ember;

const EmberObject = Ember.Object;
const set = Ember.set;

let model, Model, options, validator;

module('Inclusion Validator', {
  beforeEach() {
    Model = EmberObject.extend(Mixin);
    run(function() {
      model = Model.create();
    });
  }
});

test('when value is in the list', function(assert) {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  run(function() {
    validator = Inclusion.create({ model, property: 'attribute', options });
    set(model, 'attribute', 1);
  });
  assert.deepEqual(validator.errors, []);
});

test('when value is not in the list', function(assert) {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  run(function() {
    validator = Inclusion.create({ model, property: 'attribute', options });
    set(model, 'attribute', 4);
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when allowing blank', function(assert) {
  options = { 'message': 'failed validation', 'in': [1, 2, 3], allowBlank: true };
  run(function() {
    validator = Inclusion.create({ model, property: 'attribute', options });
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, []);
});

test('when not allowing blank', function(assert) {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  run(function() {
    validator = Inclusion.create({ model, property: 'attribute', options });
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when value is in the range', function(assert) {
  options = { 'message': 'failed validation', 'range': [1, 3] };
  run(function() {
    validator = Inclusion.create({ model, property: 'attribute', options });
    set(model, 'attribute', 1);
  });
  assert.deepEqual(validator.errors, []);
});

test('when value is not in the range', function(assert) {
  options = { 'message': 'failed validation', 'range': [1, 3] };
  run(function() {
    validator = Inclusion.create({ model, property: 'attribute', options });
    set(model, 'attribute', 4);
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when options is array', function(assert) {
  options = [1, 2, 3];
  run(function() {
    validator = Inclusion.create({ model, property: 'attribute', options });
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, ['is not included in the list']);
});

test('when no message is passed', function(assert) {
  options = { in: [1, 2, 3] };
  run(function() {
    validator = Inclusion.create({ model, property: 'attribute', options });
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, ['is not included in the list']);
});
