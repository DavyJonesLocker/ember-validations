import Ember from 'ember';
import Errors from 'ember-validations/errors';
import Base from 'ember-validations/validators/base';

var setValidityMixin = Ember.Mixin.create({
  isValid: Ember.computed('validators.@each.isValid', function() {
    return this.get('validators').compact().filterBy('isValid', false).get('length') === 0;
  }),
  isInvalid: Ember.computed.not('isValid')
});

var pushValidatableObject = function(model, property) {
  var content = model.get(property);

  model.removeObserver(property, pushValidatableObject);
  if (Ember.isArray(content)) {
    model.validators.pushObject(ArrayValidatorProxy.create({model: model, property: property, contentBinding: 'model.' + property}));
  } else {
    model.validators.pushObject(content);
  }
};

var lookupValidator = function(validatorName) {
  var container = this.get('container');
  var local = container.lookupFactory('validator:local/'+validatorName);
  var remote = container.lookupFactory('validator:remote/'+validatorName);

  if (local || remote) { return [local, remote]; }

  var base = container.lookupFactory('validator:'+validatorName);

  if (base) { return [base]; }

  local = container.lookupFactory('ember-validations@validator:local/'+validatorName);
  remote = container.lookupFactory('ember-validations@validator:remote/'+validatorName);

  if (local || remote) { return [local, remote]; }

  Ember.warn('Could not the "'+validatorName+'" validator.');
};

var ArrayValidatorProxy = Ember.ArrayProxy.extend(setValidityMixin, {
  validate: function() {
    return this._validate();
  },
  _validate: function() {
    var promises = this.get('content').invoke('_validate').without(undefined);
    return Ember.RSVP.all(promises);
  }.on('init'),
  validators: Ember.computed.alias('content')
});

export default Ember.Mixin.create(setValidityMixin, {
  init: function() {
    this._super();
    this.errors = Errors.create();
    this.dependentValidationKeys = {};
    this.validators = Ember.makeArray();
    if (this.get('validations') === undefined) {
      this.validations = {};
    }
    this.buildValidators();
    this.validators.forEach(function(validator) {
      validator.addObserver('errors.[]', this, function(sender) {
        var errors = Ember.makeArray();
        this.validators.forEach(function(validator) {
          if (validator.property === sender.property) {
            errors = errors.concat(validator.errors);
          }
        }, this);
        this.set('errors.' + sender.property, errors);
      });
    }, this);
  },
  buildValidators: function() {
    var property;

    for (property in this.validations) {
      if (this.validations[property].constructor === Object) {
        this.buildRuleValidator(property);
      } else {
        this.buildObjectValidator(property);
      }
    }
  },
  buildRuleValidator: function(property) {
    var pushValidator = function(validator) {
      if (validator) {
        this.validators.pushObject(validator.create({model: this, property: property, options: this.validations[property][validatorName]}));
      }
    };

    if (this.validations[property].callback) {
      this.validations[property] = { inline: this.validations[property] };
    }

    var createInlineClass = function(callback) {
      return Base.extend({
        call: function() {
          var errorMessage = this.callback.call(this);

          if (errorMessage) {
            this.errors.pushObject(errorMessage);
          }
        },
        callback: callback
      });
    };

    for (var validatorName in this.validations[property]) {
      if (validatorName === 'inline') {
        pushValidator.call(this, createInlineClass(this.validations[property][validatorName].callback));
      } else if (this.validations[property].hasOwnProperty(validatorName)) {
        Ember.EnumerableUtils.forEach(lookupValidator.call(this, validatorName), pushValidator, this);
      }
    }
  },
  buildObjectValidator: function(property) {
    if (Ember.isNone(this.get(property))) {
      this.addObserver(property, this, pushValidatableObject);
    } else {
      pushValidatableObject(this, property);
    }
  },
  validate: function() {
    var self = this;
    return this._validate().then(function(vals) {
      var errors = self.get('errors');
      if (vals.contains(false)) {
        return Ember.RSVP.reject(errors);
      }
      return errors;
    });
  },
  _validate: Ember.on('init', function() {
    var promises = this.validators.invoke('_validate').without(undefined);
    return Ember.RSVP.all(promises);
  })
});
