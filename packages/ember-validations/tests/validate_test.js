var user, User;
var validate = function(object, property) {
  Ember.run(function() {
    object.validate(property);
  });
};

module('Validate test', {
  setup: function() {
    User = Ember.Object.extend(Ember.Validations.Mixin, {
      validations: {
        firstName: {
          presence: true,
          length: [5]
        },
        lastName: {
          format: { with: /\w+/ }
        }
      }
    });
    user = User.create();
  }
});

asyncTest('runs all validations', function() {
  validate(user);
  setTimeout(function() {
    deepEqual(user.errors.get('firstName'), ["can't be blank", 'is the wrong length (should be 5 characters)']);
    deepEqual(user.errors.get('lastName'), ["is invalid"]);
    equal(user.get('isValid'), false);
    user.set('firstName', 'Bob');
    validate(user);
    setTimeout(function() {
      deepEqual(user.errors.get('firstName'), ['is the wrong length (should be 5 characters)']);
      equal(user.get('isValid'), false);
      user.set('firstName', 'Brian');
      user.set('lastName', 'Cardarella');
      validate(user);
      setTimeout(function() {
        equal(user.get('isValid'), true);
        start();
      }, 50);
    }, 50);
  }, 50);
});

asyncTest('runs a single validation', function() {
  validate(user, 'firstName');
  setTimeout(function() {
    deepEqual(user.errors.get('firstName'), ["can't be blank", 'is the wrong length (should be 5 characters)']);
    equal(user.errors.get('lastName'), undefined);
    equal(user.get('isValid'), false);
    user.set('firstName', 'Bob');
    validate(user, 'firstName');
    setTimeout(function() {
      deepEqual(user.errors.get('firstName'), ['is the wrong length (should be 5 characters)']);
      equal(user.get('isValid'), false);
      start();
    }, 50);
  }, 50);
});

asyncTest('fires an event once validated', function(){
  user.one('didValidate', user, function(valid){
    equal(user.get('isValid'), false);
    equal(valid, false);
    start();
  });
  validate(user);
});
