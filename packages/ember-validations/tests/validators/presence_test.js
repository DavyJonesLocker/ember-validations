var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Presence Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    model = Model.create();
  }
});

test('when value is not empty', function() {
  model.set('attribute', 'not empty');
  options = { message: 'failed validation' };
  validator = Ember.Validations.validators.local.Presence.create({property: 'attribute', options: options});
  validator.validate(model, pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when value is empty', function() {
  options = { message: 'failed validation' };
  validator = Ember.Validations.validators.local.Presence.create({property: 'attribute', options: options});
  validator.validate(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when options is true', function() {
  options = true;
  validator = Ember.Validations.validators.local.Presence.create({property: 'attribute', options: options});
  validator.validate(model, fail, pass);
  deepEqual(model.errors.get('attribute'), ["can't be blank"]);
});
