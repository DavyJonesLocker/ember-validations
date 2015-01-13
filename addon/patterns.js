import Ember from 'ember';

export default Ember.Namespace.create({
  number: /^(-|\+)?\d+(?:\.\d*)?$/,
  number_with_digit_group_separators: /^(-|\+)?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/,
  blank: /^\s*$/
});
