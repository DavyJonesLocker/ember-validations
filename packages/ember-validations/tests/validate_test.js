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

asyncTest('works with objects that rely on stateManager for isValid', function() {
  var retrieveFromCurrentState = Ember.computed(function(key, value) {
    if (arguments.length > 1) {
      throw new Error('Cannot Set: ' + key + ' on: ' + this.toString() );
    }
    return Ember.get(Ember.get(this, 'stateManager.currentState'), key);
  }).property('stateManager.currentState');

  User.reopen({
    isValid: retrieveFromCurrentState,
    stateManager: Ember.StateManager.create({
      initialState: 'uncommitted',
      uncommitted: Ember.State.create({
        isValid: true
      }),
      invalid: Ember.State.create({
        isValid: false
      })
    })
  });

  user = User.create();
  Ember.run(function(){
    user.validate().then(function(){
      equal(user.get('isValid'), false);
      start();
    }, function() {
      equal(1, 0, 'should never get here');
      start();
    });
  });
});

asyncTest('does not change the state when is not dirty and does not have errors', function() {
  var retrieveFromCurrentState = Ember.computed(function(key, value) {
    if (arguments.length > 1) {
      throw new Error('Cannot Set: ' + key + ' on: ' + this.toString() );
    }
    return Ember.get(Ember.get(this, 'stateManager.currentState'), key);
  }).property('stateManager.currentState');

  User.reopen({
    isValid: retrieveFromCurrentState,
    isDirty: retrieveFromCurrentState,
    stateManager: Ember.StateManager.create({
      initialState: 'saved',
      // when the model is loaded using find(), the state is 'saved'
      saved: Ember.State.create({
        isValid: true,
        isDirty: false
      }),
      // when the model is changed, it become 'updated.uncommited'
      updated: Ember.State.create({
        isDirty: true,
        uncommitted: Ember.State.create({
          isValid: true
        }),
        invalid: Ember.State.create({
          isValid: false
        })
      })
    })
  });

  user = User.create({firstName: 'Abcde', lastName: 'Xyz'});
  Ember.run(function(){
    user.validate().then(function(){
      equal(user.get('stateManager.currentState.name'), 'saved');
      start();
    }, function(err) {
      equal(1, 0, 'Should never get here. Error: ' + err);
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
