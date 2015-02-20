import Ember from 'ember';
import Absence from 'ember-validations/validators/local/absence';
import Mixin from 'ember-validations/mixin';
import { buildContainer } from '../../../helpers/container';

var model, Model, options, validator;
var set = Ember.set;

module('Absence Validator', {
  setup: function() {
    Model = Ember.Object.extend(Mixin, {
      container: buildContainer()
    });
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function() {
  options = { message: 'failed validation' };
  Ember.run(function(){
    validator = Absence.create({model: model, property: 'attribute', options: options});
  });
  deepEqual(validator.errors, []);
  Ember.run(function() {
    set(model, 'attribute', 'not empty');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when value is made empty', function() {
  set(model, 'attribute', 'not empty');
  options = { message: 'failed validation' };
  Ember.run(function(){
    validator = Absence.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', undefined);
  });
  deepEqual(validator.errors, []);
});

test('when options is true', function() {
  options = true;
  Ember.run(function(){
    validator = Absence.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'not empty');
  });
  deepEqual(validator.errors, ["must be blank"]);
});
