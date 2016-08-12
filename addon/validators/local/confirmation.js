import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

const { get, isPresent, set } = Ember;

export default Base.extend({
  init() {
    this.originalProperty = this.property;
    this.property = `${this.property}Confirmation`;
    this._super(...arguments);
    this.dependentValidationKeys.pushObject(this.originalProperty);
    /*jshint expr:true*/
    if (this.options === true) {
      set(this, 'options', { attribute: this.originalProperty });
      set(this, 'options', { message: Messages.render('confirmation', this.options) });
    }
  },

  call() {
    let original = get(this.model, this.originalProperty);
    let confirmation = get(this.model, this.property);

    if (isPresent(original) || isPresent(confirmation)) {
      if (original !== confirmation) {
        this.errors.pushObject(this.options.message);
      }
    }
  }
});
