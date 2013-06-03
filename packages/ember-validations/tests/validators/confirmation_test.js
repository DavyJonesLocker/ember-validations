var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Confirmation Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    model = Model.create();
  }
});

test('when values match', function() {
  model.set('attribute', 'test');
  model.set('attributeConfirmation', 'test');
  options = { message: 'failed validation' };
  validator = Ember.Validations.validators.local.Confirmation.create({property: 'attribute', options: options});
  validator.validate(model, pass, fail);
  equal(model.errors.get('attribute_confirmation'), undefined);
  equal(model.errors.get('attribute'), undefined);
});

test('when values do not match', function() {
  model.set('attribute', 'test');
  options = { message: 'failed validation' };
  validator = Ember.Validations.validators.local.Confirmation.create({property: 'attribute', options: options});
  validator.validate(model, fail, pass);
  deepEqual(model.errors.get('attributeConfirmation'), ['failed validation']);
  equal(model.errors.get('attribute'), undefined);
});

test('when options is true', function() {
  model.set('attribute', 'test');
  options = true;
  validator = Ember.Validations.validators.local.Confirmation.create({property: 'attribute', options: options});
  validator.validate(model, fail, pass);
  deepEqual(model.errors.get('attributeConfirmation'), ["doesn't match attribute"]);
  equal(model.errors.get('attribute'), undefined);
});
