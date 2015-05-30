import Ember from 'ember';
import { module, test } from 'qunit';
import Absence from 'ember-validations/validators/local/absence';

const {
  run
} = Ember;

const EmberObject = Ember.Object;
const set = Ember.set;

let model, Model, options, validator;

module('Absence Validator', {
  beforeEach() {
    Model = EmberObject.extend({
      dependentValidationKeys: {}
    });
    run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function(assert) {
  options = { message: 'failed validation' };
  run(function() {
    validator = Absence.create({ model, property: 'attribute', options });
  });
  assert.deepEqual(validator.errors, []);
  run(function() {
    set(model, 'attribute', 'not empty');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when value is made empty', function(assert) {
  set(model, 'attribute', 'not empty');
  options = { message: 'failed validation' };
  run(function() {
    validator = Absence.create({ model, property: 'attribute', options });
    set(model, 'attribute', undefined);
  });
  assert.deepEqual(validator.errors, []);
});

test('when options is true', function(assert) {
  options = true;
  run(function() {
    validator = Absence.create({ model, property: 'attribute', options });
    set(model, 'attribute', 'not empty');
  });
  assert.deepEqual(validator.errors, ['must be blank']);
});
