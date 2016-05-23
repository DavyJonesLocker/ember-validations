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
      set(this, 'options.message', this.getMessage('accepted', this.options));
    }
  },
  call: function() {
    if (this.options.accept) {
      if (get(this.model, this.property) !== this.options.accept) {
        this.errors.pushObject(this.options.message);
      }
    } else if (get(this.model, this.property) !== '1' && get(this.model, this.property) !== 1 && get(this.model, this.property) !== true) {
      this.errors.pushObject(this.options.message);
    }
  }
});
