import Ember from 'ember';
import { module, test } from 'qunit';
import EmberValidations, { validator } from 'ember-validations';
import buildContainer from '../helpers/build-container';
import Base from 'ember-validations/validators/base';

const {
  ArrayController,
  K,
  ObjectController,
  isEmpty,
  run
} = Ember;

const EmberObject = Ember.Object;
const get = Ember.get;
const set = Ember.set;

let user, User, promise;

module('Validate test', {
  beforeEach() {
    User = EmberObject.extend(EmberValidations, {
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
  run(function() {
    promise = user.validate().then(function() {
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
    user.setProperties({ firstName: 'Brian', lastName: 'Cardarella' });
  });
  assert.equal(get(user, 'isInvalid'), false);
});

test('runs all validations', function(assert) {
  run(function() {
    promise = user.validate().then(null, function(errors) {
      assert.deepEqual(get(errors, 'firstName'), ["can't be blank", 'is the wrong length (should be 5 characters)']);
      assert.deepEqual(get(errors, 'lastName'), ['is invalid']);
      assert.equal(get(user, 'isValid'), false);
      set(user, 'firstName', 'Bob');
      user.validate('firstName').then(null, function(errors) {
        assert.deepEqual(get(errors, 'firstName'), ['is the wrong length (should be 5 characters)']);
        assert.equal(get(user, 'isValid'), false);
        set(user, 'firstName', 'Brian');
        set(user, 'lastName', 'Cardarella');
        user.validate().then(function(errors) {
          assert.ok(isEmpty(get(errors, 'firstName')));
          assert.ok(isEmpty(get(errors, 'lastName')));
          assert.equal(get(user, 'isValid'), true);
        });
      });
    });
  });

  return promise;
});

test('can be mixed into an object controller', function(assert) {
  let Controller, controller, user;
  Controller = ObjectController.extend(EmberValidations, {
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

module('Array controller');

test('can be mixed into an array controller', function(assert) {
  let Controller, controller, user, UserController;
  const container = buildContainer();

  UserController = ObjectController.extend(EmberValidations, {
    container: buildContainer(),
    validations: {
      name: {
        presence: true
      }
    }
  });
  container.register('controller:User', UserController);
  Controller = ArrayController.extend(EmberValidations, {
    itemController: 'User',
    container,
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

let Profile, profile;

module('Relationship validators', {
  beforeEach() {
    Profile = EmberObject.extend(EmberValidations, {
      container: buildContainer(),
      validations: {
        title: {
          presence: true
        }
      }
    });

    run(function() {
      profile = Profile.create({ hey: 'yo' });
    });

    User = EmberObject.extend(EmberValidations, {
      container: buildContainer()
    });
  }
});

test('validates other validatable property', function(assert) {
  run(function() {
    user = User.create({
      validations: {
        profile: true
      }
    });
  });
  assert.equal(get(user, 'isValid'), true);
  run(function() {
    set(user, 'profile', profile);
  });
  assert.equal(get(user, 'isValid'), false);
  run(function() {
    set(profile, 'title', 'Developer');
  });
  assert.equal(get(user, 'isValid'), true);
});

/*
test('validates custom validator', function() {
  run(function() {
    user = User.create({
      profile: profile,
      validations: [AgeValidator]
    });
  });
  equal(get(user, 'isValid'), false);
  run(function() {
    set(user, 'age', 22);
  });
  equal(get(user, 'isValid'), true);
});
*/

test('validates array of validable objects', function(assert) {
  let friend1, friend2;

  run(function() {
    user = User.create({
      validations: {
        friends: true
      }
    });
  });

  assert.equal(get(user, 'isValid'), true);

  run(function() {
    set(user, 'friends', Ember.A());
  });

  assert.equal(get(user, 'isValid'), true);

  run(function() {
    friend1 = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  run(function() {
    user.friends.pushObject(friend1);
  });

  assert.equal(get(user, 'isValid'), false);

  run(function() {
    set(friend1, 'name', 'Stephanie');
  });

  assert.equal(get(user, 'isValid'), true);

  run(function() {
    friend2 = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });

    user.friends.pushObject(friend2);
  });

  assert.equal(get(user, 'isValid'), false);

  run(function() {
    user.friends.removeObject(friend2);
  });

  assert.equal(get(user, 'isValid'), true);
});

test('revalidates arrays when they are replaced', function(assert) {
  let friend1, friend2;

  run(function() {
    user = User.create({
      validations: {
        friends: true
      }
    });
  });

  assert.equal(get(user, 'isValid'), true);

  run(function() {
    set(user, 'friends', Ember.A());
  });

  assert.equal(get(user, 'isValid'), true);

  run(function() {
    friend1 = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  run(function() {
    set(user, 'friends', Ember.A([friend1]));
  });

  assert.equal(get(user, 'isValid'), false);

  run(function() {
    set(friend1, 'name', 'Stephanie');
  });

  assert.equal(get(user, 'isValid'), true);

  run(function() {
    friend2 = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });

    set(user, 'friends', Ember.A([friend1, friend2]));
  });

  assert.equal(get(user, 'isValid'), false);

  run(function() {
    user.friends.removeObject(friend2);
  });

  assert.equal(get(user, 'isValid'), true);
});

/*globals define, registry, requirejs*/

requirejs.rollback = function() {
  for (let entry in this.backupEntries) {
    this.entries[entry] = this.backupEntries[entry];
  }
};

requirejs.backup = function() {
  this.backupEntries = {};

  for (let entry in this.entries) {
    this.backupEntries[entry] = this.entries[entry];
  }
};

module('validator class lookup order', {
  beforeEach() {
    requirejs.backup();
    requirejs.clear();
    requirejs.rollback();

    User = Ember.Object.extend(EmberValidations, {
      container: buildContainer()
    });
  },
  afterEach() {
    requirejs.clear();
    requirejs.rollback();
  }
});

test('should lookup in project namespace first', function(assert) {
  let dummyValidatorCalled = false;
  let nativeValidatorCalled = false;

  define('ember-validations/validators/local/presence', [], function() {
    nativeValidatorCalled = true;

    return Base.extend({
      call: K
    });
  });

  define('dummy/validators/local/presence', [], function() {
    dummyValidatorCalled = true;

    return Base.extend({
      call: K
    });
  });

  run(function() {
    user = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  assert.ok(!nativeValidatorCalled, 'should not have preferred ember-validation\'s presence validator');
  assert.ok(dummyValidatorCalled, 'should have preferred my applications presence validator');
});

test('will lookup both local and remote validators of similar name', function(assert) {
  let localValidatorCalled = false;
  let remoteValidatorCalled = false;

  define('ember-validations/validators/local/uniqueness', [], function() {
    localValidatorCalled = true;

    return Base.extend({
      call: K
    });
  });

  define('ember-validations/validators/remote/uniqueness', [], function() {
    remoteValidatorCalled = true;

    return Base.extend({
      call: K
    });
  });

  run(function() {
    user = User.create({
      validations: {
        name: {
          uniqueness: true
        }
      }
    });
  });

  assert.ok(localValidatorCalled, 'should call local uniqueness validator');
  assert.ok(remoteValidatorCalled, 'should call remote uniqueness validator');
});

test('should prefer lookup in just "validators" before "native"', function(assert) {
  let dummyValidatorCalled = false;
  let nativeValidatorCalled = false;

  define('ember-validations/validators/local/presence', [], function() {
    nativeValidatorCalled = true;

    return Base.extend({
      call: K
    });
  });

  define('dummy/validators/presence', [], function() {
    dummyValidatorCalled = true;

    return Base.extend({
      call: K
    });
  });

  run(function() {
    user = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  assert.ok(!nativeValidatorCalled, 'should not have preferred ember-validation\'s presence validator');
  assert.ok(dummyValidatorCalled, 'should have preferred my applications presence validator');
});

test('should store validators in cache for faster lookup', function(assert) {
  let validatorResolvedCount = 0;

  const container = buildContainer();

  const oldLookupFactory = container.lookupFactory;

  container.lookupFactory = function(fullName) {
    validatorResolvedCount += 1;
    return oldLookupFactory.call(container, fullName);
  };

  let user2;

  run(function() {
    user = User.create({
      container,
      validations: {
        name: {
          presence: true
        }
      }
    });

    validatorResolvedCount = 0;

    user2 = User.create({
      container,
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  container.lookupFactory = oldLookupFactory;

  assert.ok(!get(user, 'isValid'));
  assert.ok(!get(user2, 'isValid'));
  assert.equal(0, validatorResolvedCount);
});

module('inline validations', {
  beforeEach() {
    User = Ember.Object.extend(EmberValidations, {
      container: buildContainer()
    });
  }
});

test('mixed validation syntax', function(assert) {
  run(function() {
    user = User.create({
      validations: {
        name: {
          inline: validator(function() {
            return 'it failed';
          })
        }
      }
    });
  });

  assert.deepEqual(['it failed'], get(user, 'errors.name'));
});

test('concise validation syntax', function(assert) {
  run(function() {
    user = User.create({
      validations: {
        name: validator(function() {
          return 'it failed';
        })
      }
    });
  });

  assert.deepEqual(['it failed'], get(user, 'errors.name'));
});
