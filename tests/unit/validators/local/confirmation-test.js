import Ember from 'ember';
import { module, test } from 'qunit';
import Confirmation from 'ember-validations/validators/local/confirmation';
import Mixin from 'ember-validations/mixin';
import { buildContainer } from '../../../helpers/container';

var model, Model, options, validator;
var get = Ember.get;
var set = Ember.set;
var run = Ember.run;

module('Confirmation Validator', {
  setup: function() {
    Model = Ember.Object.extend(Mixin, {
      container: buildContainer()
    });
    run(function() {
      model = Model.create();
    });
  }
});

test('when values match', function(assert) {
  options = { message: 'failed validation' };
  run(function() {
    validator = Confirmation.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'test');
    set(model, 'attributeConfirmation', 'test');
  });
  assert.deepEqual(validator.errors, []);
  run(function() {
    set(model, 'attributeConfirmation', 'newTest');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
  run(function() {
    set(model, 'attribute', 'newTest');
  });
  assert.deepEqual(validator.errors, []);
});

test('when values do not match', function(assert) {
  options = { message: 'failed validation' };
  run(function() {
    validator = Confirmation.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'test');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when original is null', function(assert) {
  run(function() {
    validator = Confirmation.create({model: model, property: 'attribute'});
    model.set('attribute', null);
  });
  assert.ok(Ember.isEmpty(validator.errors));
});

test('when confirmation is null', function(assert) {
  run(function() {
    validator = Confirmation.create({model: model, property: 'attribute'});
    model.set('attributeConfirmation', null);
  });
  assert.ok(Ember.isEmpty(validator.errors));
});

test('when options is true', function(assert) {
  options = true;
  run(function() {
    validator = Confirmation.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'test');
  });
  assert.deepEqual(validator.errors, ["doesn't match attribute"]);
});

test('message integration on model, prints message on Confirmation property', function(assert) {
  var otherModel, OtherModel = Model.extend({
    validations: {
      attribute: {
        confirmation: true
      }
    }
  });

  run(function() {
    otherModel = OtherModel.create();
    set(otherModel, 'attribute', 'test');
  });

  assert.deepEqual(get(otherModel, 'errors.attributeConfirmation'), ["doesn't match attribute"]);
  assert.deepEqual(get(otherModel, 'errors.attribute'), []);
});
