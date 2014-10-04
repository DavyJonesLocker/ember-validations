import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

export default Base.extend({
  init: function() {
    this._super();
    /*jshint expr:true*/
    if (this.options === true) {
      this.set('options', {});
    }

    if (this.options.message === undefined) {
      this.set('options.message', Messages.render('accepted', this.options));
    }
  },
  call: function() {
    if (this.options.accept) {
      if (this.model.get(this.property) !== this.options.accept) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.model.get(this.property) !== '1' && this.model.get(this.property) !== 1 && this.model.get(this.property) !== true) {
      this.errors.pushObject(this.options.message);
    }
  }
});
