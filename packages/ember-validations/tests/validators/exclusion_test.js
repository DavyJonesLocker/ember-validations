var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Exclusion Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    model = Model.create();
  }
});

test('when value is not in the list', function() {
  model.set('attribute', 4);
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
  validator.call(pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when value is in the list', function() {
  model.set('attribute', 1);
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
  validator.call(fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3], allowBlank: true };
  validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
  validator.call(pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
  validator.call(fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when value is not in the range', function() {
  model.set('attribute', 4);
  options = { 'message': 'failed validation', 'range': [1, 3] };
  validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
  validator.call(pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when value is in the range', function() {
  model.set('attribute', 1);
  options = { 'message': 'failed validation', 'range': [1, 3] };
  validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
  validator.call(fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when options is array', function() {
  options = [1, 2, 3];
  validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
  validator.call(fail, pass);
  deepEqual(model.errors.get('attribute'), ['is reserved']);
});

test('when no message is passed', function() {
  options = { in: [1, 2, 3] };
  validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
  validator.call(fail, pass);
  deepEqual(model.errors.get('attribute'), ['is reserved']);
});
