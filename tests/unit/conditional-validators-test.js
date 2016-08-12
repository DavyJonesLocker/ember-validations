import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Mixin from 'ember-validations/mixin';

var user, User, promise;
var get = Ember.get;
var set = Ember.set;
var run = Ember.run;


moduleFor('object:user', 'Conditional Validations', {
  integration: true,

  beforeEach() {
    User = Ember.Object.extend(Mixin);
    this.registry.register('object:user', User);
  }
});

test('if with function', function(assert) {
  assert.expect(4);

  User.reopen({
    validations: {
      firstName: {
        presence: {
          if: function() {
            return false;
          }
        }
      }
    }
  });

  run(() => {
    user = this.subject();

    promise = user.validate().then(() => {
      assert.ok(Ember.isEmpty(get(user.errors, 'firstName')));

      var validator = get(user.validators, 'firstObject');

      validator.conditionals['if'] = function(model, property) {
        assert.equal(user, model, "the conditional validator is passed the model being validated");
        assert.equal(property, 'firstName', "the conditional validator is passed the name of the property being validated");
        return true;
      };

      user.validate().catch(() => {
        assert.deepEqual(get(user.errors, 'firstName'), ["can't be blank"]);
      });
    });
  });

  return promise;
});

test('if with property reference', function(assert) {
  User.reopen({
    validations: {
      firstName: {
        presence: {
          if: 'canValidate'
        }
      }
    }
  });


  run(() => {
    user = this.subject();

    set(user, 'canValidate', false);

    promise = user.validate().then(() => {
      assert.ok(Ember.isEmpty(get(user.errors, 'firstName')));

      set(user, 'canValidate', true);

      user.validate().catch(() => {
        assert.deepEqual(get(user.errors, 'firstName'), ["can't be blank"]);
        set(user, 'canValidate', false);
        assert.deepEqual(get(user.errors, 'firstName'), []);
      });
    });
  });

  return promise;
});

test('if with function reference', function(assert) {
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

  run(() => {
    user = this.subject();
    promise = user.validate().then(function(){
      assert.ok(Ember.isEmpty(get(user.errors, 'firstName')));
      set(user, 'canValidate', true);
      user.canValidate = function() {
        return true;
      };
      user.validate().then(null, function(){
        assert.deepEqual(get(user.errors, 'firstName'), ["can't be blank"]);
      });
    });
  });

  return promise;
});

test('unless with function', function(assert) {
  assert.expect(4);
  User.reopen({
    validations: {
      firstName: {
        presence: {
          unless: function() {
            return true;
          }
        }
      }
    }
  });

  run(() => {
    user = this.subject();
    promise = user.validate().then(function(){
      assert.ok(Ember.isEmpty(get(user.errors, 'firstName')));
      var validator = get(user.validators, 'firstObject');
      validator.conditionals['unless'] = function(model, property) {
        assert.equal(user, model, "the conditional validator is passed the model being validated");
        assert.equal(property, 'firstName', "the conditional validator is passed the name of the property being validated");
        return false;
      };
      user.validate().then(null, function(){
        assert.deepEqual(get(user.errors, 'firstName'), ["can't be blank"]);
      });
    });
  });

  return promise;
});

test('unless with property reference', function(assert) {
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

  run(() => {
    user = this.subject();
    promise = user.validate().then(function(){
      assert.ok(Ember.isEmpty(get(user.errors, 'firstName')));
      set(user, 'canValidate', false);
      user.validate().then(null, function(){
        assert.deepEqual(get(user.errors, 'firstName'), ["can't be blank"]);
        set(user, 'canValidate', true);
        assert.deepEqual(get(user.errors, 'firstName'), []);
      });
    });
  });

  return promise;
});

test('unless with function reference', function(assert) {
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

  run(() => {
    user = this.subject();
    promise = user.validate().then(function(){
      assert.ok(Ember.isEmpty(get(user.errors, 'firstName')));
      set(user, 'canValidate', true);
      user.canValidate = function() {
        return false;
      };
      user.validate().then(null, function(){
        assert.deepEqual(get(user.errors, 'firstName'), ["can't be blank"]);
      });
    });
  });

  return promise;
});
