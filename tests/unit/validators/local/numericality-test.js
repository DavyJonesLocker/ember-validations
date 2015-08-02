import Ember from 'ember';
import { module, test } from 'qunit';
import Numericality from 'ember-validations/validators/local/numericality';
import Mixin from 'ember-validations/mixin';

var model, Model, options, validator;
var set = Ember.set;
var run = Ember.run;

module('Numericality Validator', {
  setup: function() {
    Model = Ember.Object.extend(Mixin, {
      container: buildContainer()
    });
    run(function() {
      model = Model.create();
    });
  }
});

test('when value is a number', function(assert) {
  options = { messages: { numericality: 'failed validation' } };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 123);
  });
  assert.deepEqual(validator.errors, []);
});

test('when value is a decimal number', function(assert) {
  options = { messages: { numericality: 'failed validation' } };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 123.456);
  });
  assert.deepEqual(validator.errors, []);
});

test('when value is not a number', function(assert) {
  options = { messages: { numericality: 'failed validation' } };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'abc123');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when no value', function(assert) {
  options = { messages: { numericality: 'failed validation' } };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when no value and allowing blank', function(assert) {
  options = { messages: { numericality: 'failed validation' }, allowBlank: true };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, []);
});

test('when bad value and allowing blank', function(assert) {
  options = { messages: { numericality: 'failed validation' }, allowBlank: true };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'abc123');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing integers and value is integer', function(assert) {
  options = { messages: { onlyInteger: 'failed validation', numericality: 'failed validation' }, onlyInteger: true };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 123);
  });
  assert.deepEqual(validator.errors, []);
});

test('when only allowing integers and value is not integer', function(assert) {
  options = { messages: { onlyInteger: 'failed integer validation', numericality: 'failed validation' }, onlyInteger: true };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 123.456);
  });
  assert.deepEqual(validator.errors, ['failed integer validation']);
});

test('when only integer and no message is passed', function(assert) {
  options = { onlyInteger: true };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 1.1);
  });
  assert.deepEqual(validator.errors, ['must be an integer']);
});

test('when only integer is passed directly', function(assert) {
  options = 'onlyInteger';
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 1.1);
  });
  assert.deepEqual(validator.errors, ['must be an integer']);
});

test('when only allowing values greater than 10 and value is greater than 10', function(assert) {
  options = { messages: { greaterThan: 'failed validation', numericality: 'failed validation' }, greaterThan: 10 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  assert.deepEqual(validator.errors, []);
});

test('when only allowing values greater than 10 and value is 10', function(assert) {
  options = { messages: { greaterThan: 'failed validation', numericality: 'failed validation' }, greaterThan: 10 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing values greater than or assert.deepEqual to 10 and value is 10', function(assert) {
  options = { messages: { greaterThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, greaterThanOrEqualTo: 10 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  assert.deepEqual(validator.errors, []);
});

test('when only allowing values greater than or assert.deepEqual to 10 and value is 9', function(assert) {
  options = { messages: { greaterThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, greaterThanOrEqualTo: 10 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 9);
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing values less than 10 and value is less than 10', function(assert) {
  options = { messages: { lessThan: 'failed validation', numericality: 'failed validation' }, lessThan: 10 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 9);
  });
  assert.deepEqual(validator.errors, []);
});

test('when only allowing values less than 10 and value is 10', function(assert) {
  options = { messages: { lessThan: 'failed validation', numericality: 'failed validation' }, lessThan: 10 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing values less than or assert.deepEqual to 10 and value is 10', function(assert) {
  options = { messages: { lessThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, lessThanOrEqualTo: 10 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  assert.deepEqual(validator.errors, []);
});

test('when only allowing values less than or assert.deepEqual to 10 and value is 11', function(assert) {
  options = { messages: { lessThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, lessThanOrEqualTo: 10 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  assert.deepEqual(validator.errors, ['failed validation']);
  });
});

test('when only allowing values equal to 10 and value is 10', function(assert) {
  options = { messages: { equalTo: 'failed validation', numericality: 'failed validation' }, equalTo: 10 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  assert.deepEqual(validator.errors, []);
});

test('when only allowing values equal to 10 and value is 11', function(assert) {
  options = { messages: { equalTo: 'failed equal validation', numericality: 'failed validation' }, equalTo: 10 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  assert.deepEqual(validator.errors, ['failed equal validation']);
});

test('when only allowing value equal to 0 and value is 1', function(assert) {
  options = { messages: { equalTo: 'failed equal validation', numericality: 'failed validation' }, equalTo: 0 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 1);
  });
  assert.deepEqual(validator.errors, ['failed equal validation']);
});

test('when only allowing odd values and the value is odd', function(assert) {
  options = { messages: { odd: 'failed validation', numericality: 'failed validation' }, odd: true };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  assert.deepEqual(validator.errors, []);
});

test('when only allowing odd values and the value is even', function(assert) {
  options = { messages: { odd: 'failed validation', numericality: 'failed validation' }, odd: true };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing even values and the value is even', function(assert) {
  options = { messages: { even: 'failed validation', numericality: 'failed validation' }, even: true };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  assert.deepEqual(validator.errors, []);
});

test('when only allowing even values and the value is odd', function(assert) {
  options = { messages: { even: 'failed validation', numericality: 'failed validation' }, even: true };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when value refers to another present property', function(assert) {
  options   = { messages: { greaterThan: 'failed to be greater', numericality: 'failed validation' }, greaterThan: 'attribute_2' };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute_1', options: options});
    set(model, 'attribute_1', 0);
    set(model, 'attribute_2', 1);
  });
  assert.deepEqual(validator.errors, ['failed to be greater']);
  run(function() {
    set(model, 'attribute_1', 2);
    set(model, 'attribute_2', 1);
  });
  assert.deepEqual(validator.errors, []);
});

test('when options is true', function(assert) {
  options = true;
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  assert.deepEqual(validator.errors, ['is not a number']);
});

test('when equal to  and no message is passed', function(assert) {
  options = { equalTo: 11 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  assert.deepEqual(validator.errors, ['must be equal to 11']);
});

test('when greater than and no message is passed', function(assert) {
  options = { greaterThan: 11 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  assert.deepEqual(validator.errors, ['must be greater than 11']);
});

test('when greater than or equal to and no message is passed', function(assert) {
  options = { greaterThanOrEqualTo: 11 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  assert.deepEqual(validator.errors, ['must be greater than or equal to 11']);
});

test('when less than and no message is passed', function(assert) {
  options = { lessThan: 10 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  assert.deepEqual(validator.errors, ['must be less than 10']);
});

test('when less than or equal to and no message is passed', function(assert) {
  options = { lessThanOrEqualTo: 10 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  assert.deepEqual(validator.errors, ['must be less than or equal to 10']);
});

test('when odd and no message is passed', function(assert) {
  options = { odd: true };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  assert.deepEqual(validator.errors, ['must be odd']);
});

test('when even and no message is passed', function(assert) {
  options = { even: true };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  assert.deepEqual(validator.errors, ['must be even']);
});

test('when other messages are passed but not a numericality message', function(assert) {
  options = { messages: { greaterThan: 'failed validation' } };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'abc');
  });
  assert.deepEqual(validator.errors, ['is not a number']);
});

test('when greaterThan fails and a greaterThan message is passed but not a numericality message', function(assert) {
  options = { greaterThan: 11, messages: { greaterThan: 'custom message' } };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 10);
  });
  assert.deepEqual(validator.errors, ['custom message']);
});

test("numericality validators don't call addObserver on null props", function(assert) {
  var stubbedObserverCalls = 0;

  var realAddObserver = model.addObserver;
  model.addObserver = function(_, path) {
    stubbedObserverCalls += 1;
    if (!path) {
      assert.ok(false, "shouldn't call addObserver with falsy path");
    }
    return realAddObserver.apply(this, arguments);
  };

  options = { lessThanOrEqualTo: 10 };
  run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  model.addObserver = realAddObserver;

  assert.equal(1, stubbedObserverCalls, "stubbed addObserver was called");
});
