import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

var get = Ember.get;
var set = Ember.set;

export default Base.extend({
  init: function() {
    this._super();
    if (this.options.constructor === Array) {
      set(this, 'options', { 'in': this.options });
    }

    if (this.options.message === undefined) {
      set(this, 'options.message', Messages.render('exclusion', this.options));
    }
  },
  call: function() {
    /*jshint expr:true*/
    var lower, upper;

    if (Ember.isEmpty(get(this.model, this.property))) {
      if (this.options.allowBlank === undefined) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.options['in']) {
      if (Ember.$.inArray(get(this.model, this.property), this.options['in']) !== -1) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.options.range) {
      lower = this.options.range[0];
      upper = this.options.range[1];

      if (get(this.model, this.property) >= lower && get(this.model, this.property) <= upper) {
        this.errors.pushObject(this.options.message);
      }
    }
  }
});
