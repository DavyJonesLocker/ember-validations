import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

export default Base.extend({
  init: function() {
    this.originalProperty = this.property;
    this.property = this.property + 'Confirmation';
    this._super();
    this.dependentValidationKeys.pushObject(this.originalProperty);
    /*jshint expr:true*/
    if (this.options === true) {
      this.set('options', { attribute: this.originalProperty });
      this.set('options', { message: Messages.render('confirmation', this.options) });
    }
  },
  call: function() {
    if (this.model.get(this.originalProperty) !== this.model.get(this.property)) {
      this.errors.pushObject(this.options.message);
    }
  }
});
