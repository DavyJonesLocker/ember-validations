import Ember from 'ember';

var set = Ember.set;

export default Ember.Service.extend({
  init: function() {
    set(this, 'cache', {});
  }
});
