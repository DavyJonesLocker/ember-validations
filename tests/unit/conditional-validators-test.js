import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Mixin from 'ember-validations/mixin';

let user;
let User;
let promise;

const {
  Object: EmberObject,
  get,
  isEmpty,
  run,
  set
} = Ember;

moduleFor('object:user', 'Conditional Validations', {
  integration: true,

  beforeEach() {
    User = EmberObject.extend(Mixin);
    this.registry.register('object:user', User);
  }
});

test('if with function', function(assert) {
  assert.expect(4);

  User.reopen({
    validations: {
      firstName: {
        presence: {
          if() {
            return false;
          }
        }
      }
    }
  });

  run(() => {
    user = this.subject();

    promise = user.validate().then(() => {
      assert.ok(isEmpty(get(user.errors, 'firstName')));

      let validator = get(user.validators, 'firstObject');

      validator.conditionals.if = function(model, property) {
        assert.equal(user, model, 'the conditional validator is passed the model being validated');
        assert.equal(property, 'firstName', 'the conditional validator is passed the name of the property being validated');
        return true;
      };

      user.validate().catch(() => {
        assert.deepEqual(get(user.errors, 'firstName'), ['can\'t be blank']);
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
      assert.ok(isEmpty(get(user.errors, 'firstName')));

      set(user, 'canValidate', true);

      user.validate().catch(() => {
        assert.deepEqual(get(user.errors, 'firstName'), ['can\'t be blank']);
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

    canValidate() {
      return false;
    }
  });

  run(() => {
    user = this.subject();
    promise = user.validate().then(function() {
      assert.ok(isEmpty(get(user.errors, 'firstName')));
      set(user, 'canValidate', true);

      user.canValidate = function() {
        return true;
      };

      user.validate().catch(function() {
        assert.deepEqual(get(user.errors, 'firstName'), ['can\'t be blank']);
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
          unless() {
            return true;
          }
        }
      }
    }
  });

  run(() => {
    user = this.subject();
    promise = user.validate().then(function() {
      assert.ok(isEmpty(get(user.errors, 'firstName')));
      let validator = get(user.validators, 'firstObject');
      validator.conditionals.unless = function(model, property) {
        assert.equal(user, model, 'the conditional validator is passed the model being validated');
        assert.equal(property, 'firstName', 'the conditional validator is passed the name of the property being validated');
        return false;
      };
      user.validate().catch(function() {
        assert.deepEqual(get(user.errors, 'firstName'), ['can\'t be blank']);
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
    promise = user.validate().then(function() {
      assert.ok(isEmpty(get(user.errors, 'firstName')));
      set(user, 'canValidate', false);
      user.validate().catch(function() {
        assert.deepEqual(get(user.errors, 'firstName'), ['can\'t be blank']);
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
    canValidate() {
      return true;
    }
  });

  run(() => {
    user = this.subject();
    promise = user.validate().then(function() {
      assert.ok(isEmpty(get(user.errors, 'firstName')));
      set(user, 'canValidate', true);
      user.canValidate = function() {
        return false;
      };
      user.validate().catch(function() {
        assert.deepEqual(get(user.errors, 'firstName'), ['can\'t be blank']);
      });
    });
  });

  return promise;
});
