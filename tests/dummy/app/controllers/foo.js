import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations.Mixin, {
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
