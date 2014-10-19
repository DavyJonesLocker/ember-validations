import Ember from 'ember';
import EmberValidations from 'ember-validations';
import { buildContainer } from '../helpers/container';
import Base from 'ember-validations/validators/base';

var user, User;
var get = Ember.get;
var set = Ember.set;

module('Validate test', {
  setup: function() {
    User = Ember.Object.extend(EmberValidations.Mixin, {
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
    Ember.run(function() {
      user = User.create();
    });
  }
});

asyncTest('returns a promise', function() {
  Ember.run(function(){
    user.validate().then(function(){
      ok(false, 'expected validation failed');
    }, function() {
      equal(get(user, 'isValid'), false);
      start();
    });
  });
});

test('isInvalid tracks isValid', function() {
  equal(get(user, 'isInvalid'), true);
  Ember.run(function() {
    user.setProperties({firstName: 'Brian', lastName: 'Cardarella'});
  });
  equal(get(user, 'isInvalid'), false);
});

asyncTest('runs all validations', function() {
  Ember.run(function(){
    user.validate().then(null, function(errors){
      deepEqual(get(errors, 'firstName'), ["can't be blank", 'is the wrong length (should be 5 characters)']);
      deepEqual(get(errors, 'lastName'), ["is invalid"]);
      equal(get(user, 'isValid'), false);
      set(user, 'firstName', 'Bob');
      user.validate('firstName').then(null, function(errors){
        deepEqual(get(errors, 'firstName'), ['is the wrong length (should be 5 characters)']);
        equal(get(user, 'isValid'), false);
        set(user, 'firstName', 'Brian');
        set(user, 'lastName', 'Cardarella');
        user.validate().then(function(errors){
          ok(Ember.isEmpty(get(errors, 'firstName')));
          ok(Ember.isEmpty(get(errors, 'lastName')));
          equal(get(user, 'isValid'), true);
          start();
        });
      });
    });
  });
});

test('can be mixed into an object controller', function() {
  var Controller, controller, user;
  Controller = Ember.ObjectController.extend(EmberValidations.Mixin, {
    container: buildContainer(),
    validations: {
      name: {
        presence: true
      }
    }
  });

  Ember.run(function() {
    controller = Controller.create();
  });
  equal(get(controller, 'isValid'), false);
  user = Ember.Object.create();
  Ember.run(function() {
    set(controller, 'content', user);
  });
  equal(get(controller, 'isValid'), false);
  Ember.run(function() {
    set(user, 'name', 'Brian');
  });
  equal(get(controller, 'isValid'), true);
});

module('Array controller');

test('can be mixed into an array controller', function() {
  var Controller, controller, user, UserController;
  var container = buildContainer();

  UserController = Ember.ObjectController.extend(EmberValidations.Mixin, {
    container: buildContainer(),
    validations: {
      name: {
        presence: true
      }
    }
  });
  container.register('controller:User', UserController);
  Controller = Ember.ArrayController.extend(EmberValidations.Mixin, {
    itemController: 'User',
    container: container,
    validations: {
      '[]': true
    }
  });

  Ember.run(function() {
    controller = Controller.create();
  });
  equal(get(controller, 'isValid'), true);
  user = Ember.Object.create();
  Ember.run(function() {
    controller.pushObject(user);
  });
  equal(get(controller, 'isValid'), false);
  Ember.run(function() {
    set(user, 'name', 'Brian');
  });
  equal(get(controller, 'isValid'), true);
  Ember.run(function() {
    set(user, 'name', undefined);
  });
  equal(get(controller, 'isValid'), false);
  Ember.run(function() {
    get(controller, 'content').removeObject(user);
  });
  equal(get(controller, 'isValid'), true);
});

var Profile, profile;

module('Relationship validators', {
  setup: function() {
    Profile = Ember.Object.extend(EmberValidations.Mixin, {
      container: buildContainer(),
      validations: {
        title: {
          presence: true
        }
      }
    });

    Ember.run(function() {
      profile = Profile.create({hey: 'yo'});
    });

    User = Ember.Object.extend(EmberValidations.Mixin, {
      container: buildContainer()
    });
  }
});

test('validates other validatable property', function() {
  Ember.run(function() {
    user = User.create({
      validations: {
        profile: true
      }
    });
  });
  equal(get(user, 'isValid'), true);
  Ember.run(function() {
    set(user, 'profile', profile);
  });
  equal(get(user, 'isValid'), false);
  Ember.run(function() {
    set(profile, 'title', 'Developer');
  });
  equal(get(user, 'isValid'), true);
});

// test('validates custom validator', function() {
  // Ember.run(function() {
    // user = User.create({
      // profile: profile,
      // validations: [AgeValidator]
    // });
  // });
  // equal(get(user, 'isValid'), false);
  // Ember.run(function() {
    // set(user, 'age', 22);
  // });
  // equal(get(user, 'isValid'), true);
// });

test('validates array of validable objects', function() {
  var friend1, friend2;

  Ember.run(function() {
    user = User.create({
      validations: {
        friends: true
      }
    });
  });

  equal(get(user, 'isValid'), true);

  Ember.run(function() {
    set(user, 'friends', Ember.A());
  });

  equal(get(user, 'isValid'), true);

  Ember.run(function() {
    friend1 = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  Ember.run(function() {
    user.friends.pushObject(friend1);
  });

  equal(get(user, 'isValid'), false);

  Ember.run(function() {
    set(friend1, 'name', 'Stephanie');
  });

  equal(get(user, 'isValid'), true);

  Ember.run(function() {
    friend2 = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });

    user.friends.pushObject(friend2);
  });

  equal(get(user, 'isValid'), false);

  Ember.run(function() {
    user.friends.removeObject(friend2);
  });

  equal(get(user, 'isValid'), true);
});


test('revalidates arrays when they are replaced', function() {
  var friend1, friend2;

  Ember.run(function() {
    user = User.create({
      validations: {
        friends: true
      }
    });
  });

  equal(get(user, 'isValid'), true);

  Ember.run(function() {
    set(user, 'friends', Ember.A());
  });

  equal(get(user, 'isValid'), true);

  Ember.run(function() {
    friend1 = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  Ember.run(function() {
    set(user, 'friends', Ember.A([friend1]));
  });

  equal(get(user, 'isValid'), false);

  Ember.run(function() {
    set(friend1, 'name', 'Stephanie');
  });

  equal(get(user, 'isValid'), true);

  Ember.run(function() {
    friend2 = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });

    set(user, 'friends', Ember.A([friend1, friend2]));
  });

  equal(get(user, 'isValid'), false);

  Ember.run(function() {
    user.friends.removeObject(friend2);
  });

  equal(get(user, 'isValid'), true);
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

    User = Ember.Object.extend(EmberValidations.Mixin, {
      container: buildContainer()
    });
  },
  teardown: function() {
    requirejs.clear();
    requirejs.rollback();
  }
});

test('should lookup in project namespace first', function() {
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

  Ember.run(function() {
    user = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  ok(!nativeValidatorCalled, 'should not have preferred ember-validation\'s presence validator');
  ok(dummyValidatorCalled, 'should have preferred my applications presence validator');
});

test('will lookup both local and remote validators of similar name', function() {
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

  Ember.run(function() {
    user = User.create({
      validations: {
        name: {
          uniqueness: true
        }
      }
    });
  });

  ok(localValidatorCalled, 'should call local uniqueness validator');
  ok(remoteValidatorCalled, 'should call remote uniqueness validator');
});

test('should prefer lookup in just "validators" before "native"', function() {
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

  Ember.run(function() {
    user = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  ok(!nativeValidatorCalled, 'should not have preferred ember-validation\'s presence validator');
  ok(dummyValidatorCalled, 'should have preferred my applications presence validator');
});

module('inline validations', {
  setup: function() {
    User = Ember.Object.extend(EmberValidations.Mixin, {
      container: buildContainer()
    });
  }
});

test("mixed validation syntax", function() {
  Ember.run(function() {
    user = User.create({
      validations: {
        name: {
          inline: EmberValidations.validator(function() {
            return 'it failed';
          })
        }
      }
    });
  });

  deepEqual(['it failed'], get(user, 'errors.name'));
});

test("concise validation syntax", function() {
  Ember.run(function() {
    user = User.create({
      validations: {
        name: EmberValidations.validator(function() {
          return 'it failed';
        })
      }
    });
  });

  deepEqual(['it failed'], get(user, 'errors.name'));
});
