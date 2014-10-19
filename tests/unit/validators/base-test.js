import Ember from 'ember';
import Base from 'ember-validations/validators/base';

var model, Model, options, CustomValidator, validator;
var get = Ember.get;

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
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function() {
  Ember.run(function() {
    validator = CustomValidator.create({model: model, property: 'attribute'});
  });
  equal(get(validator, 'isValid'), true);
});

test('generates dependentValidationKeys on the model', function() {
  Ember.run(function() {
    validator = CustomValidator.create({model: model, property: 'attribute'});
  });
  deepEqual(get(model, 'dependentValidationKeys'), {attribute: ['otherAttribute']});
});

test('inactive validators should be considered valid', function() {
  var canValidate = true;
  Ember.run(function() {
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
  equal(get(validator, 'isValid'), false);
  canValidate = false;
  Ember.run(validator, 'validate');
  equal(get(validator, 'isValid'), true);
});
