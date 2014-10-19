import Mixin from 'ember-validations/mixin';

export default {
  Mixin: Mixin,
  validator: function(callback) {
    return { callback: callback };
  }
};
