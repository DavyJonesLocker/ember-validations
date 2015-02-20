import Ember from 'ember';
import Inclusion from 'ember-validations/validators/local/inclusion';
import Mixin from 'ember-validations/mixin';
import { buildContainer } from '../../../helpers/container';

var model, Model, options, validator;
var set = Ember.set;

module('Inclusion Validator', {
  setup: function() {
    Model = Ember.Object.extend(Mixin, {
      container: buildContainer()
    });
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is in the list', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  Ember.run(function() {
    validator = Inclusion.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 1);
  });
  deepEqual(validator.errors, []);
});

test('when value is not in the list', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  Ember.run(function() {
    validator = Inclusion.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 4);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3], allowBlank: true };
  Ember.run(function() {
    validator = Inclusion.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  Ember.run(function() {
    validator = Inclusion.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when value is in the range', function() {
  options = { 'message': 'failed validation', 'range': [1, 3] };
  Ember.run(function() {
    validator = Inclusion.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 1);
  });
  deepEqual(validator.errors, []);
});

test('when value is not in the range', function() {
  options = { 'message': 'failed validation', 'range': [1, 3] };
  Ember.run(function() {
    validator = Inclusion.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 4);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is array', function() {
  options = [1, 2, 3];
  Ember.run(function() {
    validator = Inclusion.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  deepEqual(validator.errors, ['is not included in the list']);
});

test('when no message is passed', function() {
  options = { in: [1, 2, 3] };
  Ember.run(function() {
    validator = Inclusion.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  deepEqual(validator.errors, ['is not included in the list']);
});
