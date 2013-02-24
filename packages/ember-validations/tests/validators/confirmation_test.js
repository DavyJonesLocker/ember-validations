var model, options;

module('Confirmation Validator', {
  setup: function() {
    model = new Ember.Object();
  }
});

test('when values match', function() {
  model.set('attribute', 'test');
  model.set('attribute_confirmation', 'test');
  options = { message: 'failed validation' };
  equal(Ember.Validations.validators.local.confirmation(model, 'attribute', options), undefined);
});

test('when values do not match', function() {
  model.set('attribute', 'test');
  options = { message: 'failed validation' };
  equal(Ember.Validations.validators.local.confirmation(model, 'attribute', options), 'failed validation');
});

test('when options is true', function() {
  model.set('attribute', 'test');
  options = true;
  equal(Ember.Validations.validators.local.confirmation(model, 'attribute', options), "doesn't match attribute");
});
