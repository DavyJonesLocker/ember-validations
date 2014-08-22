var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Custom Validator', {
  setup: function() {
    Model =  Ember.Object.extend(validator = Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when a custom validator passes', function() {
  options = {
    myValidator: function(object) {
      return object.get('attribute') === 21;
    }
  };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Custom.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 21);
  });
  deepEqual(validator.errors, []);
});

test('when a custom validator fails', function() {
  options = {
    myValidator: function(object) {
      return object.get('attribute') === 21;
    }
  };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Custom.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 42);
  });
  deepEqual(validator.errors, ['is invalid']);
});

