import Ember from 'ember';
import { module, test } from 'qunit';
import Mixin from 'ember-validations/mixin';
import buildContainer from '../helpers/build-container';

const {
  isEmpty,
  run
} = Ember;

const EmberObject = Ember.Object;
const get = Ember.get;
const set = Ember.set;

let user, User, promise;

module('Conditional validations', {
  beforeEach() {
    User = EmberObject.extend(Mixin, {
      container: buildContainer()
    });
  }
});

test('if with function', function(assert) {
  assert.expect(4);
  User.reopen({
    validations: {
      firstName: {
        presence: {
          if(model) {
            return false;
          }
        }
      }
    }
  });

  run(function() {
    user = User.create();
    promise = user.validate().then(function() {
      assert.ok(isEmpty(get(user.errors, 'firstName')));
      const validator = get(user.validators, 'firstObject');
      validator.conditionals.if = function(model, property) {
        assert.equal(user, model, 'the conditional validator is passed the model being validated');
        assert.equal(property, 'firstName', 'the conditional validator is passed the name of the property being validated');
        return true;
      };
      user.validate().then(null, function() {
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

  run(function() {
    user = User.create();
    set(user, 'canValidate', false);
    promise = user.validate().then(function() {
      assert.ok(isEmpty(get(user.errors, 'firstName')));
      set(user, 'canValidate', true);
      user.validate().then(null, function() {
        assert.deepEqual(get(user.errors, 'firstName'), ["can't be blank"]);
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
    canValidate() {
      return false;
    }
  });

  run(function() {
    user = User.create();
    promise = user.validate().then(function() {
      assert.ok(isEmpty(get(user.errors, 'firstName')));
      set(user, 'canValidate', true);
      user.canValidate = function() {
        return true;
      };
      user.validate().then(null, function() {
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
          unless(model) {
            return true;
          }
        }
      }
    }
  });

  run(function() {
    user = User.create();
    promise = user.validate().then(function() {
      assert.ok(isEmpty(get(user.errors, 'firstName')));
      const validator = get(user.validators, 'firstObject');
      validator.conditionals.unless = function(model, property) {
        assert.equal(user, model, 'the conditional validator is passed the model being validated');
        assert.equal(property, 'firstName', 'the conditional validator is passed the name of the property being validated');
        return false;
      };
      user.validate().then(null, function() {
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

  run(function() {
    user = User.create();
    promise = user.validate().then(function() {
      assert.ok(isEmpty(get(user.errors, 'firstName')));
      set(user, 'canValidate', false);
      user.validate().then(null, function() {
        assert.deepEqual(get(user.errors, 'firstName'), ["can't be blank"]);
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
    canValidate() {
      return true;
    }
  });

  run(function() {
    user = User.create();
    promise = user.validate().then(function() {
      assert.ok(isEmpty(get(user.errors, 'firstName')));
      set(user, 'canValidate', true);
      user.canValidate = function() {
        return false;
      };
      user.validate().then(null, function() {
        assert.deepEqual(get(user.errors, 'firstName'), ["can't be blank"]);
      });
    });
  });

  return promise;
});
