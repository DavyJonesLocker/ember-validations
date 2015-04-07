import Ember from 'ember';
import { module, test } from 'qunit';
import Mixin from 'ember-validations/mixin';
import { buildContainer } from '../helpers/container';

var user, User;
var get = Ember.get;
var set = Ember.set;
var run = Ember.run;

module('Errors test', {
  setup: function() {
    User = Ember.Object.extend(Mixin, {
      container: buildContainer(),
      validations: {
        name: {
          presence: true
        },
        age: {
          presence: true,
          numericality: true
        }
      }
    });
  },
  teardown: function() {
    delete Ember.I18n;
  }
});

test('validations are run on instantiation', function(assert) {
  run(function() {
    user = User.create();
  });
  assert.equal(get(user, 'isValid'), false);
  assert.deepEqual(get(user, 'validationErrors.name'), ["can't be blank"]);
  assert.deepEqual(get(user, 'validationErrors.age'), ["can't be blank", 'is not a number']);
  run(function() {
    user = User.create({name: 'Brian', age: 33});
  });
  assert.ok(get(user, 'isValid'));
  assert.ok(Ember.isEmpty(get(user, 'validationErrors.name')));
  assert.ok(Ember.isEmpty(get(user, 'validationErrors.age')));
});

test('when errors are resolved', function(assert) {
  run(function() {
    user = User.create();
  });
  assert.equal(get(user, 'isValid'), false);
  assert.deepEqual(get(user, 'validationErrors.name'), ["can't be blank"]);
  assert.deepEqual(get(user, 'validationErrors.age'), ["can't be blank", 'is not a number']);
  run(function() {
    set(user, 'name', 'Brian');
  });
  assert.equal(get(user, 'isValid'), false);
  assert.ok(Ember.isEmpty(get(user, 'validationErrors.name')));
  assert.deepEqual(get(user, 'validationErrors.age'), ["can't be blank", 'is not a number']);
  run(function() {
    set(user, 'age', 'thirty three');
  });
  assert.equal(get(user, 'isValid'), false);
  assert.ok(Ember.isEmpty(get(user, 'validationErrors.name')));
  assert.deepEqual(get(user, 'validationErrors.age'), ['is not a number']);
  run(function() {
    set(user, 'age', 33);
  });
  assert.ok(get(user, 'isValid'));
  assert.ok(Ember.isEmpty(get(user, 'validationErrors.name')));
  assert.ok(Ember.isEmpty(get(user, 'validationErrors.age')));
});

// test('validations use Ember.I18n.t to render the message if Ember.I18n is present', function() {
  // Ember.I18n = {
    // translations: {
      // errors: {
        // blank: 'muss ausgefüllt werden',
        // notANumber: 'ist keine Zahl'
      // }
    // },
    // lookupKey: function(key, hash) {
      // var firstKey, idx, remainingKeys;

      // if (hash[key] !== null && hash[key] !== undefined) { return hash[key]; }

      // if ((idx = key.indexOf('.')) !== -1) {
        // firstKey = key.substr(0, idx);
        // remainingKeys = key.substr(idx + 1);
        // hash = hash[firstKey];
        // if (hash) { return Ember.I18n.lookupKey(remainingKeys, hash); }
      // }
    // },
    // t: function(key, context) {
      // return Ember.I18n.lookupKey(key, Ember.I18n.translations);
    // }
  // };

  // run(function() {
    // user = User.create();
  // });
  // equal(get(user, 'isValid'), false);
  // assert.deepEqual(get(user, 'validationErrors.name'), ['muss ausgefüllt werden']);
  // assert.deepEqual(get(user, 'validationErrors.age'), ['muss ausgefüllt werden', 'ist keine Zahl']);
  // run(function() {
    // set(user, 'age', 'thirty three');
  // });
  // equal(get(user, 'isValid'), false);
  // assert.deepEqual(get(user, 'validationErrors.age'), ['ist keine Zahl']);
// });
