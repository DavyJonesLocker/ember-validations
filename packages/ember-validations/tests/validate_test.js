var user, User;

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

asyncTest('returns a promise', function() {
  Ember.run(function(){
    user.validate().then(function(){
      equal(user.get('isValid'), false);
      start();
    });
  });
});

asyncTest('runs all validations', function() {
  Ember.run(function(){
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), ["can't be blank", 'is the wrong length (should be 5 characters)']);
      deepEqual(user.errors.get('lastName'), ["is invalid"]);
      equal(user.get('isValid'), false);
      user.set('firstName', 'Bob');
      user.validate('firstName').then(function(){
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

asyncTest('runs a single validation', function() {
  Ember.run(function(){
    user.validate('firstName').then(function(){
      deepEqual(user.errors.get('firstName'), ["can't be blank", 'is the wrong length (should be 5 characters)']);
      equal(user.errors.get('lastName'), undefined);
      equal(user.get('isValid'), false);
      user.set('firstName', 'Bob');
      user.validate('firstName').then(function(){
        deepEqual(user.errors.get('firstName'), ['is the wrong length (should be 5 characters)']);
        equal(user.get('isValid'), false);
        start();
      });
    });
  });
});
