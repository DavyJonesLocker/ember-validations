import Ember from 'ember';

export default Ember.Namespace.create({
  numericality: /^(-|\+)?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?(e[+-][0-9]+)?$/,
  blank: /^\s*$/
});
