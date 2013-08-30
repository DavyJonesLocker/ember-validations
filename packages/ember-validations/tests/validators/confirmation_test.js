var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Confirmation Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when values match', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Confirmation.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'test');
    model.set('attributeConfirmation', 'test');
  });
  deepEqual(validator.errors, []);
  Ember.run(function() {
    model.set('attributeConfirmation', 'newTest');
  });
  deepEqual(validator.errors, ['failed validation']);
  Ember.run(function() {
    model.set('attribute', 'newTest');
  });
  deepEqual(validator.errors, []);
});

test('when values do not match', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Confirmation.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'test');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is true', function() {
  options = true;
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Confirmation.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'test');
  });
  deepEqual(validator.errors, ["doesn't match attribute"]);
});

test('message integration on model, prints message on Confirmation property', function() {
  var otherModel, OtherModel = Model.extend({
    validations: {
      attribute: {
        confirmation: true
      }
    }
  });

  Ember.run(function() {
    otherModel = OtherModel.create();
    otherModel.set('attribute', 'test');
  });

  deepEqual(otherModel.get('errors.attributeConfirmation'), ["doesn't match attribute"]);
  deepEqual(otherModel.get('errors.attribute'), []);
});
