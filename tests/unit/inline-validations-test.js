import Ember from 'ember';
import { module, test } from 'qunit';
import EmberValidations, { validator } from 'ember-validations';
import buildContainer from '../helpers/build-container';
import Base from 'ember-validations/validators/base';

var user, User, promise;
var get = Ember.get;
var set = Ember.set;
var run = Ember.run;

module('inline validations', {
  setup: function() {
    User = Ember.Object.extend(EmberValidations, {
      container: buildContainer()
    });
  }
});

test("mixed validation syntax", function(assert) {
  run(function() {
    user = User.create({
      validations: {
        name: {
          inline: validator(function() {
            return 'it failed';
          })
        }
      }
    });
  });

  assert.deepEqual(['it failed'], get(user, 'errors.name'));
});

test("concise validation syntax", function(assert) {
  run(function() {
    user = User.create({
      validations: {
        name: validator(function() {
          return 'it failed';
        })
      }
    });
  });

  assert.deepEqual(['it failed'], get(user, 'errors.name'));
});
