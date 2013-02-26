var user, User;

module('Errors test', {
  setup: function() {
    User = Ember.Object.extend(Ember.Validations.Mixin);
    user = User.create();
  }
});

test('adding a new error for a property', function() {
  user.errors.add('firstName', "can't be blank");
  deepEqual(user.get('errors.firstName'), ["can't be blank"]);
  user.errors.add('firstName', "is invalid");
  deepEqual(user.get('errors.firstName'), ["can't be blank", 'is invalid']);
});

test('clears existing errors', function() {
  user.errors.add('firstName', "can't be blank");
  user.errors.add('lastName', "can't be blank");
  deepEqual(Object.keys(user.errors), ['firstName', 'lastName']);
  user.errors.clear();
  deepEqual(Object.keys(user.errors), []);
});
