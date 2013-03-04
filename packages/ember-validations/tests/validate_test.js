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

module('Validate with conditional validations', {
  setup: function() {
    User = Ember.Object.extend(Ember.Validations.Mixin);
    user = User.create();
  }
});

asyncTest('if with function', function() {
  user.validations = {
    firstName: {
      presence: {
        if: function(object, validator) {
          return false;
        }
      }
    }
  };

  Ember.run(function(){
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), undefined);
      user.validations.firstName.presence['if'] = function(object, validator) { return true; };
      user.validate().then(function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('if with property reference', function() {
  user.validations = {
    firstName: {
      presence: {
        if: 'canValidate'
      }
    }
  };

  user.set('canValidate', false);

  Ember.run(function(){
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), undefined);
      user.set('canValidate', true);
      user.validate().then(function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('if with function reference', function() {
  user.validations = {
    firstName: {
      presence: {
        if: 'canValidate'
      }
    }
  };

  user.canValidate = function() {
    return false;
  };

  Ember.run(function(){
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), undefined);
      user.set('canValidate', true);
      user.canValidate = function() {
        return true;
      };
      user.validate().then(function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('unless with function', function() {
  user.validations = {
    firstName: {
      presence: {
        unless: function(object, validator) {
          return true;
        }
      }
    }
  };

  Ember.run(function(){
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), undefined);
      user.validations.firstName.presence['unless'] = function(object, validator) { return false; };
      user.validate().then(function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('if with property reference', function() {
  user.validations = {
    firstName: {
      presence: {
        unless: 'canValidate'
      }
    }
  };

  user.set('canValidate', true);

  Ember.run(function(){
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), undefined);
      user.set('canValidate', false);
      user.validate().then(function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('if with function reference', function() {
  user.validations = {
    firstName: {
      presence: {
        unless: 'canValidate'
      }
    }
  };

  user.canValidate = function() {
    return true;
  };

  Ember.run(function(){
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), undefined);
      user.set('canValidate', true);
      user.canValidate = function() {
        return false;
      };
      user.validate().then(function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});
