var user, User;

module('Validate test', {
  setup: function() {
    User = Ember.Object.extend(Ember.Validations.Mixin, {
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
      equal(user.get('isValid'), false);
      start();
    });
  });
});

test('isInvalid tracks isValid', function() {
  equal(user.get('isInvalid'), true);
  Ember.run(function() {
    user.setProperties({firstName: 'Brian', lastName: 'Cardarella'});
  });
  equal(user.get('isInvalid'), false);
});

asyncTest('runs all validations', function() {
  Ember.run(function(){
    user.validate().then(null, function(errors){
      deepEqual(errors.get('firstName'), ["can't be blank", 'is the wrong length (should be 5 characters)']);
      deepEqual(errors.get('lastName'), ["is invalid"]);
      equal(user.get('isValid'), false);
      user.set('firstName', 'Bob');
      user.validate('firstName').then(null, function(errors){
        deepEqual(errors.get('firstName'), ['is the wrong length (should be 5 characters)']);
        equal(user.get('isValid'), false);
        user.set('firstName', 'Brian');
        user.set('lastName', 'Cardarella');
        user.validate().then(function(errors){
          deepEqual(errors.get('firstName'), []);
          deepEqual(errors.get('lastName'), []);
          equal(user.get('isValid'), true);
          start();
        });
      });
    });
  });
});

test('can be mixed into an object controller', function() {
  var Controller, controller, user;
  Controller = Ember.ObjectController.extend(Ember.Validations.Mixin, {
    validations: {
      name: {
        presence: true
      }
    }
  });

  Ember.run(function() {
    controller = Controller.create();
  });
  equal(controller.get('isValid'), false);
  user = Ember.Object.create();
  Ember.run(function() {
    controller.set('content', user);
  });
  equal(controller.get('isValid'), false);
  Ember.run(function() {
    user.set('name', 'Brian');
  });
  equal(controller.get('isValid'), true);
});

module('Array controller');

test('can be mixed into an array controller', function() {
  var Controller, controller, container, user, UserController;
  container = new Ember.Container();
  UserController = Ember.ObjectController.extend(Ember.Validations.Mixin, {
    validations: {
      name: {
        presence: true
      }
    }
  });
  container.register('controller:User', UserController);
  Controller = Ember.ArrayController.extend(Ember.Validations.Mixin, {
    itemController: 'User',
    container: container,
    validations: {
      '[]': true
    }
  });

  Ember.run(function() {
    controller = Controller.create();
  });
  equal(controller.get('isValid'), true);
  user = Ember.Object.create();
  Ember.run(function() {
    controller.pushObject(user);
  });
  equal(controller.get('isValid'), false);
  Ember.run(function() {
    user.set('name', 'Brian');
  });
  equal(controller.get('isValid'), true);
  Ember.run(function() {
    user.set('name', undefined);
  });
  equal(controller.get('isValid'), false);
  Ember.run(function() {
    controller.get('content').removeObject(user);
  });
  equal(controller.get('isValid'), true);
});

var Profile, profile;

module('Relationship validators', {
  setup: function() {
    Profile = Ember.Object.extend(Ember.Validations.Mixin, {
      validations: {
        title: {
          presence: true
        }
      }
    });

    Ember.run(function() {
      profile = Profile.create({hey: 'yo'});
    });

    User = Ember.Object.extend(Ember.Validations.Mixin);
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
  equal(user.get('isValid'), true);
  Ember.run(function() {
    user.set('profile', profile);
  });
  equal(user.get('isValid'), false);
  Ember.run(function() {
    profile.set('title', 'Developer');
  });
  equal(user.get('isValid'), true);
});

// test('validates custom validator', function() {
  // Ember.run(function() {
    // user = User.create({
      // profile: profile,
      // validations: [AgeValidator]
    // });
  // });
  // equal(user.get('isValid'), false);
  // Ember.run(function() {
    // user.set('age', 22);
  // });
  // equal(user.get('isValid'), true);
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

  equal(user.get('isValid'), true);

  Ember.run(function() {
    user.set('friends', Ember.makeArray());
  });

  equal(user.get('isValid'), true);

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

  equal(user.get('isValid'), false);

  Ember.run(function() {
    friend1.set('name', 'Stephanie');
  });

  equal(user.get('isValid'), true);

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

  equal(user.get('isValid'), false);

  Ember.run(function() {
    user.friends.removeObject(friend2);
  });

  equal(user.get('isValid'), true);
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

  equal(user.get('isValid'), true);

  Ember.run(function() {
    user.set('friends', Ember.makeArray());
  });

  equal(user.get('isValid'), true);

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
    user.set('friends', [friend1]);
  });

  equal(user.get('isValid'), false);

  Ember.run(function() {
    friend1.set('name', 'Stephanie');
  });

  equal(user.get('isValid'), true);

  Ember.run(function() {
    friend2 = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });

    user.set('friends', [friend1, friend2]);
  });

  equal(user.get('isValid'), false);

  Ember.run(function() {
    user.friends.removeObject(friend2);
  });

  equal(user.get('isValid'), true);
});
