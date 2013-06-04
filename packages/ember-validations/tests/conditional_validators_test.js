var user, User;

module('Validate with conditional validations', {
  setup: function() {
    User = Ember.Object.extend(Ember.Validations.Mixin);
  }
});

asyncTest('if with function', function() {
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
  user = User.create();

  Ember.run(function(){
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), undefined);
      user.validations.firstName.presence['if'] = function(model) { return true; };
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
  user = User.create();

  user.set('canValidate', false);

  Ember.run(function(){
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), undefined);
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
  user = User.create();

  Ember.run(function(){
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), undefined);
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
  user = User.create();

  Ember.run(function(){
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), undefined);
      user.validations.firstName.presence.unless  = function(model) { return false; };
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
  user = User.create();

  Ember.run(function(){
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), undefined);
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
  user = User.create();

  Ember.run(function(){
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), undefined);
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
