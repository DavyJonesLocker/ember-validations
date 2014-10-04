import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

export default Base.extend({
  init: function() {
    this._super();
    if (this.options.constructor === Array) {
      this.set('options', { 'in': this.options });
    }

    if (this.options.message === undefined) {
      this.set('options.message', Messages.render('inclusion', this.options));
    }
  },
  call: function() {
    var lower, upper;
    if (Ember.isEmpty(this.model.get(this.property))) {
      if (this.options.allowBlank === undefined) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.options['in']) {
      if (Ember.$.inArray(this.model.get(this.property), this.options['in']) === -1) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.options.range) {
      lower = this.options.range[0];
      upper = this.options.range[1];

      if (this.model.get(this.property) < lower || this.model.get(this.property) > upper) {
        this.errors.pushObject(this.options.message);
      }
    }
  }
});
