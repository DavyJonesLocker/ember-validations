Ember.Validations.Utilities = {
  isBlank: function(value) {
    return value !== 0 && (!value || /^\s*$/.test(''+value));
  }
};
