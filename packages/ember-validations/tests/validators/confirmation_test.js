var model, Model, options;

module('Confirmation Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    model = Model.create();
  }
});

test('when values match', function() {
  model.set('attribute', 'test');
  model.set('attributeConfirmation', 'test');
  options = { message: 'failed validation' };
  Ember.Validations.validators.local.confirmation(model, 'attribute', options);
  equal(model.errors.get('attribute'), undefined);
});

test('when values do not match', function() {
  model.set('attribute', 'test');
  options = { message: 'failed validation' };
  Ember.Validations.validators.local.confirmation(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ['failed validation']);
});

test('when options is true', function() {
  model.set('attribute', 'test');
  options = true;
  Ember.Validations.validators.local.confirmation(model, 'attribute', options);
  deepEqual(model.errors.get('attribute'), ["doesn't match attribute"]);
});

test('when deferred object is passed', function() {
  options = true;
  var deferredObject = new Ember.$.Deferred();
  Ember.Validations.validators.local.confirmation(model, 'attribute', options, deferredObject);
  equal(deferredObject.state(), 'resolved');
});
