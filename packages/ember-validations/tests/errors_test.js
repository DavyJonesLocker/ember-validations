var user, User;

module('Errors test', {
  setup: function() {
    User = Ember.Object.extend(Ember.Validations.Mixin, {
      validations: {
        name: {
          presence: true
        },
        age: {
          presence: true,
          numericality: true
        }
      }
    });
  },
  teardown: function() {
    delete Ember.I18n;
  }
});

test('validations are run on instantiation', function() {
  Ember.run(function() {
    user = User.create();
  });
  equal(user.get('isValid'), false);
  deepEqual(user.get('errors.name'), ["can't be blank"]);
  deepEqual(user.get('errors.age'), ["can't be blank", 'is not a number']);
  Ember.run(function() {
    user = User.create({name: 'Brian', age: 33});
  });
  ok(user.get('isValid'));
  deepEqual(user.get('errors.name'), []);
  deepEqual(user.get('errors.age'), []);
});

test('when errors are resolved', function() {
  Ember.run(function() {
    user = User.create();
  });
  equal(user.get('isValid'), false);
  deepEqual(user.get('errors.name'), ["can't be blank"]);
  deepEqual(user.get('errors.age'), ["can't be blank", 'is not a number']);
  Ember.run(function() {
    user.set('name', 'Brian');
  });
  equal(user.get('isValid'), false);
  deepEqual(user.get('errors.name'), []);
  deepEqual(user.get('errors.age'), ["can't be blank", 'is not a number']);
  Ember.run(function() {
    user.set('age', 'thirty three');
  });
  equal(user.get('isValid'), false);
  deepEqual(user.get('errors.name'), []);
  deepEqual(user.get('errors.age'), ['is not a number']);
  Ember.run(function() {
    user.set('age', 33);
  });
  ok(user.get('isValid'));
  deepEqual(user.get('errors.name'), []);
  deepEqual(user.get('errors.age'), []);
});

test('validations use Ember.I18n.t to render the message if Ember.I18n is present', function() {
  Ember.I18n = {
    translations: {
      errors: {
        blank: 'muss ausgefüllt werden',
        notANumber: 'ist keine Zahl'
      }
    },
    lookupKey: function(key, hash) {
      var firstKey, idx, remainingKeys;

      if (hash[key] !== null && hash[key] !== undefined) { return hash[key]; }

      if ((idx = key.indexOf('.')) !== -1) {
        firstKey = key.substr(0, idx);
        remainingKeys = key.substr(idx + 1);
        hash = hash[firstKey];
        if (hash) { return Ember.I18n.lookupKey(remainingKeys, hash); }
      }
    },
    t: function(key, context) {
      return Ember.I18n.lookupKey(key, Ember.I18n.translations);
    }
  };
  
  Ember.run(function() {
    user = User.create();
  });
  equal(user.get('isValid'), false);
  deepEqual(user.get('errors.name'), ['muss ausgefüllt werden']);
  deepEqual(user.get('errors.age'), ['muss ausgefüllt werden', 'ist keine Zahl']);
  Ember.run(function() {
    user.set('age', 'thirty three');
  });
  equal(user.get('isValid'), false);
  deepEqual(user.get('errors.age'), ['ist keine Zahl']);
});
