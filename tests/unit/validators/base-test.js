import Ember from 'ember';
import { module, test } from 'qunit';
import Base from 'ember-validations/validators/base';

var model, Model, options, CustomValidator, validator;
var get = Ember.get;
var run = Ember.run;

module('Base Validator', {
  setup: function() {
    Model = Ember.Object.extend({
      dependentValidationKeys: {}
    });
    CustomValidator = Base.extend({
      init: function() {
        this._super();
        this.dependentValidationKeys.pushObject('otherAttribute');
      },
      call: function() {}
    });
    run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function(assert) {
  run(function() {
    validator = CustomValidator.create({model: model, property: 'attribute'});
  });
  assert.equal(get(validator, 'isValid'), true);
});

test('validator has isInvalid flag', function(assert) {
  run(function() {
    validator = CustomValidator.create({model: model, property: 'attribute'});
  });
  assert.equal(get(validator, 'isInvalid'), false);
});

test('generates dependentValidationKeys on the model', function(assert) {
  run(function() {
    validator = CustomValidator.create({model: model, property: 'attribute'});
  });
  assert.deepEqual(get(model, 'dependentValidationKeys'), {attribute: ['otherAttribute']});
});

test('inactive validators should be considered valid', function(assert) {
  var canValidate = true;
  run(function() {
    validator = CustomValidator.createWithMixins({
      model: model,
      property: 'attribute',
      canValidate: function() {
        return canValidate;
      },
      call: function() {
        this.errors.pushObject("nope");
      }
    });
  });
  assert.equal(get(validator, 'isValid'), false);
  canValidate = false;
  run(validator, 'validate');
  assert.equal(get(validator, 'isValid'), true);
});

test('dependent properties can be promises', function(assert) {
  assert.expect(1);

  model.reopen({
    boop: Ember.computed(function() {
      return new Ember.RSVP.Promise((resolve) => {
        Ember.run.later(function() {
          resolve('somevalue');
        }, 250);
      });
    })
  });

  validator = CustomValidator.createWithMixins({
    model: model,
    property: 'boop',
    call(value) {
      if (value !== 'somevalue') {
        this.errors.pushObject('oh no you don\'t');
      }
    }
  });

  return validator.validate()
                  .then(() => {
                    assert.deepEqual(validator.errors, []);
                  });
});

test('promised property validations errors add to the errors array', function(assert) {
  assert.expect(1);

  model.reopen({
    boop: Ember.computed(function() {
      return new Ember.RSVP.Promise((resolve) => {
        Ember.run.later(function() {
          resolve('somevalue');
        }, 250);
      });
    })
  });

  validator = CustomValidator.createWithMixins({
    model: model,
    property: 'boop',
    call(value) {
      if (value === 'somevalue') {
        this.errors.pushObject('oh no you don\'t');
      }
    }
  });

  return validator.validate()
                  .catch(() => {
                    assert.deepEqual(validator.errors, ['oh no you don\'t']);
                  });
});

test('rejected properties call a handlePropertyRetrievalError method', function(assert) {
  // _validate gets called on init, as well as on validate() so we're expecting
  // two assertions
  assert.expect(2);

  model.reopen({
    boop: Ember.computed(function() {
      return new Ember.RSVP.Promise((resolve, reject) => {
        Ember.run.later(function() {
          reject('well shoot');
        }, 250);
      });
    })
  });

  validator = CustomValidator.create({
    model: model,
    property: 'boop',
    handlePropertyRetrievalError(error) {
      assert.equal(error, 'well shoot');
    }
  });

  return validator.validate().catch(() => {});
});

test('the default handlePropertyRetrievalError pushes the error into this.errors', function(assert) {
  model.reopen({
    boop: Ember.computed(function() {
      return new Ember.RSVP.Promise((resolve, reject) => {
        Ember.run.later(function() {
          reject('well shoot');
        }, 250);
      });
    })
  });

  validator = CustomValidator.create({
    model: model,
    property: 'boop'
  });

  // _validate gets called on init, as well as on validate() so we're expecting
  // two entries
  return validator.validate().catch(() => {
    assert.deepEqual(validator.errors, ['well shoot', 'well shoot']);
  });
});

test('dependent properties can become promises', function(assert) {
  assert.expect(2);

  model.reopen({
    boop: Ember.computed(function() {
      return new Ember.RSVP.Promise((resolve) => {
        Ember.run.later(function() {
          resolve(true);
        }, 250);
      });
    })
  });

  validator = CustomValidator.createWithMixins({
    model: model,
    property: 'boop',
    call(value) {
      if (!value) {
        this.errors.pushObject('nope');
      }
    }
  });

  return validator.validate()
                  .then(function() {
                    assert.deepEqual(validator.errors, []);
                  }).then(function() {
                    validator.model.set('boop', Ember.computed(function() {
                      return new Ember.RSVP.Promise((resolve) => {
                        Ember.run.later(function() {
                          resolve(false);
                        }, 250);
                      });
                    }));

                    // add a small delay so the promise has had time to resolve
                    // I don't want to call validate() and force a validation
                    return new Ember.RSVP.Promise((resolve) => {
                      Ember.run.later(function() {
                        assert.deepEqual(validator.errors, ['nope']);
                        resolve();
                      }, 500);
                    });
                  });

});
