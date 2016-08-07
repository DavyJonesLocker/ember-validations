import Ember from 'ember';
import { module, test } from 'qunit';
import EmberValidations, { validator } from 'ember-validations';
import buildContainer from '../helpers/build-container';
import Base from 'ember-validations/validators/base';

var user, User, promise;
var get = Ember.get;
var set = Ember.set;
var run = Ember.run;

var Profile, profile;

module('Relationship validators', {
  setup: function() {
    Profile = Ember.Object.extend(EmberValidations, {
      container: buildContainer(),
      validations: {
        title: {
          presence: true
        }
      }
    });

    run(function() {
      profile = Profile.create({hey: 'yo'});
    });

    User = Ember.Object.extend(EmberValidations, {
      container: buildContainer()
    });
  }
});

test('validates other validatable property', function(assert) {
  run(function() {
    user = User.create({
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

  run(function() {
    user = User.create({
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

  run(function() {
    friend1 = User.create({
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

  run(function() {
    friend2 = User.create({
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

  run(function() {
    user = User.create({
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

  run(function() {
    friend1 = User.create({
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

  run(function() {
    friend2 = User.create({
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
