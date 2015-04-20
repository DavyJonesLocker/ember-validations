import Ember from 'ember';
import { module, test } from 'qunit';
import EmberValidations, { validator } from 'ember-validations';
import buildContainer from '../helpers/build-container';
import Base from 'ember-validations/validators/base';

var user, User, promise;
var get = Ember.get;
var set = Ember.set;
var run = Ember.run;

/*globals define, registry, requirejs*/

requirejs.rollback = function() {
  for(var entry in this.backupEntries) {
    this.entries[entry] = this.backupEntries[entry];
  }
};

requirejs.backup = function() {
  this.backupEntries = {};

  for(var entry in this.entries) {
    this.backupEntries[entry] = this.entries[entry];
  }
};

module('validator class lookup order', {
  setup: function() {
    requirejs.backup();
    requirejs.clear();
    requirejs.rollback();

    User = Ember.Object.extend(EmberValidations, {
      container: buildContainer()
    });
  },
  teardown: function() {
    requirejs.clear();
    requirejs.rollback();
  }
});

test('should lookup in project namespace first', function(assert) {
  var dummyValidatorCalled = false;
  var nativeValidatorCalled = false;

  define('ember-validations/validators/local/presence', [], function() {
    nativeValidatorCalled = true;

    return Base.extend({
      call: Ember.K
    });
  });

  define('dummy/validators/local/presence', [], function() {
    dummyValidatorCalled = true;

    return Base.extend({
      call: Ember.K
    });
  });

  run(function() {
    user = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  assert.ok(!nativeValidatorCalled, 'should not have preferred ember-validation\'s presence validator');
  assert.ok(dummyValidatorCalled, 'should have preferred my applications presence validator');
});

test('will lookup both local and remote validators of similar name', function(assert) {
  var localValidatorCalled = false;
  var remoteValidatorCalled = false;

  define('ember-validations/validators/local/uniqueness', [], function() {
    localValidatorCalled = true;

    return Base.extend({
      call: Ember.K
    });
  });

  define('ember-validations/validators/remote/uniqueness', [], function() {
    remoteValidatorCalled = true;

    return Base.extend({
      call: Ember.K
    });
  });

  run(function() {
    user = User.create({
      validations: {
        name: {
          uniqueness: true
        }
      }
    });
  });

  assert.ok(localValidatorCalled, 'should call local uniqueness validator');
  assert.ok(remoteValidatorCalled, 'should call remote uniqueness validator');
});

test('should prefer lookup in just "validators" before "native"', function(assert) {
  var dummyValidatorCalled = false;
  var nativeValidatorCalled = false;

  define('ember-validations/validators/local/presence', [], function() {
    nativeValidatorCalled = true;

    return Base.extend({
      call: Ember.K
    });
  });

  define('dummy/validators/presence', [], function() {
    dummyValidatorCalled = true;

    return Base.extend({
      call: Ember.K
    });
  });

  run(function() {
    user = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  assert.ok(!nativeValidatorCalled, 'should not have preferred ember-validation\'s presence validator');
  assert.ok(dummyValidatorCalled, 'should have preferred my applications presence validator');
});

test('should store validators in cache for faster lookup', function(assert) {
  var validatorResolvedCount = 0;

  var container = buildContainer();

  var oldLookupFactory = container.lookupFactory;

  container.lookupFactory = function(fullName) {
    validatorResolvedCount += 1;
    return oldLookupFactory.call(container, fullName);
  };

  var user2;

  run(function() {
    user = User.create({
      container: container,
      validations: {
        name: {
          presence: true
        }
      }
    });

    validatorResolvedCount = 0;

    user2 = User.create({
      container: container,
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  container.lookupFactory = oldLookupFactory;

  assert.ok(!get(user, 'isValid'));
  assert.ok(!get(user2, 'isValid'));
  assert.equal(0, validatorResolvedCount);
});
