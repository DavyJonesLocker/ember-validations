import Ember from 'ember';
import { module, test } from 'qunit';
import Absence from 'ember-validations/validators/local/absence';

let model;
let Model;
let options;
let validator;

const {
  Object: EmberObject,
  run,
  set
} = Ember;

module('Absence Validator', {
  setup() {
    Model = EmberObject.extend({
      dependentValidationKeys: {}
    });
    run(() => model = Model.create());
  }
});

test('when value is not empty', function(assert) {
  options = { message: 'failed validation' };
  run(() => validator = Absence.create({ model, property: 'attribute', options }));
  assert.deepEqual(validator.errors, []);
  run(() => set(model, 'attribute', 'not empty'));
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when value is made empty', function(assert) {
  set(model, 'attribute', 'not empty');
  options = { message: 'failed validation' };
  run(() => validator = Absence.create({ model, property: 'attribute', options }));
  run(() => set(model, 'attribute', undefined));
  assert.deepEqual(validator.errors, []);
});

test('when options is true', function(assert) {
  options = true;
  run(() => validator = Absence.create({ model, property: 'attribute', options }));
  run(() => set(model, 'attribute', 'not empty'));
  assert.deepEqual(validator.errors, ['must be blank']);
});
