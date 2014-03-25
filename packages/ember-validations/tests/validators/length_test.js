var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Length Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when allowed length is 3 and value length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '123');
  });
  deepEqual(validator.errors, []);
});

test('when allowed length is 3 and value length is 4', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '1234');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowed length is 3 and value length is 2', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '12');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowing blank and allowed length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3, allowBlank: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when allowing blank and minimum length is 3 and maximum length is 100', function() {
  options = { messages: { tooShort: 'failed minimum validation', tooLong: 'failed maximum validation' }, minimum: 3, maximum: 100, allowBlank: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when not allowing blank and allowed length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowed length is 3 and a different tokenizer', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3, tokenizer: function(value) { return value.split(' '); } };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'one two three');
  });
  deepEqual(validator.errors, []);
});

test('when allowed length minimum is 3 and value length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '123');
  });
  deepEqual(validator.errors, []);
});

test('when allowed length minimum is 3 and value length is 2', function() {
  options = { messages: { tooShort: 'failed validation' }, minimum: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '12');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowed length maximum is 3 and value length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '123');
  });
  deepEqual(validator.errors, []);
});

test('when allowed length maximum is 3 and value length is 4', function() {
  options = { messages: { tooLong: 'failed validation' }, maximum: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '1234');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowed length maximum is 3 and value is blank', function() {
  options = { maximum: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when options is a number', function() {
  model.set('attribute', '1234');
  options = 3;
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is the wrong length (should be 3 characters)']);
});

test('when options is a number and value is undefined', function() {
  options = 3;
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is the wrong length (should be 3 characters)']);
});

test('when allowed length is 3, value length is 4 and no message is set', function() {
  options = { is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '1234');
  });
  deepEqual(validator.errors, ['is the wrong length (should be 3 characters)']);
});

test('when allowed length minimum is 3, value length is 2 and no message is set', function() {
  options = { minimum: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '12');
  });
  deepEqual(validator.errors, ['is too short (minimum is 3 characters)']);
});

test('when allowed length maximum is 3, value length is 4 and no message is set', function() {
  options = { maximum: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '1234');
  });
  deepEqual(validator.errors, ['is too long (maximum is 3 characters)']);
});

test('when using a property instead of a number', function() {
  options = { is: 'countProperty' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '123');
  });
  deepEqual(validator.errors, ['is the wrong length (should be 0 characters)']);
  Ember.run(function() {
    model.set('countProperty', 3);
  });
  deepEqual(validator.errors, []);
  Ember.run(function() {
    model.set('countProperty', 5);
  });
  deepEqual(validator.errors, ['is the wrong length (should be 5 characters)']);
});
