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
  assert.deepEqual(validator.validationErrors, []);
  run(function() {
    set(model, 'attributeConfirmation', 'newTest');
  });
  assert.deepEqual(validator.validationErrors, ['failed validation']);
  run(function() {
    set(model, 'attribute', 'newTest');
  });
  assert.deepEqual(validator.validationErrors, []);
});

test('when values do not match', function(assert) {
  options = { message: 'failed validation' };
  run(function() {
    validator = Confirmation.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'test');
  });
  assert.deepEqual(validator.validationErrors, ['failed validation']);
});

test('when original is null', function(assert) {
  run(function() {
    validator = Confirmation.create({model: model, property: 'attribute'});
    model.set('attribute', null);
  });
  assert.ok(Ember.isEmpty(validator.validationErrors));
});

test('when confirmation is null', function(assert) {
  run(function() {
    validator = Confirmation.create({model: model, property: 'attribute'});
    model.set('attributeConfirmation', null);
  });
  assert.ok(Ember.isEmpty(validator.validationErrors));
});

test('when options is true', function(assert) {
  options = true;
  run(function() {
    validator = Confirmation.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'test');
  });
  assert.deepEqual(validator.validationErrors, ["doesn't match attribute"]);
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

  assert.deepEqual(get(otherModel, 'validationErrors.attributeConfirmation'), ["doesn't match attribute"]);
  assert.deepEqual(get(otherModel, 'validationErrors.attribute'), []);
});
