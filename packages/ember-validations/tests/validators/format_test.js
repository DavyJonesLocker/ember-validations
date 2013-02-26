var model, Model, options;

module('Format Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    model = Model.create();
  }
});

test('when matching format', function() {
  model.set('attribute',  '123');
  options = { 'message': 'failed validation', 'with': /\d+/ };
  Ember.Validations.validators.local.format(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when not matching format', function() {
  model.set('attribute', 'abc');
  options = { 'message': 'failed validation', 'with': /\d+/ };
  Ember.Validations.validators.local.format(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when allowing blank', function() {
  options = { 'message': 'failed validation', 'with': /\d+/, 'allow_blank': true };
  Ember.Validations.validators.local.format(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  Ember.Validations.validators.local.format(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when options is regexp', function() {
  options = /\d+/;
  Ember.Validations.validators.local.format(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['is invalid']);
});

test('when no message is passed', function() {
  options = { 'with': /\d+/ };
  Ember.Validations.validators.local.format(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['is invalid']);
});

test('when deferred object is passed', function() {
  options = { 'with': /\d+/ };
  var deferredObject = new Ember.$.Deferred();
  Ember.Validations.validators.local.format(model, 'attribute', options, deferredObject);
  equal(deferredObject.state(), 'resolved');
});
