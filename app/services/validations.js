import Ember from 'ember';

var set = Ember.set;

export default Ember.Object.extend({
  init: function() {
    set(this, 'cache', {});
  }
});
