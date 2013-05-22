var model, Model, options;

module('Presence Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin, {
      validateStartIsBeforeStop: function() {
        if ( this.get('start') > this.get('stop') ) {
          return 'Start must be before stop';
        }
      }
    });
    model = Model.create();
  }
});

test('when custom validation function returns a messessage', function() {
  model.setProperties({
    start: 2,
    stop: 1
  });
  Ember.Validations.validators.local.custom(model, 'start', 'validateStartIsBeforeStop');
  equal(model.errors.get('start'), 'Start must be before stop');
});

test('when custom validation function returns undefined', function() {
  model.setProperties({
    start: 1,
    stop: 2
  });
  Ember.Validations.validators.local.presence(model, 'start', 'validateStartIsBeforeStop');
  deepEqual(model.errors.get('start'), undefined);
});