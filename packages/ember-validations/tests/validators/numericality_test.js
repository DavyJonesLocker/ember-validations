var model, Model, options;

module('Numericality Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    model = Model.create();
  }
});

test('when value is a number', function() {
  model.set('attribute', 123);
  options = { messages: { numericality: 'failed validation' } };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when value is a decimal number', function() {
  model.set('attribute', 123.456);
  options = { messages: { numericality: 'failed validation' } };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  equal(model.errors.get('attrbute'), undefined);
});

test('when value is not a number', function() {
  model.set('attribute', 'abc123');
  options = { messages: { numericality: 'failed validation' } };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when no value', function() {
  options = { messages: { numericality: 'failed validation' } };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when no value and allowing blank', function() {
  options = { messages: { numericality: 'failed validation' }, allowBlank: true };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when bad value and allowing blank', function() {
  model.set('attribute', 'abc123');
  options = { messages: { numericality: 'failed validation' }, allowBlank: true };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when only allowing integers and value is integer', function() {
  model.set('attribute', 123);
  options = { messages: { onlyInteger: 'failed validation', numericality: 'failed validation' }, onlyInteger: true };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when only allowing integers and value is not integer', function() {
  model.set('attribute', 123.456);
  options = { messages: { onlyInteger: 'failed integer validation', numericality: 'failed validation' }, onlyInteger: true };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed integer validation']);
});

test('when only allowing values greater than 10 and value is greater than 10', function() {
  model.set('attribute', 11);
  options = { messages: { greaterThan: 'failed validation', numericality: 'failed validation' }, greaterThan: 10 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when only allowing values greater than 10 and value is 10', function() {
  model.set('attribute', 10);
  options = { messages: { greaterThan: 'failed validation', numericality: 'failed validation' }, greaterThan: 10 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when only allowing values greater than or equal to 10 and value is 10', function() {
  model.set('attribute', 10);
  options = { messages: { greaterThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, greaterThanOrEqualTo: 10 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when only allowing values greater than or equal to 10 and value is 9', function() {
  model.set('attribute', 9);
  options = { messages: { greaterThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, greaterThanOrEqualTo: 10 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when only allowing values less than 10 and value is less than 10', function() {
  model.set('attribute', 9);
  options = { messages: { lessThan: 'failed validation', numericality: 'failed validation' }, lessThan: 10 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when only allowing values less than 10 and value is 10', function() {
  model.set('attribute', 10);
  options = { messages: { lessThan: 'failed validation', numericality: 'failed validation' }, lessThan: 10 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when only allowing values less than or equal to 10 and value is 10', function() {
  model.set('attribute', 10);
  options = { messages: { lessThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, lessThanOrEqualTo: 10 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when only allowing values less than or equal to 10 and value is 11', function() {
  model.set('attribute', 11);
  options = { messages: { lessThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, lessThanOrEqualTo: 10 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when only allowing values equal to 10 and value is 10', function() {
  model.set('attribute', 10);
  options = { messages: { equalTo: 'failed validation', numericality: 'failed validation' }, equalTo: 10 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when only allowing values equal to 10 and value is 11', function() {
  model.set('attribute', 11);
  options = { messages: { equalTo: 'failed equal validation', numericality: 'failed validation' }, equalTo: 10 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed equal validation']);
});

test('when only allowing value equal to 0 and value is 1', function() {
  model.set('attribute', 1);
  options = { messages: { equalTo: 'failed equal validation', numericality: 'failed validation' }, equalTo: 0 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed equal validation']);
});

test('when only allowing odd values and the value is odd', function() {
  model.set('attribute', 11);
  options = { messages: { odd: 'failed validation', numericality: 'failed validation' }, odd: true };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when only allowing odd values and the value is even', function() {
  model.set('attribute', 10);
  options = { messages: { odd: 'failed validation', numericality: 'failed validation' }, odd: true };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when only allowing even values and the value is even', function() {
  model.set('attribute', 10);
  options = { messages: { even: 'failed validation', numericality: 'failed validation' }, even: true };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when only allowing even values and the value is odd', function() {
  model.set('attribute', 11);
  options = { messages: { even: 'failed validation', numericality: 'failed validation' }, even: true };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when value refers to another present property', function() {
  options   = { messages: { greaterThan: 'failed to be greater', numericality: 'failed validation' }, greaterThan: 'attribute_2' };
  model.set('attribute_1', 0);
  model.set('attribute_2', 1);
  Ember.Validations.validators.local.numericality(model, 'attribute_1', options);
  deepEqual(model.errors.get('attribute_1'), ['failed to be greater']);
  model.errors.clear();
  model.set('attribute_1', 2);
  model.set('attribute_2', 1);
  Ember.Validations.validators.local.numericality(model, 'attribute_1', options);
  equal(model.errors.get('attribute_1'), undefined);
});

test('when options is true', function() {
  options = true;
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['is not a number']);
});

test('when only integer and no message is passed', function() {
  model.set('attribute', 1.1);
  options = { onlyInteger: true };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['must be an integer']);
});

test('when equal to  and no message is passed', function() {
  model.set('attribute', 10);
  options = { equalTo: 11 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['must be equal to 11']);
});

test('when greater than and no message is passed', function() {
  model.set('attribute', 10);
  options = { greaterThan: 11 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['must be greater than 11']);
});

test('when greater than or equal to and no message is passed', function() {
  model.set('attribute', 10);
  options = { greaterThanOrEqualTo: 11 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['must be greater than or equal to 11']);
});

test('when less than and no message is passed', function() {
  model.set('attribute', 11);
  options = { lessThan: 10 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['must be less than 10']);
});

test('when less than or equal to and no message is passed', function() {
  model.set('attribute', 11);
  options = { lessThanOrEqualTo: 10 };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['must be less than or equal to 10']);
});

test('when odd and no message is passed', function() {
  model.set('attribute', 10);
  options = { odd: true };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['must be odd']);
});

test('when even and no message is passed', function() {
  model.set('attribute', 11);
  options = { even: true };
  Ember.Validations.validators.local.numericality(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['must be even']);
});

test('when deferred object is passed', function() {
  options = true;
  var deferredObject = new Ember.$.Deferred();
  Ember.Validations.validators.local.numericality(model, 'attribute', options, deferredObject);
  equal(deferredObject.state(), 'resolved');
});
