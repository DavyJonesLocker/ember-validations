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

test('when allowed length is 3 and a differnet tokenizer', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3, tokenizer: 'match(/\\w+/g)' };
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

test('when passed a model property as maximum value, value is 2 and maximum is 4', function() {
  options = { maximum: 'validationProperty' };
  Ember.run(function() {
    model.set('validationProperty', 4);
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'ab');
  });
  deepEqual(validator.errors, []);
});

test('when passed a model property as maximum value, value is 2 and maximum is 2', function() {
  options = { maximum: 'validationProperty'};
  Ember.run(function() {
    model.set('validationProperty', 2);
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'ab');
  });
  deepEqual(validator.errors, []);
});

test('when passed a model property as maximum value, value is 2 and maximum is 1', function() {
  options = { maximum: 'validationProperty'};
  Ember.run(function() {
    model.set('validationProperty', 1);
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'ab');
  });
  deepEqual(validator.errors, ['is too long (maximum is 1 characters)']);
});

test('when passed a model property as minimum value, value is 1 and minimum is 1', function() {
  options = { minimum: 'validationProperty' };
  Ember.run(function() {
    model.set('validationProperty', 1);
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'a');
  });
  deepEqual(validator.errors, []);
});

test('when passed a model attribute as minimum value, value is 1 and minimum is 0', function() {
  options = { minimum: 'validationProperty' };
  Ember.run(function() {
    model.set('validationProperty', 0);
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'a');
  });
  deepEqual(validator.errors, []);
});

test('when passed a model attribute as minimum value, value is 1 and minimum is 2', function() {
  options = { minimum: 'validationProperty' };
  Ember.run(function() {
    model.set('validationProperty', 2);
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'a');
  });
  deepEqual(validator.errors, ['is too short (minimum is 2 characters)']);
});

test('when passed a model attribute as a number value, value is 1 and number value is 1', function() {
  options = { is: 'validationProperty' };
  Ember.run(function() {
    model.set('validationProperty', 1);
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'a');
  });
  deepEqual(validator.errors, []);
});

test('when passed a model attribute as a number value, value is 1 and number value is 2', function() {
  options = { is: 'validationProperty' };
  Ember.run(function() {
    model.set('validationProperty', 2);
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'a');
  });
  deepEqual(validator.errors, ['is the wrong length (should be 2 characters)']);
});

test('when passed a model attribute as a number value, value is 3 and number value is 2', function() {
  options = { is: 'validationProperty' };
  Ember.run(function() {
    model.set('validationProperty', 2);
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'abc');
  });
  deepEqual(validator.errors, ['is the wrong length (should be 2 characters)']);
});

test('when passed a model attribute as a number value, value is 3 and number value is 2', function() {
  options = { is: 'validationProperty' };
  Ember.run(function() {
    model.set('validationProperty', 2);
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'abc');
  });
  deepEqual(validator.errors, ['is the wrong length (should be 2 characters)']);
});

test('when passed a model attribute as a validation property that changes', function() {
  options = { is: 'validationProperty' };
  Ember.run(function() {
    model.set('validationProperty', 2);
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'abc');
  });
  deepEqual(validator.errors, ['is the wrong length (should be 2 characters)']);
  Ember.run(function() {
    model.set('validationProperty', 3);
    model.set('attribute', 'ab');
  });
  deepEqual(validator.errors, ['is the wrong length (should be 3 characters)']);
});

test('when passed an undefined model attribute as minimum value, value is 1', function() {
  options = {minimum: 'validationProperty'};
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});  
    model.set('attribute', 'a');
  });
  deepEqual(validator.errors, []);
});

test('when passed an undefined model attribute as maximum value, value is 1', function() {
  options = {maximum: 'validationProperty'};
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'a');
  });
  deepEqual(validator.errors, []);
});

test('when passed an undefined model attribute as number value, value is 1', function() {
  options = {is: 'validationProperty'};
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'a');
  });
  deepEqual(validator.errors, []);
});