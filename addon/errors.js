import Ember from 'ember';

export default Ember.Object.extend({
  unknownProperty: function(property) {
    this.set(property, Ember.makeArray());
    return this.get(property);
  }
});
