import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

const { get, isPresent, set } = Ember;

export default Base.extend({
  init() {
    this._super(...arguments);
    /*jshint expr:true*/
    if (this.options === true) {
      set(this, 'options', {});
    }

    if (this.options.message === undefined) {
      set(this, 'options.message', Messages.render('present', this.options));
    }
  },
  call() {
    if (isPresent(get(this.model, this.property))) {
      this.errors.pushObject(this.options.message);
    }
  }
});
