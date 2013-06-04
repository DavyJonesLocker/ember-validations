var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Format Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    model = Model.create();
  }
});

test('when matching format', function() {
  model.set('attribute',  '123');
  options = { 'message': 'failed validation', 'with': /\d+/ };
  validator = Ember.Validations.validators.local.Format.create({model: model, property: 'attribute', options: options});
  validator.call(pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when not matching format', function() {
  model.set('attribute', 'abc');
  options = { 'message': 'failed validation', 'with': /\d+/ };
  validator = Ember.Validations.validators.local.Format.create({model: model, property: 'attribute', options: options});
  validator.call(fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowing blank', function() {
  options = { 'message': 'failed validation', 'with': /\d+/, 'allowBlank': true };
  validator = Ember.Validations.validators.local.Format.create({model: model, property: 'attribute', options: options});
  validator.call(pass, fail);
  equal(model.errors.get('attribute'), undefined);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  validator = Ember.Validations.validators.local.Format.create({model: model, property: 'attribute', options: options});
  validator.call(fail, pass);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when options is regexp', function() {
  options = /\d+/;
  validator = Ember.Validations.validators.local.Format.create({model: model, property: 'attribute', options: options});
  validator.call(fail, pass);
  deepEqual(model.errors.get('attribute'), ['is invalid']);
});

test('when no message is passed', function() {
  options = { 'with': /\d+/ };
  validator = Ember.Validations.validators.local.Format.create({model: model, property: 'attribute', options: options});
  validator.call(fail, pass);
  deepEqual(model.errors.get('attribute'), ['is invalid']);
});
