import Ember from 'ember';

export default Ember.Object.extend({
  unknownProperty: function(property) {
    this.set(property, Ember.A());
    return this.get(property);
  }
});
