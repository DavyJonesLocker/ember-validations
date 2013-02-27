Ember.Validations.Errors = Ember.Object.extend({
  add: function(property, value) {
    this.set(property, (this.get(property) || []).concat(value));
  },
  clear: function() {
    var keys = Object.keys(this);
    for(var i = 0; i < keys.length; i++) {
      this.set(keys[i], undefined);
      delete this[keys[i]];
    }
  }
});
