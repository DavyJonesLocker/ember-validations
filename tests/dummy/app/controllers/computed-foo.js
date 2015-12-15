import Ember from 'ember';
import EmberValidations from 'ember-validations';

const { computed } = Ember;

export default Ember.Controller.extend(EmberValidations, {
  validations: computed(function() {
    return {
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
    };
  })
});
