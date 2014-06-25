import Ember from 'ember';
import Numericality from 'ember-validations/validators/local/numericality';
import Mixin from 'ember-validations/mixin';
import { buildContainer } from '../../../helpers/container';

var model, Model, options, validator;
var set = Ember.set;

module('Numericality Validator', {
  setup: function() {
    Model =  Ember.Object.extend(Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is a number', function() {
  options = { messages: { numericality: 'failed validation' } };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 123);
  });
  deepEqual(validator.errors, []);
});

test('when value is a decimal number', function() {
  options = { messages: { numericality: 'failed validation' } };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 123.456);
  });
  deepEqual(validator.errors, []);
});

test('when value is not a number', function() {
  options = { messages: { numericality: 'failed validation' } };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'abc123');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when no value', function() {
  options = { messages: { numericality: 'failed validation' } };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when no value and allowing blank', function() {
  options = { messages: { numericality: 'failed validation' }, allowBlank: true };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when bad value and allowing blank', function() {
  options = { messages: { numericality: 'failed validation' }, allowBlank: true };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'abc123');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing integers and value is integer', function() {
  options = { messages: { onlyInteger: 'failed validation', numericality: 'failed validation' }, onlyInteger: true };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 123);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing integers and value is not integer', function() {
  options = { messages: { onlyInteger: 'failed integer validation', numericality: 'failed validation' }, onlyInteger: true };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 123.456);
  });
  deepEqual(validator.errors, ['failed integer validation']);
});

test('when only integer and no message is passed', function() {
  options = { onlyInteger: true };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 1.1);
  });
  deepEqual(validator.errors, ['must be an integer']);
});

test('when only integer is passed directly', function() {
  options = 'onlyInteger';
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 1.1);
  });
  deepEqual(validator.errors, ['must be an integer']);
});

test('when only allowing values greater than 10 and value is greater than 10', function() {
  options = { messages: { greaterThan: 'failed validation', numericality: 'failed validation' }, greaterThan: 10 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values greater than 10 and value is 10', function() {
  options = { messages: { greaterThan: 'failed validation', numericality: 'failed validation' }, greaterThan: 10 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing values greater than or deepEqual to 10 and value is 10', function() {
  options = { messages: { greaterThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, greaterThanOrEqualTo: 10 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values greater than or deepEqual to 10 and value is 9', function() {
  options = { messages: { greaterThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, greaterThanOrEqualTo: 10 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 9);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing values less than 10 and value is less than 10', function() {
  options = { messages: { lessThan: 'failed validation', numericality: 'failed validation' }, lessThan: 10 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 9);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values less than 10 and value is 10', function() {
  options = { messages: { lessThan: 'failed validation', numericality: 'failed validation' }, lessThan: 10 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing values less than or deepEqual to 10 and value is 10', function() {
  options = { messages: { lessThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, lessThanOrEqualTo: 10 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values less than or deepEqual to 10 and value is 11', function() {
  options = { messages: { lessThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, lessThanOrEqualTo: 10 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  deepEqual(validator.errors, ['failed validation']);
  });
});

test('when only allowing values equal to 10 and value is 10', function() {
  options = { messages: { equalTo: 'failed validation', numericality: 'failed validation' }, equalTo: 10 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values equal to 10 and value is 11', function() {
  options = { messages: { equalTo: 'failed equal validation', numericality: 'failed validation' }, equalTo: 10 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  deepEqual(validator.errors, ['failed equal validation']);
});

test('when only allowing value equal to 0 and value is 1', function() {
  options = { messages: { equalTo: 'failed equal validation', numericality: 'failed validation' }, equalTo: 0 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 1);
  });
  deepEqual(validator.errors, ['failed equal validation']);
});

test('when only allowing odd values and the value is odd', function() {
  options = { messages: { odd: 'failed validation', numericality: 'failed validation' }, odd: true };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing odd values and the value is even', function() {
  options = { messages: { odd: 'failed validation', numericality: 'failed validation' }, odd: true };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing even values and the value is even', function() {
  options = { messages: { even: 'failed validation', numericality: 'failed validation' }, even: true };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing even values and the value is odd', function() {
  options = { messages: { even: 'failed validation', numericality: 'failed validation' }, even: true };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when value refers to another present property', function() {
  options   = { messages: { greaterThan: 'failed to be greater', numericality: 'failed validation' }, greaterThan: 'attribute_2' };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute_1', options: options});
    set(model, 'attribute_1', 0);
    set(model, 'attribute_2', 1);
  });
  deepEqual(validator.errors, ['failed to be greater']);
  Ember.run(function() {
    set(model, 'attribute_1', 2);
    set(model, 'attribute_2', 1);
  });
  deepEqual(validator.errors, []);
});

test('when options is true', function() {
  options = true;
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', '');
  });
  deepEqual(validator.errors, ['is not a number']);
});

test('when equal to  and no message is passed', function() {
  options = { equalTo: 11 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  deepEqual(validator.errors, ['must be equal to 11']);
});

test('when greater than and no message is passed', function() {
  options = { greaterThan: 11 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  deepEqual(validator.errors, ['must be greater than 11']);
});

test('when greater than or equal to and no message is passed', function() {
  options = { greaterThanOrEqualTo: 11 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  deepEqual(validator.errors, ['must be greater than or equal to 11']);
});

test('when less than and no message is passed', function() {
  options = { lessThan: 10 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  deepEqual(validator.errors, ['must be less than 10']);
});

test('when less than or equal to and no message is passed', function() {
  options = { lessThanOrEqualTo: 10 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  deepEqual(validator.errors, ['must be less than or equal to 10']);
});

test('when odd and no message is passed', function() {
  options = { odd: true };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 10);
  });
  deepEqual(validator.errors, ['must be odd']);
});

test('when even and no message is passed', function() {
  options = { even: true };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  deepEqual(validator.errors, ['must be even']);
});

test('when other messages are passed but not a numericality message', function() {
  options = { messages: { greaterThan: 'failed validation' } };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 'abc');
  });
  deepEqual(validator.errors, ['is not a number']);
});

test('when greaterThan fails and a greaterThan message is passed but not a numericality message', function() {
  options = { greaterThan: 11, messages: { greaterThan: 'custom message' } };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['custom message']);
});

test("numericality validators don't call addObserver on null props", function() {
  expect(1);

  var stubbedObserverCalls = 0;

  var realAddObserver = model.addObserver;
  model.addObserver = function(_, path) {
    stubbedObserverCalls += 1;
    if (!path) {
      ok(false, "shouldn't call addObserver with falsy path");
    }
    return realAddObserver.apply(this, arguments);
  };

  options = { lessThanOrEqualTo: 10 };
  Ember.run(function() {
    validator = Numericality.create({model: model, property: 'attribute', options: options});
    set(model, 'attribute', 11);
  });
  model.addObserver = realAddObserver;

  equal(1, stubbedObserverCalls, "stubbed addObserver was called");
});
