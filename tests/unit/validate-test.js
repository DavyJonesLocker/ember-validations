import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import EmberValidations, { validator } from 'ember-validations';
import Base from 'ember-validations/validators/base';

var user, User, promise;
var get = Ember.get;
var set = Ember.set;
var run = Ember.run;

moduleFor('object:user', 'Validate test', {
  integration: true,

  beforeEach: function() {
    User = Ember.Object.extend(EmberValidations, {
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

    this.registry.register('object:user', User);

    run(() => user = this.subject());
  }
});

test('returns a promise', function(assert) {
  run(() => {
    promise = user.validate()
      .then(() => assert.ok(false, 'expected validation failed'))
      .catch(() => assert.equal(get(user, 'isValid'), false));
  });

  return promise;
});

test('isInvalid tracks isValid', function(assert) {
  assert.equal(get(user, 'isInvalid'), true);
  run(() => user.setProperties({firstName: 'Brian', lastName: 'Cardarella'}));
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

if (Ember.ObjectController) {
  test('can be mixed into an controller', function(assert) {
    var Controller, controller, user;

    Controller = Ember.ObjectController.extend(EmberValidations, {
      validations: {
        name: {
          presence: true
        }
      }
    });

    this.registry.register('controller:user', Controller);

    run(() => controller = this.container.lookupFactory('controller:user').create());
    assert.equal(get(controller, 'isValid'), false);

    user = Ember.Object.create();
    run(() => set(controller, 'model', user));
    assert.equal(get(controller, 'isValid'), false);

    run(() => set(user, 'name', 'Brian'));
    assert.equal(get(controller, 'isValid'), true);
  });
}

if (Ember.ArrayController) {
  moduleFor('controller:user', 'Array controller', {
    integration: true
  });

  test('can be mixed into an array controller', function(assert) {
    var Controller, controller, user, UserController;

    UserController = Ember.ObjectController.extend(EmberValidations, {
      validations: {
        name: {
          presence: true
        }
      }
    });

    this.registry.register('controller:user', UserController);

    Controller = Ember.ArrayController.extend(EmberValidations, {
      itemController: 'User',
      validations: {
        '[]': true
      }
    });

    this.registry.register('controller:list', Controller);

    run(() => controller = this.container.lookupFactory('controller:list').create());

    assert.equal(get(controller, 'isValid'), true);

    user = Ember.Object.create();

    run(() => controller.pushObject(user));

    assert.equal(get(controller, 'isValid'), false);
    run(() => set(user, 'name', 'Brian'));
    assert.equal(get(controller, 'isValid'), true);
    run(() => set(user, 'name', undefined));
    assert.equal(get(controller, 'isValid'), false);
    run(() => get(controller, 'content').removeObject(user));
    assert.equal(get(controller, 'isValid'), true);
  });
}

var Profile, profile;

moduleFor('object:profile', 'Relationship validators', {
  integration: true,

  beforeEach: function() {
    Profile = Ember.Object.extend(EmberValidations, {
      validations: {
        title: {
          presence: true
        }
      }
    });

    User = Ember.Object.extend(EmberValidations);

    this.registry.register('object:profile', Profile);
    this.registry.register('object:user', User);

    run(() => profile = this.subject({ hey: 'yo' }));
  }
});

test('validates other validatable property', function(assert) {
  run(() => {
    user = this.factory('object:user').create({
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

  run(() => {
    user = this.factory('object:user').create({
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

  run(() => {
    friend1 = this.factory('object:user').create({
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

  run(() => {
    friend2 = this.factory('object:user').create({
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

  run(() => {
    user = this.factory('object:user').create({
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

  run(() => {
    friend1 = this.factory('object:user').create({
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

  run(() => {
    friend2 = this.factory('object:user').create({
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

moduleFor('object:user', 'validator class lookup order', {
  integration: true,

  beforeEach: function() {
    User = Ember.Object.extend(EmberValidations);
    this.registry.register('object:user', User);
  }
});

test('should lookup in project namespace first', function(assert) {
  var dummyValidatorCalled = false;
  var nativeValidatorCalled = false;

  this.registry.register('ember-validations@validator:local/presence', Base.extend({
    init() {
      this._super(...arguments);
      nativeValidatorCalled = true;
    },
    call: Ember.K
  }));

  this.registry.register('validator:local/presence', Base.extend({
    init() {
      this._super(...arguments);
      dummyValidatorCalled = true;
    },
    call: Ember.K
  }));

  run(() => {
    user = this.subject({
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


  this.registry.register('validator:local/uniqueness', Base.extend({
    init() {
      this._super(...arguments);
      localValidatorCalled = true;
    },
    call: Ember.K
  }));

  this.registry.register('validator:remote/uniqueness', Base.extend({
    init() {
      this._super(...arguments);
      remoteValidatorCalled = true;
    },
    call: Ember.K
  }));

  run(() => {
    user = this.subject({
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


  this.registry.register('ember-validations@validator:remote/uniqueness', Base.extend({
    init() {
      this._super(...arguments);
      nativeValidatorCalled = true;
    },
    call: Ember.K
  }));

  this.registry.register('validator:presence', Base.extend({
    init() {
      this._super(...arguments);
      dummyValidatorCalled = true;
    },
    call: Ember.K
  }));

  run(() => {
    user = this.subject({
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

  var oldResolveRegistration = this.registry.resolveRegistration;

  this.registry.resolveRegistration = (fullName) => {
    validatorResolvedCount += 1;
    return oldResolveRegistration.call(this.registry, fullName);
  };

  var user2;

  run(() => {
    user = this.subject({
      validations: {
        name: {
          presence: true
        }
      }
    });

    validatorResolvedCount = 0;

    user2 = this.subject({
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  this.registry.resolveRegistration = oldResolveRegistration;

  assert.ok(!get(user, 'isValid'));
  assert.ok(!get(user2, 'isValid'));
  assert.equal(0, validatorResolvedCount);
});

moduleFor('object:user', 'inline validations', {
  integration: true,

  beforeEach: function() {
    User = Ember.Object.extend(EmberValidations);
    this.registry.register('object:user', User);
  }
});

test("mixed validation syntax", function(assert) {
  run(() => {
    user = this.subject({
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

test("concise validation syntax", function(assert) {
  run(() => {
    user = this.subject({
      validations: {
        name: validator(function() {
          return 'it failed';
        })
      }
    });
  });

  assert.deepEqual(['it failed'], get(user, 'errors.name'));
});
