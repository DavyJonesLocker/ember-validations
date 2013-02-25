var model, options;

module('Presence Validator', {
  setup: function() {
    model = new Ember.Object();
  }
});

test('when value is not empty', function() {
  model.set('attribute', 'not empty');
  options = { message: 'failed validation' };
  equal(Ember.Validations.validators.local.presence(model, 'attribute', options), undefined);
});

test('when value is empty', function() {
  options = { message: 'failed validation' };
  equal(Ember.Validations.validators.local.presence(model, 'attribute', options), 'failed validation');
});

test('when value is null from non-selected multi-select element', function() {
  options = { message: 'failed validation' };
  equal(Ember.Validations.validators.local.presence(model, 'attribute', options), 'failed validation');
});

test('when options is true', function() {
  options = true;
  equal(Ember.Validations.validators.local.format(model, 'attribute', options), "can't be blank");
});

test('when deferred object is passed', function() {
  options = true;
  var deferredObject = new Ember.$.Deferred();
  Ember.Validations.validators.local.presence(model, 'attribute', options, deferredObject);
  equal(deferredObject.state(), 'resolved');
});
