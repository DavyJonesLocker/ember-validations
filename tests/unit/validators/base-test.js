import Ember from 'ember';
import { module, test } from 'qunit';
import Base from 'ember-validations/validators/base';

var model, Model, options, CustomValidator, validator;
var get = Ember.get;
var run = Ember.run;

module('Base Validator', {
  setup: function() {
    Model = Ember.Object.extend({
      dependentValidationKeys: {}
    });
    CustomValidator = Base.extend({
      init: function() {
        this._super();
        this.dependentValidationKeys.pushObject('otherAttribute');
      },
      call: function() {}
    });
    run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function(assert) {
  run(function() {
    validator = CustomValidator.create({model: model, property: 'attribute'});
  });
  assert.equal(get(validator, 'isValid'), true);
});

test('validator has isInvalid flag', function(assert) {
  run(function() {
    validator = CustomValidator.create({model: model, property: 'attribute'});
  });
  assert.equal(get(validator, 'isInvalid'), false);
});

test('generates dependentValidationKeys on the model', function(assert) {
  run(function() {
    validator = CustomValidator.create({model: model, property: 'attribute'});
  });
  assert.deepEqual(get(model, 'dependentValidationKeys'), {attribute: ['otherAttribute']});
});

test('inactive validators should be considered valid', function(assert) {
  var canValidate = true;
  run(function() {
    validator = CustomValidator.createWithMixins({
      model: model,
      property: 'attribute',
      canValidate: function() {
        return canValidate;
      },
      call: function() {
        this.errors.pushObject("nope");
      }
    });
  });
  assert.equal(get(validator, 'isValid'), false);
  canValidate = false;
  run(validator, 'validate');
  assert.equal(get(validator, 'isValid'), true);
});
