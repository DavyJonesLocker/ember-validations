import Ember from 'ember';
import Base from 'ember-validations/validators/base';

var get = Ember.get;
var set = Ember.set;

export default Base.extend({
  init: function() {
    this._super();
    /*jshint expr:true*/
    if (this.options === true) {
      set(this, 'options', {});
    }

    if (this.options.message === undefined) {
      set(this, 'options.message', this.getMessage('present', this.options));
    }
  },
  call: function() {
    if (!Ember.isEmpty(get(this.model, this.property))) {
      this.errors.pushObject(this.options.message);
    }
  }
});
