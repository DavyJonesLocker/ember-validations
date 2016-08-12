import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Mixin from 'ember-validations/mixin';

let user;
let User;

const {
  Object: EmberObject,
  get,
  run,
  set
} = Ember;

moduleFor('object:user', 'Errors test', {
  integration: true,

  beforeEach() {
    User = EmberObject.extend(Mixin, {
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

  afterEach() {
    // jscs:disable disallowDirectPropertyAccess
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
  run(() => user = this.subject({ name: 'Brian', age: 33 }));
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
