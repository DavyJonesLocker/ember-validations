import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

var get = Ember.get;
var set = Ember.set;

export default Base.extend({
  init: function() {
    this.originalProperty = this.property;
    this.property = this.property + 'Confirmation';
    this._super();
    this.dependentValidationKeys.pushObject(this.originalProperty);
    /*jshint expr:true*/
    if (this.options === true) {
      set(this, 'options', { attribute: this.originalProperty });
      set(this, 'options', { message: Messages.render('confirmation', this.options) });
    }
  },
  call: function() {
    var original = get(this.model, this.originalProperty);
    var confirmation = get(this.model, this.property);

    if(!Ember.isEmpty(original) || !Ember.isEmpty(confirmation)) {
      if (original !== confirmation) {
        this.errors.pushObject(this.options.message);
      }
    }
  }
});
