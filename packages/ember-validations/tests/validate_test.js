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
    user.validate().then(null, function(){
      deepEqual(user.errors.get('firstName'), ["can't be blank", 'is the wrong length (should be 5 characters)']);
      deepEqual(user.errors.get('lastName'), ["is invalid"]);
      equal(user.get('isValid'), false);
      user.set('firstName', 'Bob');
      user.validate('firstName').then(null, function(){
        deepEqual(user.errors.get('firstName'), ['is the wrong length (should be 5 characters)']);
        equal(user.get('isValid'), false);
        user.set('firstName', 'Brian');
        user.set('lastName', 'Cardarella');
        user.validate().then(function(){
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
