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
    model = Model.create();
  }
});

test('when value is not empty', function() {
  model.set('attribute', 'not empty');
  options = { message: 'failed validation' };
  validator = Ember.Validations.validators.local.Absence.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when value is empty', function() {
  options = { message: 'failed validation' };
  validator = Ember.Validations.validators.local.Absence.create({property: 'attribute', options: options});
  validator.call(model, pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when options is true', function() {
  options = true;
  model.set('attribute', 'not empty');
  validator = Ember.Validations.validators.local.Absence.create({property: 'attribute', options: options});
  validator.call(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ["must be blank"]);
});
