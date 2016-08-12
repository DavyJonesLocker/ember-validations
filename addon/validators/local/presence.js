import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

const { get, isBlank } = Ember;

export default Base.extend({
  init() {
    this._super(...arguments);
    /*jshint expr:true*/
    if (this.options === true) {
      this.options = {};
    }

    if (this.options.message === undefined) {
      this.options.message = Messages.render('blank', this.options);
    }
  },
  call() {
    if (isBlank(get(this.model, this.property))) {
      this.errors.pushObject(this.options.message);
    }
  }
});
