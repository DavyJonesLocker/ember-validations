import Ember from 'ember';
import Acceptance from 'ember-validations/validators/local/acceptance';
import Mixin from 'ember-validations/mixin';
import { buildContainer } from '../../../helpers/container';

var model, Model, options, validator;
var set = Ember.set;

module('Acceptance Validator', {
  setup: function() {
    Model = Ember.Object.extend(Mixin, {
      container: buildContainer()
    });
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when attribute is true', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Acceptance.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', true);
  });
  deepEqual(validator.errors, []);
});

test('when attribute is not true', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Acceptance.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', false);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when attribute is value of 1', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Acceptance.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 1);
  });
  deepEqual(validator.errors, []);
});

test('when attribute value is 2 and accept value is 2', function() {
  options = { message: 'failed validation', accept: 2 };
  Ember.run(function() {
    validator = Acceptance.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 2);
  });
  deepEqual(validator.errors, []);
});

test('when attribute value is 1 and accept value is 2', function() {
  options = { message: 'failed validation', accept: 2 };
  Ember.run(function() {
    validator = Acceptance.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 1);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is true', function() {
  options = true;
  Ember.run(function() {
    validator = Acceptance.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', false);
  });
  deepEqual(validator.errors, ['must be accepted']);
});

test('when no message is passed', function() {
  options = { accept: 2 };
  Ember.run(function() {
    validator = Acceptance.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', false);
  });
  deepEqual(validator.errors, ['must be accepted']);
});
