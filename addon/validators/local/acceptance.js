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
      set(this, 'options.message', Messages.render('accepted', this.options));
    }
  },
  call(value) {
    if (this.options.accept) {
      if (value !== this.options.accept) {
        this.errors.pushObject(this.options.message);
      }
    } else if (value !== '1' && value !== 1 && value !== true) {
      this.errors.pushObject(this.options.message);
    }
  }
});
