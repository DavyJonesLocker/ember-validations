import Ember from 'ember';
import { module, test } from 'qunit';
import EmberValidations, { validator } from 'ember-validations';
import buildContainer from '../helpers/build-container';
import Base from 'ember-validations/validators/base';

var user, User, promise;
var get = Ember.get;
var set = Ember.set;
var run = Ember.run;

module('Array controller');

test('can be mixed into an array controller', function(assert) {
  var Controller, controller, user, UserController;
  var container = buildContainer();

  UserController = Ember.ObjectController.extend(EmberValidations, {
    container: buildContainer(),
    validations: {
      name: {
        presence: true
      }
    }
  });
  container.register('controller:User', UserController);
  Controller = Ember.ArrayController.extend(EmberValidations, {
    itemController: 'User',
    container: container,
    validations: {
      '[]': true
    }
  });

  run(function() {
    controller = Controller.create();
  });
  assert.equal(get(controller, 'isValid'), true);
  user = Ember.Object.create();
  run(function() {
    controller.pushObject(user);
  });
  assert.equal(get(controller, 'isValid'), false);
  run(function() {
    set(user, 'name', 'Brian');
  });
  assert.equal(get(controller, 'isValid'), true);
  run(function() {
    set(user, 'name', undefined);
  });
  assert.equal(get(controller, 'isValid'), false);
  run(function() {
    get(controller, 'content').removeObject(user);
  });
  assert.equal(get(controller, 'isValid'), true);
});
