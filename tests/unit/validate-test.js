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

var Profile, profile;

module('Relationship validators', {
  setup: function() {
    Profile = Ember.Object.extend(EmberValidations, {
      container: buildContainer(),
      validations: {
        title: {
          presence: true
        }
      }
    });

    run(function() {
      profile = Profile.create({hey: 'yo'});
    });

    User = Ember.Object.extend(EmberValidations, {
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

// test('validates custom validator', function() {
  // run(function() {
    // user = User.create({
      // profile: profile,
      // validations: [AgeValidator]
    // });
  // });
  // equal(get(user, 'isValid'), false);
  // run(function() {
    // set(user, 'age', 22);
  // });
  // equal(get(user, 'isValid'), true);
// });

test('validates array of validable objects', function(assert) {
  var friend1, friend2;

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
  var friend1, friend2;

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
  for(var entry in this.backupEntries) {
    this.entries[entry] = this.backupEntries[entry];
  }
};

requirejs.backup = function() {
  this.backupEntries = {};

  for(var entry in this.entries) {
    this.backupEntries[entry] = this.entries[entry];
  }
};

module('validator class lookup order', {
  setup: function() {
    requirejs.backup();
    requirejs.clear();
    requirejs.rollback();

    User = Ember.Object.extend(EmberValidations, {
      container: buildContainer()
    });
  },
  teardown: function() {
    requirejs.clear();
    requirejs.rollback();
  }
});

test('should lookup in project namespace first', function(assert) {
  var dummyValidatorCalled = false;
  var nativeValidatorCalled = false;

  define('ember-validations/validators/local/presence', [], function() {
    nativeValidatorCalled = true;

    return Base.extend({
      call: Ember.K
    });
  });

  define('dummy/validators/local/presence', [], function() {
    dummyValidatorCalled = true;

    return Base.extend({
      call: Ember.K
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
  var localValidatorCalled = false;
  var remoteValidatorCalled = false;

  define('ember-validations/validators/local/uniqueness', [], function() {
    localValidatorCalled = true;

    return Base.extend({
      call: Ember.K
    });
  });

  define('ember-validations/validators/remote/uniqueness', [], function() {
    remoteValidatorCalled = true;

    return Base.extend({
      call: Ember.K
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
  var dummyValidatorCalled = false;
  var nativeValidatorCalled = false;

  define('ember-validations/validators/local/presence', [], function() {
    nativeValidatorCalled = true;

    return Base.extend({
      call: Ember.K
    });
  });

  define('dummy/validators/presence', [], function() {
    dummyValidatorCalled = true;

    return Base.extend({
      call: Ember.K
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
  var validatorResolvedCount = 0;

  var container = buildContainer();

  var oldLookupFactory = container.lookupFactory;

  container.lookupFactory = function(fullName) {
    validatorResolvedCount += 1;
    return oldLookupFactory.call(container, fullName);
  };

  var user2;

  run(function() {
    user = User.create({
      container: container,
      validations: {
        name: {
          presence: true
        }
      }
    });

    validatorResolvedCount = 0;

    user2 = User.create({
      container: container,
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
  setup: function() {
    User = Ember.Object.extend(EmberValidations, {
      container: buildContainer()
    });
  }
});

test("mixed validation syntax", function(assert) {
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

  assert.deepEqual(['it failed'], get(user, 'validationErrors.name'));
});

test("concise validation syntax", function(assert) {
  run(function() {
    user = User.create({
      validations: {
        name: validator(function() {
          return 'it failed';
        })
      }
    });
  });

  assert.deepEqual(['it failed'], get(user, 'validationErrors.name'));
});
