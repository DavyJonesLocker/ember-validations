import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

const { isEmpty } = Ember;

const get = Ember.get;
const set = Ember.set;

export default Base.extend({
  init() {
    this.originalProperty = this.property;
    this.property = `${this.property}Confirmation`;
    this._super();
    this.dependentValidationKeys.pushObject(this.originalProperty);
    /*jshint expr:true*/
    if (this.options === true) {
      set(this, 'options', { attribute: this.originalProperty });
      set(this, 'options', { message: Messages.render('confirmation', this.options) });
    }
  },

  call() {
    const original = get(this.model, this.originalProperty);
    const confirmation = get(this.model, this.property);

    if (!isEmpty(original) || !isEmpty(confirmation)) {
      if (original !== confirmation) {
        this.errors.pushObject(this.options.message);
      }
    }
  }
});
