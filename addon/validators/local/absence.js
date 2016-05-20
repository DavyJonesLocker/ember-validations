import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

var set = Ember.set;

export default Base.extend({
  init: function() {
    this._super();
    /*jshint expr:true*/
    if (this.options === true) {
      set(this, 'options', {});
    }

    if (this.options.message === undefined) {
      set(this, 'options.message', Messages.render('present', this.options));
    }
  },
  call(value) {
    if (!Ember.isEmpty(value)) {
      this.errors.pushObject(this.options.message);
    }
  }
});
