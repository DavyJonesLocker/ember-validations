import Ember from 'ember';
import { module, test } from 'qunit';
import Format from 'ember-validations/validators/local/format';
import Mixin from 'ember-validations/mixin';
import { buildContainer } from '../../../helpers/container';

var model, Model, options, validator;
var set = Ember.set;
var run = Ember.run;

module('Format Validator', {
  setup: function() {
    Model = Ember.Object.extend(Mixin);
    run(function() {
      model = Model.create();
    });
  }
});

test('when matching format', function(assert) {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  run(function() {
    validator = Format.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute',  '123');
  });
  assert.deepEqual(validator.validationErrors, []);
});

test('when not matching format', function(assert) {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  run(function() {
    validator = Format.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'abc');
  });
  assert.deepEqual(validator.validationErrors, ['failed validation']);
});

test('when allowing blank', function(assert) {
  options = { 'message': 'failed validation', 'with': /\d+/, 'allowBlank': true };
  run(function() {
    validator = Format.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.validationErrors, []);
});

test('when not allowing blank', function(assert) {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  run(function() {
    validator = Format.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.validationErrors, ['failed validation']);
});

test('when options is regexp', function(assert) {
  options = /\d+/;
  run(function() {
    validator = Format.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.validationErrors, ['is invalid']);
});

test('when no message is passed', function(assert) {
  options = { 'with': /\d+/ };
  run(function() {
    validator = Format.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.validationErrors, ['is invalid']);
});
