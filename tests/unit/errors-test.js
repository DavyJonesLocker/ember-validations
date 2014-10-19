import Ember from 'ember';
import Mixin from 'ember-validations/mixin';
import { buildContainer } from '../helpers/container';

var user, User;
var get = Ember.get;
var set = Ember.set;

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

test('validations are run on instantiation', function() {
  Ember.run(function() {
    user = User.create();
  });
  equal(get(user, 'isValid'), false);
  deepEqual(get(user, 'errors.name'), ["can't be blank"]);
  deepEqual(get(user, 'errors.age'), ["can't be blank", 'is not a number']);
  Ember.run(function() {
    user = User.create({name: 'Brian', age: 33});
  });
  ok(get(user, 'isValid'));
  ok(Ember.isEmpty(get(user, 'errors.name')));
  ok(Ember.isEmpty(get(user, 'errors.age')));
});

test('when errors are resolved', function() {
  Ember.run(function() {
    user = User.create();
  });
  equal(get(user, 'isValid'), false);
  deepEqual(get(user, 'errors.name'), ["can't be blank"]);
  deepEqual(get(user, 'errors.age'), ["can't be blank", 'is not a number']);
  Ember.run(function() {
    set(user, 'name', 'Brian');
  });
  equal(get(user, 'isValid'), false);
  ok(Ember.isEmpty(get(user, 'errors.name')));
  deepEqual(get(user, 'errors.age'), ["can't be blank", 'is not a number']);
  Ember.run(function() {
    set(user, 'age', 'thirty three');
  });
  equal(get(user, 'isValid'), false);
  ok(Ember.isEmpty(get(user, 'errors.name')));
  deepEqual(get(user, 'errors.age'), ['is not a number']);
  Ember.run(function() {
    set(user, 'age', 33);
  });
  ok(get(user, 'isValid'));
  ok(Ember.isEmpty(get(user, 'errors.name')));
  ok(Ember.isEmpty(get(user, 'errors.age')));
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
  
  // Ember.run(function() {
    // user = User.create();
  // });
  // equal(get(user, 'isValid'), false);
  // deepEqual(get(user, 'errors.name'), ['muss ausgefüllt werden']);
  // deepEqual(get(user, 'errors.age'), ['muss ausgefüllt werden', 'ist keine Zahl']);
  // Ember.run(function() {
    // set(user, 'age', 'thirty three');
  // });
  // equal(get(user, 'isValid'), false);
  // deepEqual(get(user, 'errors.age'), ['ist keine Zahl']);
// });
