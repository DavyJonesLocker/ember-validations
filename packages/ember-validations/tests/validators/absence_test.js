var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Absence Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function() {
  options = { message: 'failed validation' };
  Ember.run(function(){
    validator = Ember.Validations.validators.local.Absence.create({model: model, property: 'attribute', options: options});
  });
  deepEqual(validator.errors, []);
  Ember.run(function() {
    model.set('attribute', 'not empty');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when value is made empty', function() {
  model.set('attribute', 'not empty');
  options = { message: 'failed validation' };
  Ember.run(function(){
    validator = Ember.Validations.validators.local.Absence.create({model: model, property: 'attribute', options: options});
    model.set('attribute', undefined);
  });
  deepEqual(validator.errors, []);
});

test('when options is true', function() {
  options = true;
  Ember.run(function(){
    validator = Ember.Validations.validators.local.Absence.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'not empty');
  });
  deepEqual(validator.errors, ["must be blank"]);
});
