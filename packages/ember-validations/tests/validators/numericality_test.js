var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Numericality Validator', {
  setup: function() {
    Model = validator = Ember.Object.extend(validator = Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is a number', function() {
  options = { messages: { numericality: 'failed validation' } };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 123);
  });
  deepEqual(validator.errors, []);
});

test('when value is a decimal number', function() {
  options = { messages: { numericality: 'failed validation' } };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 123.456);
  });
  deepEqual(validator.errors, []);
});

test('when value is not a number', function() {
  options = { messages: { numericality: 'failed validation' } };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 'abc123');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when no value', function() {
  options = { messages: { numericality: 'failed validation' } };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when no value and allowing blank', function() {
  options = { messages: { numericality: 'failed validation' }, allowBlank: true };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when bad value and allowing blank', function() {
  options = { messages: { numericality: 'failed validation' }, allowBlank: true };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 'abc123');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing integers and value is integer', function() {
  options = { messages: { onlyInteger: 'failed validation', numericality: 'failed validation' }, onlyInteger: true };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 123);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing integers and value is not integer', function() {
  options = { messages: { onlyInteger: 'failed integer validation', numericality: 'failed validation' }, onlyInteger: true };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 123.456);
  });
  deepEqual(validator.errors, ['failed integer validation']);
});

test('when only allowing values greater than 10 and value is greater than 10', function() {
  options = { messages: { greaterThan: 'failed validation', numericality: 'failed validation' }, greaterThan: 10 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values greater than 10 and value is 10', function() {
  options = { messages: { greaterThan: 'failed validation', numericality: 'failed validation' }, greaterThan: 10 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing values greater than or deepEqual to 10 and value is 10', function() {
  options = { messages: { greaterThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, greaterThanOrEqualTo: 10 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values greater than or deepEqual to 10 and value is 9', function() {
  options = { messages: { greaterThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, greaterThanOrEqualTo: 10 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 9);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing values less than 10 and value is less than 10', function() {
  options = { messages: { lessThan: 'failed validation', numericality: 'failed validation' }, lessThan: 10 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 9);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values less than 10 and value is 10', function() {
  options = { messages: { lessThan: 'failed validation', numericality: 'failed validation' }, lessThan: 10 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing values less than or deepEqual to 10 and value is 10', function() {
  options = { messages: { lessThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, lessThanOrEqualTo: 10 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values less than or deepEqual to 10 and value is 11', function() {
  options = { messages: { lessThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, lessThanOrEqualTo: 10 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 11);
  deepEqual(validator.errors, ['failed validation']);
  });
});

test('when only allowing values equal to 10 and value is 10', function() {
  options = { messages: { equalTo: 'failed validation', numericality: 'failed validation' }, equalTo: 10 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values equal to 10 and value is 11', function() {
  options = { messages: { equalTo: 'failed equal validation', numericality: 'failed validation' }, equalTo: 10 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, ['failed equal validation']);
});

test('when only allowing value equal to 0 and value is 1', function() {
  options = { messages: { equalTo: 'failed equal validation', numericality: 'failed validation' }, equalTo: 0 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 1);
  });
  deepEqual(validator.errors, ['failed equal validation']);
});

test('when only allowing odd values and the value is odd', function() {
  options = { messages: { odd: 'failed validation', numericality: 'failed validation' }, odd: true };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing odd values and the value is even', function() {
  options = { messages: { odd: 'failed validation', numericality: 'failed validation' }, odd: true };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing even values and the value is even', function() {
  options = { messages: { even: 'failed validation', numericality: 'failed validation' }, even: true };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing even values and the value is odd', function() {
  options = { messages: { even: 'failed validation', numericality: 'failed validation' }, even: true };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when value refers to another present property', function() {
  options   = { messages: { greaterThan: 'failed to be greater', numericality: 'failed validation' }, greaterThan: 'attribute_2' };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute_1', options: options});
  Ember.run(function() {
    model.set('attribute_1', 0);
    model.set('attribute_2', 1);
  });
  deepEqual(validator.errors, ['failed to be greater']);
  Ember.run(function() {
    model.set('attribute_1', 2);
    model.set('attribute_2', 1);
  });
  deepEqual(validator.errors, []);
});

test('when options is true', function() {
  options = true;
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is not a number']);
});

test('when only integer and no message is passed', function() {
  options = { onlyInteger: true };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 1.1);
  });
  deepEqual(validator.errors, ['must be an integer']);
});

test('when equal to  and no message is passed', function() {
  options = { equalTo: 11 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['must be equal to 11']);
});

test('when greater than and no message is passed', function() {
  options = { greaterThan: 11 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['must be greater than 11']);
});

test('when greater than or equal to and no message is passed', function() {
  options = { greaterThanOrEqualTo: 11 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['must be greater than or equal to 11']);
});

test('when less than and no message is passed', function() {
  options = { lessThan: 10 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, ['must be less than 10']);
});

test('when less than or equal to and no message is passed', function() {
  options = { lessThanOrEqualTo: 10 };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, ['must be less than or equal to 10']);
});

test('when odd and no message is passed', function() {
  options = { odd: true };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['must be odd']);
});

test('when even and no message is passed', function() {
  options = { even: true };
  validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
  Ember.run(function() {
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, ['must be even']);
});
