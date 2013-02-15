var user, User;

module('Validate test', {
  setup: function() {
    User = DS.Model.extend(DS.Validations.Mixin, {
      validations: {
        firstName: {
          presence: true,
          length: 5
        },
        lastName: {
          presence: true
        }
      }
    });
    user = new User();
    // user.stateManager.transitionTo('loaded.created');
  }
});

// test('sets the record in the invalid state when running validations and they fail', function() {
  // user.validate();
  // equal(user.errors.get('firstName'), "can't be blank");
  // equal(user.errors.get('lastName'), "can't be blank");
  // user.set('firstName', 'Bob');
  // user.validate();
  // equal(user.errors.get('firstName'), 'wrong length');
  // ok(!user.isValid);
  // equal(user.stateManager.get('currentState.name'), 'invalid');
// });
