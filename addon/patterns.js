import Ember from 'ember';

export default Ember.Namespace.create({
  blank: /^\s*$/,
  escape: function(str) {
    // http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
});
