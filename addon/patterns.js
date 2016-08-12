import Ember from 'ember';

const { Namespace } = Ember;

export default Namespace.create({
  numericality: /^(-|\+)?(?:(?:(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?)|(?:\.\d+))$/,
  blank: /^\s*$/
});
