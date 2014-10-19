import Ember from 'ember';
import Presence from 'ember-validations/validators/local/presence';
import Mixin from 'ember-validations/mixin';
import { buildContainer } from '../../../helpers/container';

var model, Model, options, validator;
var set = Ember.set;

module('Presence Validator', {
  setup: function() {
    Model = Ember.Object.extend(Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Presence.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'not empty');
  });
  deepEqual(validator.errors, []);
});

test('when value is empty', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Presence.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is true', function() {
  options = true;
  Ember.run(function() {
    validator = Presence.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  deepEqual(validator.errors, ["can't be blank"]);
});
