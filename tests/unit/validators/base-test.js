import Ember from 'ember';
import { module, test } from 'qunit';
import Base from 'ember-validations/validators/base';

const {
  run
} = Ember;
const EmberObject = Ember.Object;
const get = Ember.get;
let model, Model, options, CustomValidator, validator;

module('Base Validator', {
  beforeEach() {
    Model = EmberObject.extend({
      dependentValidationKeys: {}
    });
    CustomValidator = Base.extend({
      init() {
        this._super();
        this.dependentValidationKeys.pushObject('otherAttribute');
      },

      call() {}
    });
    run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function(assert) {
  run(function() {
    validator = CustomValidator.create({ model, property: 'attribute' });
  });
  assert.equal(get(validator, 'isValid'), true);
});

test('validator has isInvalid flag', function(assert) {
  run(function() {
    validator = CustomValidator.create({ model, property: 'attribute' });
  });
  assert.equal(get(validator, 'isInvalid'), false);
});

test('generates dependentValidationKeys on the model', function(assert) {
  run(function() {
    validator = CustomValidator.create({ model, property: 'attribute' });
  });
  assert.deepEqual(get(model, 'dependentValidationKeys'), { attribute: ['otherAttribute'] });
});

test('inactive validators should be considered valid', function(assert) {
  let canValidate = true;
  run(function() {
    validator = CustomValidator.createWithMixins({
      model,
      property: 'attribute',
      canValidate() {
        return canValidate;
      },

      call() {
        this.errors.pushObject('nope');
      }
    });
  });
  assert.equal(get(validator, 'isValid'), false);
  canValidate = false;
  run(validator, 'validate');
  assert.equal(get(validator, 'isValid'), true);
});
