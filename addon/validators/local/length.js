import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

const { get, isEmpty, set } = Ember;

export default Base.extend({
  init() {
    let index;
    let key;

    this._super(...arguments);
    /*jshint expr:true*/
    if (typeof this.options === 'number') {
      set(this, 'options', { 'is': this.options });
    }

    if (this.options.messages === undefined) {
      set(this, 'options.messages', {});
    }

    for (index = 0; index < this.messageKeys().length; index++) {
      key = this.messageKeys()[index];
      if (this.options[key] !== undefined && this.options[key].constructor === String) {
        this.model.addObserver(this.options[key], this, this._validate);
      }
    }

    this.options.tokenizer = this.options.tokenizer || ((value) => value.toString().split(''));
  },

  CHECKS: {
    'is': '==',
    'minimum': '>=',
    'maximum': '<='
  },

  MESSAGES: {
    'is': 'wrongLength',
    'minimum': 'tooShort',
    'maximum': 'tooLong'
  },

  getValue(key) {
    if (this.options[key].constructor === String) {
      return get(this.model, this.options[key]) || 0;
    } else {
      return this.options[key];
    }
  },

  messageKeys() {
    return Object.keys(this.MESSAGES);
  },

  checkKeys() {
    return Object.keys(this.CHECKS);
  },

  renderMessageFor(key) {
    let options = { count: this.getValue(key) };
    let _key;

    for (_key in this.options) {
      options[_key] = this.options[_key];
    }

    return this.options.messages[this.MESSAGES[key]] || Messages.render(this.MESSAGES[key], options);
  },

  renderBlankMessage() {
    if (this.options.is) {
      return this.renderMessageFor('is');
    } else if (this.options.minimum) {
      return this.renderMessageFor('minimum');
    }
  },

  call() {
    let key;
    let comparisonResult;

    if (isEmpty(get(this.model, this.property))) {
      if (this.options.allowBlank === undefined && (this.options.is || this.options.minimum)) {
        this.errors.pushObject(this.renderBlankMessage());
      }
    } else {
      for (key in this.CHECKS) {
        if (!this.options[key]) {
          continue;
        }

        comparisonResult = this.compare(
          this.options.tokenizer(get(this.model, this.property)).length,
          this.getValue(key),
          this.CHECKS[key]
        );
        if (!comparisonResult) {
          this.errors.pushObject(this.renderMessageFor(key));
        }
      }
    }
  }
});
