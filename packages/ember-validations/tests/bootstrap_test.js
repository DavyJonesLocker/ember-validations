var App, validations, user;

module('Bootstrap test', {
  setup: function() {
    Ember.run(function() {
      App = Ember.Application.create();
    });
    App.User = Ember.Object.extend(Ember.Validations.Mixin);
  },
  teardown: function() {
    Ember.run(function() {
      App.destroy();
    });
   }
});

test('Bootstraping an object will find by name, camelcase properly, and apply validations', function() {
  validations = { 'user': { 'first_name': { 'presence': true } } };
  Ember.run(function() {
    App.bootstrapValidations(validations);
    user = App.User.create();
  });
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
  validations = { 'user': { 'first_name': { 'presence': true } } };
  Ember.run(function() {
    App.bootstrapValidations(validations);
    user = App.User.create();
  });
  deepEqual(user.validations, {'firstName': { 'presence': true }, 'age': { 'numericality': true } });
});
