var App;

module('Bootstrap test', {
  setup: function() {
    App = Ember.Application.create();
    App.User = Ember.Object.extend(Ember.Validations.Mixin);
  }
});

test('Bootstraping an object will find by name, camelcase properly, and apply validations', function() {
  var validations = { 'user': { 'first_name': { 'presence': true } } };
  App.bootstrapValidations(validations);
  var user = App.User.create();
  deepEqual(user.validations, {'firstName': { 'presence': true } });
});

test('Bootstraping will not override existing validations', function() {
  App.User.reopen({
    validations: {
      age: {
        numericality: true
      }
    }
  });
  var validations = { 'user': { 'first_name': { 'presence': true } } };
  App.bootstrapValidations(validations);
  var user = App.User.create();
  deepEqual(user.validations, {'firstName': { 'presence': true }, 'age': { 'numericality': true } });
});
