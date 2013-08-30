var user, User, profile, Profile, AgeValidator;

module('Compostite validators', {
  setup: function() {
    AgeValidator = Ember.Validations.validators.Base.extend({
      property: 'age',
      options: {},
      errors: Ember.makeArray(),
      call: function() {
        if ((this.model.get('age') || 0) < 21) {
          this.errors.pushObject('cannot buy beer');
        }
      }
    });

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
  ok(!profile.get('isValid'));
  // Ember.run(function() {
    // user = User.create({
      // profile: profile,
      // validations: ['profile']
    // });
  // });
  // equal(user.get('isValid'), false);
  // Ember.run(function() {
    // profile.set('title', 'Developer');
  // });
  // equal(user.get('isValid'), true);
});

test('validates custom validator', function() {
  Ember.run(function() {
    user = User.create({
      profile: profile,
      validations: [AgeValidator]
    });
  });
  equal(user.get('isValid'), false);
  Ember.run(function() {
    user.set('age', 22);
  });
  equal(user.get('isValid'), true);
});

test('validates array of validable objects', function() {
  var friend1, friend2;

  Ember.run(function() {
    user = User.create({
      friends: Ember.makeArray(),
      validations: ['friends']
    });
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
});

test('eventually validates other validatable property when that property is not yet set', function() {
  Ember.run(function() {
    user = User.create({
      validations: ['profile']
    });
  });
  equal(user.get('isValid'), true);
  Ember.run(function() {
    user.set('profile', profile);
  });
  equal(user.get('isValid', false), false);
  Ember.run(function() {
    profile.set('title', 'Developer');
  });
  equal(user.get('isValid'), true);
});
