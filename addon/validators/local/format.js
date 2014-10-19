import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

var get = Ember.get;
var set = Ember.set;

export default Base.extend({
  init: function() {
    this._super();
    if (this.options.constructor === RegExp) {
      set(this, 'options', { 'with': this.options });
    }

    if (this.options.message === undefined) {
      set(this, 'options.message',  Messages.render('invalid', this.options));
    }
   },
   call: function() {
    if (Ember.isEmpty(get(this.model, this.property))) {
      if (this.options.allowBlank === undefined) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.options['with'] && !this.options['with'].test(get(this.model, this.property))) {
      this.errors.pushObject(this.options.message);
    } else if (this.options.without && this.options.without.test(get(this.model, this.property))) {
      this.errors.pushObject(this.options.message);
    }
  }
});
