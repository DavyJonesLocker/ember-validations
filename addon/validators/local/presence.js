import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

var get = Ember.get;

export default Base.extend({
  init: function() {
    this._super();
    /*jshint expr:true*/
    if (this.options === true) {
      this.options = {};
    }

    if (this.options.message === undefined) {
      this.options.message = Messages.render('blank', this.options);
    }
  },
  call: function() {
    if (Ember.isBlank(get(this.model, this.property)) || typeof get(this.model, this.property) === 'object' && Ember.isEmpty(get(this.model, this.property).get('content'))) {
      this.errors.pushObject(this.options.message);
    }
  }
});
