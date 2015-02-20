import Ember from 'ember';
import Format from 'ember-validations/validators/local/format';
import Mixin from 'ember-validations/mixin';
import { buildContainer } from '../../../helpers/container';

var model, Model, options, validator;
var set = Ember.set;

module('Format Validator', {
  setup: function() {
    Model = Ember.Object.extend(Mixin, {
      container: buildContainer()
    });
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when matching format', function() {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  Ember.run(function() {
    validator = Format.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute',  '123');
  });
  deepEqual(validator.errors, []);
});

test('when not matching format', function() {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  Ember.run(function() {
    validator = Format.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'abc');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowing blank', function() {
  options = { 'message': 'failed validation', 'with': /\d+/, 'allowBlank': true };
  Ember.run(function() {
    validator = Format.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  Ember.run(function() {
    validator = Format.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is regexp', function() {
  options = /\d+/;
  Ember.run(function() {
    validator = Format.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  deepEqual(validator.errors, ['is invalid']);
});

test('when no message is passed', function() {
  options = { 'with': /\d+/ };
  Ember.run(function() {
    validator = Format.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  deepEqual(validator.errors, ['is invalid']);
});
