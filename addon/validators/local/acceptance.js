import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

const { get, set } = Ember;

export default Base.extend({
  init() {
    this._super(...arguments);
    /*jshint expr:true*/
    if (this.options === true) {
      set(this, 'options', {});
    }

    if (this.options.message === undefined) {
      set(this, 'options.message', Messages.render('accepted', this.options));
    }
  },

  call() {
    if (this.options.accept) {
      if (get(this.model, this.property) !== this.options.accept) {
        this.errors.pushObject(this.options.message);
      }
    } else if (get(this.model, this.property) !== '1' && get(this.model, this.property) !== 1 && get(this.model, this.property) !== true) {
      this.errors.pushObject(this.options.message);
    }
  }
});
