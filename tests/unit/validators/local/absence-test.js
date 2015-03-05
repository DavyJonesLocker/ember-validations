import Ember from 'ember';
import { module, test } from 'qunit';
import Absence from 'ember-validations/validators/local/absence';

var model, Model, options, validator;
var set = Ember.set;
var run = Ember.run;

module('Absence Validator', {
  setup: function() {
    Model = Ember.Object.extend({
      dependentValidationKeys: {}
    });
    run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function(assert) {
  options = { message: 'failed validation' };
  run(function(){
    validator = Absence.create({model: model, property: 'attribute', options: options});
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
  run(function(){
    validator = Absence.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', undefined);
  });
  assert.deepEqual(validator.errors, []);
});

test('when options is true', function(assert) {
  options = true;
  run(function(){
    validator = Absence.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'not empty');
  });
  assert.deepEqual(validator.errors, ["must be blank"]);
});
