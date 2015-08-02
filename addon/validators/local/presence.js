import Ember from 'ember';
import Base from 'ember-validations/validators/base';

var get = Ember.get;

export default Base.extend({
  init: function() {
    this._super();
    /*jshint expr:true*/
    if (this.options === true) {
      this.options = {};
    }

    if (this.options.message === undefined) {
      this.options.message = this.getMessage('blank', this.options);
    }
  },
  call: function() {
    if (Ember.isBlank(get(this.model, this.property))) {
      this.errors.pushObject(this.options.message);
    }
  }
});
