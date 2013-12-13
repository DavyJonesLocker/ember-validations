var user, User;

module('Conditional validations', {
  setup: function() {
    User = Ember.Object.extend(Ember.Validations.Mixin);
  }
});

asyncTest('if with function', function() {
  expect(4);
  User.reopen({
    validations: {
      firstName: {
        presence: {
          if: function(model) {
            return false;
          }
        }
      }
    }
  });

  Ember.run(function(){
    user = User.create();
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), []);
      var validator = user.validators.get('firstObject');
      validator.conditionals['if'] = function(model, property) {
        equal(user, model, "the conditional validator is passed the model being validated");
        equal(property, 'firstName', "the conditional validator is passed the name of the property being validated");
        return true;
      };
      user.validate().then(null, function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('if with property reference', function() {
  User.reopen({
    validations: {
      firstName: {
        presence: {
          if: 'canValidate'
        }
      }
    }
  });


  Ember.run(function(){
    user = User.create();
    user.set('canValidate', false);
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), []);
      user.set('canValidate', true);
      user.validate().then(null, function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('if with function reference', function() {
  User.reopen({
    validations: {
      firstName: {
        presence: {
          if: 'canValidate'
        }
      }
    },
    canValidate: function() {
      return false;
    }
  });

  Ember.run(function(){
    user = User.create();
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), []);
      user.set('canValidate', true);
      user.canValidate = function() {
        return true;
      };
      user.validate().then(null, function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('unless with function', function() {
  expect(4);
  User.reopen({
    validations: {
      firstName: {
        presence: {
          unless: function(model) {
            return true;
          }
        }
      }
    }
  });

  Ember.run(function(){
    user = User.create();
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), []);
      var validator = user.validators.get('firstObject');
      validator.conditionals['unless'] = function(model, property) {
        equal(user, model, "the conditional validator is passed the model being validated");
        equal(property, 'firstName', "the conditional validator is passed the name of the property being validated");
        return false;
      };
      user.validate().then(null, function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('unless with property reference', function() {
  User.reopen({
    validations: {
      firstName: {
        presence: {
          unless: 'canValidate'
        }
      }
    },
    canValidate: true
  });

  Ember.run(function(){
    user = User.create();
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), []);
      user.set('canValidate', false);
      user.validate().then(null, function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('unless with function reference', function() {
  User.reopen({
    validations: {
      firstName: {
        presence: {
          unless: 'canValidate'
        }
      }
    },
    canValidate: function() {
      return true;
    }
  });

  Ember.run(function(){
    user = User.create();
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), []);
      user.set('canValidate', true);
      user.canValidate = function() {
        return false;
      };
      user.validate().then(null, function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});
