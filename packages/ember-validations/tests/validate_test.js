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
    user = new User();
  }
});

test('runs all validations', function() {
  user.validate();
  equal(user.errors.get('firstName'), "can't be blank");
  equal(user.errors.get('lastName'), "is invalid");
  user.set('firstName', 'Bob');
  user.validate();
  equal(user.errors.get('firstName'), 'is the wrong length (should be 5 characters)');
});

test('runs a single validation', function() {
  user.validate('firstName');
  equal(user.errors.get('firstName'), "can't be blank");
  equal(user.errors.get('lastName'), undefined);
  user.set('firstName', 'Bob');
  user.validate('firstName');
  equal(user.errors.get('firstName'), 'is the wrong length (should be 5 characters)');
});
