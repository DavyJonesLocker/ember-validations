import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Mixin from 'ember-validations/mixin';

var user, User;
var get = Ember.get;
var set = Ember.set;
var run = Ember.run;

moduleFor('object:user', 'Errors test', {
  integration: true,

  beforeEach: function() {
    User = Ember.Object.extend(Mixin, {
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

    this.registry.register('object:user', User);
  },

  afterEach: function() {
    delete Ember.I18n;
  }
});

test('validations are run on instantiation - invalid', function(assert) {
  run(() => user = this.subject());
  assert.equal(get(user, 'isValid'), false);
  assert.deepEqual(get(user, 'errors.name'), ["can't be blank"]);
  assert.deepEqual(get(user, 'errors.age'), ["can't be blank", 'is not a number']);
});

test('validations are run on instantiation - valid', function(assert) {
  run(() => user = this.subject({name: 'Brian', age: 33}));
  assert.ok(get(user, 'isValid'));
  assert.ok(Ember.isEmpty(get(user, 'errors.name')));
  assert.ok(Ember.isEmpty(get(user, 'errors.age')));
});

test('when errors are resolved', function(assert) {
  run(() => user = this.subject());
  assert.equal(get(user, 'isValid'), false);
  assert.deepEqual(get(user, 'errors.name'), ["can't be blank"]);
  assert.deepEqual(get(user, 'errors.age'), ["can't be blank", 'is not a number']);

  run(() => set(user, 'name', 'Brian'));
  assert.equal(get(user, 'isValid'), false);
  assert.ok(Ember.isEmpty(get(user, 'errors.name')));
  assert.deepEqual(get(user, 'errors.age'), ["can't be blank", 'is not a number']);

  run(() => set(user, 'age', 'thirty three'));
  assert.equal(get(user, 'isValid'), false);
  assert.ok(Ember.isEmpty(get(user, 'errors.name')));
  assert.deepEqual(get(user, 'errors.age'), ['is not a number']);

  run(() => set(user, 'age', 33));
  assert.ok(get(user, 'isValid'));
  assert.ok(Ember.isEmpty(get(user, 'errors.name')));
  assert.ok(Ember.isEmpty(get(user, 'errors.age')));
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
  // assert.deepEqual(get(user, 'errors.name'), ['muss ausgefüllt werden']);
  // assert.deepEqual(get(user, 'errors.age'), ['muss ausgefüllt werden', 'ist keine Zahl']);
  // run(function() {
    // set(user, 'age', 'thirty three');
  // });
  // equal(get(user, 'isValid'), false);
  // assert.deepEqual(get(user, 'errors.age'), ['ist keine Zahl']);
// });
