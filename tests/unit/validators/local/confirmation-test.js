import Ember from 'ember';
import Confirmation from 'ember-validations/validators/local/confirmation';
import Mixin from 'ember-validations/mixin';
import { buildContainer } from '../../../helpers/container';

var model, Model, options, validator;
var get = Ember.get;
var set = Ember.set;

module('Confirmation Validator', {
  setup: function() {
    Model = Ember.Object.extend(Mixin, {
      container: buildContainer()
    });
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when values match', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Confirmation.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'test');
    set(model, 'attributeConfirmation', 'test');
  });
  deepEqual(validator.errors, []);
  Ember.run(function() {
    set(model, 'attributeConfirmation', 'newTest');
  });
  deepEqual(validator.errors, ['failed validation']);
  Ember.run(function() {
    set(model, 'attribute', 'newTest');
  });
  deepEqual(validator.errors, []);
});

test('when values do not match', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Confirmation.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'test');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is true', function() {
  options = true;
  Ember.run(function() {
    validator = Confirmation.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'test');
  });
  deepEqual(validator.errors, ["doesn't match attribute"]);
});

test('message integration on model, prints message on Confirmation property', function() {
  var otherModel, OtherModel = Model.extend({
    validations: {
      attribute: {
        confirmation: true
      }
    }
  });

  Ember.run(function() {
    otherModel = OtherModel.create();
    set(otherModel, 'attribute', 'test');
  });

  deepEqual(get(otherModel, 'errors.attributeConfirmation'), ["doesn't match attribute"]);
  deepEqual(get(otherModel, 'errors.attribute'), []);
});
