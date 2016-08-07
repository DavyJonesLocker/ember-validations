import Ember from 'ember';
import { module, test } from 'qunit';
import EmberValidations, { validator } from 'ember-validations';
import buildContainer from '../helpers/build-container';
import Base from 'ember-validations/validators/base';

var user, User, promise;
var get = Ember.get;
var set = Ember.set;
var run = Ember.run;

module('Validate test', {
  setup: function() {
    User = Ember.Object.extend(EmberValidations, {
      container: buildContainer(),
      validations: {
        firstName: {
          presence: true,
          length: 5
        },
        lastName: {
          format: { with: /\w+/ }
        }
      }
    });
    run(function() {
      user = User.create();
    });
  }
});

test('returns a promise', function(assert) {
  run(function(){
    promise = user.validate().then(function(){
      assert.ok(false, 'expected validation failed');
    }, function() {
      assert.equal(get(user, 'isValid'), false);
    });
  });

  return promise;
});

test('isInvalid tracks isValid', function(assert) {
  assert.equal(get(user, 'isInvalid'), true);
  run(function() {
    user.setProperties({firstName: 'Brian', lastName: 'Cardarella'});
  });
  assert.equal(get(user, 'isInvalid'), false);
});

test('runs all validations', function(assert) {
  run(function(){
    promise = user.validate().then(null, function(errors){
      assert.deepEqual(get(errors, 'firstName'), ["can't be blank", 'is the wrong length (should be 5 characters)']);
      assert.deepEqual(get(errors, 'lastName'), ["is invalid"]);
      assert.equal(get(user, 'isValid'), false);
      set(user, 'firstName', 'Bob');
      user.validate('firstName').then(null, function(errors){
        assert.deepEqual(get(errors, 'firstName'), ['is the wrong length (should be 5 characters)']);
        assert.equal(get(user, 'isValid'), false);
        set(user, 'firstName', 'Brian');
        set(user, 'lastName', 'Cardarella');
        user.validate().then(function(errors){
          assert.ok(Ember.isEmpty(get(errors, 'firstName')));
          assert.ok(Ember.isEmpty(get(errors, 'lastName')));
          assert.equal(get(user, 'isValid'), true);
        });
      });
    });
  });

  return promise;
});

test('can be mixed into an object controller', function(assert) {
  var Controller, controller, user;
  Controller = Ember.ObjectController.extend(EmberValidations, {
    container: buildContainer(),
    validations: {
      name: {
        presence: true
      }
    }
  });

  run(function() {
    controller = Controller.create();
  });
  assert.equal(get(controller, 'isValid'), false);
  user = Ember.Object.create();
  run(function() {
    set(controller, 'content', user);
  });
  assert.equal(get(controller, 'isValid'), false);
  run(function() {
    set(user, 'name', 'Brian');
  });
  assert.equal(get(controller, 'isValid'), true);
});




