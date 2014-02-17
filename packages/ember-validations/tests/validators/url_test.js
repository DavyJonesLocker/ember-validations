var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('URL Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

// Test allowBlank

test('when allowing blank', function() {
  options = { 'message': 'failed validation', allowBlank: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

// Test with valid URLs

test('when valid url with domain', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com');
  });
  deepEqual(validator.errors, []);
});

test('when valid uri with domain and port', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com');
  });
  deepEqual(validator.errors, []);
});

test('when valid uri with domain, port and path', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com/path/to/file.html');
  });
  deepEqual(validator.errors, []);
});

test('when valid uri with domain, port, path and query', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com/path/to/file.html?one=two&three=four');
  });
  deepEqual(validator.errors, []);
});

test('when valid uri with domain, port, path, query and fragment', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com/path/to/file.html?one=two&three=four#anchor=drop');
  });
  deepEqual(validator.errors, []);
});


// Tests to fail validation

test('when uri has space', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://example . com');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when protocol not valid', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'invalid://www.example.com');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when domain not valid', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.******.com');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when port not valid', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com:PORT');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when path not valid', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com/path to file');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when query not valid', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com/path/to/file.html?one two');
  });
  deepEqual(validator.errors, ['failed validation']);
});


test('when anchor not valid', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com/path/to/file.html?one=two&three=four#anchor drop');
  });
  deepEqual(validator.errors, ['failed validation']);
});


// Test domainOnly

test('when domain only', function() {
  options = { 'message': 'failed validation', domainOnly: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'www.example.com');
  });
  deepEqual(validator.errors, []);
});

test('when domain only not valid', function() {
  options = { 'message': 'failed validation', domainOnly: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com');
  });
  deepEqual(validator.errors, ['failed validation']);
});

// Protocols

test('when defined protocols', function() {
  options = { 'message': 'failed validation', protocols: ['https'] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'https://www.example.com');
  });
  deepEqual(validator.errors, []);
});

test('when defined protocols not valid', function() {
  options = { 'message': 'failed validation', protocols: ['https'] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com');
  });
  deepEqual(validator.errors, ['failed validation']);
});


// Test allowPort

test('when port allowed', function() {
  options = { 'message': 'failed validation', allowPort: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com:80');
  });
  deepEqual(validator.errors, []);
});


test('when port not allowed', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com:80');
  });
  deepEqual(validator.errors, ['failed validation']);
});

// Test allowUserPass

test('when username and password allowed', function() {
  options = { 'message': 'failed validation', allowUserPass: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://username:password@example.com');
  });
  deepEqual(validator.errors, []);
});


test('when username and password not allowed', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://username:password@example.com');
  });
  deepEqual(validator.errors, ['failed validation']);
});


// Test allowIp

test('when IP allowed', function() {
  options = { 'message': 'failed validation', allowIp: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://127.0.0.1');
  });
  deepEqual(validator.errors, []);
});


test('when IP not allowed', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://127.0.0.1');
  });
  deepEqual(validator.errors, ['failed validation']);
});
