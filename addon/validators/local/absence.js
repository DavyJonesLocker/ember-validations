import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

const { isEmpty } = Ember;

const get = Ember.get;
const set = Ember.set;

export default Base.extend({
  init() {
    this._super();
    /*jshint expr:true*/
    if (this.options === true) {
      set(this, 'options', {});
    }

    if (this.options.message === undefined) {
      set(this, 'options.message', Messages.render('present', this.options));
    }
  },

  call() {
    if (!isEmpty(get(this.model, this.property))) {
      this.errors.pushObject(this.options.message);
    }
  }
});
