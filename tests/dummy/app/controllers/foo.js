import Ember from 'ember';
import EmberValidations from 'ember-validations';

const { Controller } = Ember;

export default Controller.extend(EmberValidations, {
  validations: {
    foo: {
      presence: true
    },

    bar: {
      presence: true,
      length: { minimum: 5 }
    },

    baz: {
      presence: {
        if: 'isBaz'
      }
    }
  }
});
