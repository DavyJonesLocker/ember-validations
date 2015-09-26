import Ember from 'ember';
import { module, test } from 'qunit';
import Presence from 'ember-validations/validators/local/presence';
import Mixin from 'ember-validations/mixin';

var model, Model, options, validator;
var set = Ember.set;
var run = Ember.run;

module('Presence Validator', {
  setup: function() {
    Model = Ember.Object.extend(Mixin);
    run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function(assert) {
  options = { message: 'failed validation' };
  run(function() {
    validator = Presence.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'not empty');
  });
  assert.deepEqual(validator.validationErrors, []);
});

test('when value is empty', function(assert) {
  options = { message: 'failed validation' };
  run(function() {
    validator = Presence.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.validationErrors, ['failed validation']);
});

test('when options is true', function(assert) {
  options = true;
  run(function() {
    validator = Presence.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.validationErrors, ["can't be blank"]);
});

test('when value is blank', function(assert) {
  options = { message: 'failed validation' };
  run(function() {
    validator = Presence.create({model: model, property: 'attribute', options: options});
    model.set('attribute', ' ');
  });
  assert.deepEqual(validator.validationErrors, ['failed validation']);
});
