import Ember from 'ember';
import { module, test } from 'qunit';
import Format from 'ember-validations/validators/local/format';
import Mixin from 'ember-validations/mixin';

let model;
let Model;
let options;
let validator;

const {
  Object: EmberObject,
  run,
  set
} = Ember;

module('Format Validator', {
  setup() {
    Model = EmberObject.extend(Mixin);
    run(function() {
      model = Model.create();
    });
  }
});

test('when matching format', function(assert) {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  run(function() {
    validator = Format.create({ model, property: 'attribute', options });
    set(model, 'attribute',  '123');
  });
  assert.deepEqual(validator.errors, []);
});

test('when not matching format', function(assert) {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  run(function() {
    validator = Format.create({ model, property: 'attribute', options });
    set(model, 'attribute', 'abc');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when allowing blank', function(assert) {
  options = { 'message': 'failed validation', 'with': /\d+/, 'allowBlank': true };
  run(function() {
    validator = Format.create({ model, property: 'attribute', options });
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, []);
});

test('when not allowing blank', function(assert) {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  run(function() {
    validator = Format.create({ model, property: 'attribute', options });
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when options is regexp', function(assert) {
  options = /\d+/;
  run(function() {
    validator = Format.create({ model, property: 'attribute', options });
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, ['is invalid']);
});

test('when no message is passed', function(assert) {
  options = { 'with': /\d+/ };
  run(function() {
    validator = Format.create({ model, property: 'attribute', options });
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, ['is invalid']);
});
