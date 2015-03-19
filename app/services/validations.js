import Ember from 'ember';

var set = Ember.set;
var get = Ember.get;

export default Ember.Object.extend({
  init: function() {
    set(this, 'cache', {});
    
    // adding message service
    var container = get(this, 'container');
    var messages = container.lookup("service:validations/messages");
    if (messages === undefined) {
      // there is no specific message service, load the default one
      messages = container.lookup("ember-validations@service:validations/messages");
    }
    set(this, 'messages', messages)
  }
});
