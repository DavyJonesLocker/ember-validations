import Ember from 'ember';

const { A } = Ember;

const EmberObject = Ember.Object;
const get = Ember.get;
const set = Ember.set;

export default EmberObject.extend({
  unknownProperty(property) {
    set(this, property, A());
    return get(this, property);
  }
});
