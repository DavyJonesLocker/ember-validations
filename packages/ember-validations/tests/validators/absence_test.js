var model, Model, options;

module('Absence Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    model = Model.create();
  }
});

test('when value is not empty', function() {
  model.set('attribute', 'not empty');
  options = { message: 'failed validation' };
  Ember.Validations.validators.local.absence(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when value is empty', function() {
  options = { message: 'failed validation' };
  Ember.Validations.validators.local.absence(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when options is true', function() {
  options = true;
  model.set('attribute', 'not empty');
  Ember.Validations.validators.local.absence(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ["must be blank"]);
});

test('when deferred object is passed', function() {
  options = true;
  model.set('attribute', 'not empty');
  var deferredObject = new Ember.$.Deferred();
  Ember.Validations.validators.local.absence(model, 'attribute', options, deferredObject);
  equal(deferredObject.state(), 'resolved');
});
