var user, User, profile, Profile, ageValidator;

module('Compostite validators test', {
  setup: function() {
    ageValidator = {
      validate: function() {
        var _this = this;
        return Ember.RSVP.Promise(function(resolve, reject) {
          if (_this.model.get('age') > 21) {
            return resolve();
          } else {
            return reject();
          }
        });
      }
    };

    Profile = Ember.Object.extend(Ember.Validations.Mixin, {
      validations: {
        title: {
          presence: true
        }
      }
    });
    profile = Profile.create();
    User = Ember.Object.extend(Ember.Validations.Mixin, {
      validations: [{
        name: {
          presence: true
        }
      }, profile, ageValidator]
    });
    user = User.create();
    ageValidator.model = user;
  }
});

asyncTest('validates other objects', function() {
  Ember.run(function(){
    user.validate().then(function(){
      ok(false, 'expected validation failed');
    }, function() {
      equal(user.get('isValid'), false);
      user.set('name', 'Brian');
      user.validate().then(function() {
        ok(false, 'expected validation failed');
        start();
      }, function() {
        equal(user.get('isValid'), false);
        profile.set('title', 'Developer');
        user.validate().then(function() {
          ok(false, 'expected validation failed');
          start();
        }, function() {
          equal(user.get('isValid'), false);
          user.set('age', 33);
          user.validate().then(function() {
            equal(user.get('isValid'), true);
            start();
          }, function() {
            ok(false, 'expected validation failed');
            start();
          });
        });
      });
    });
  });
});

