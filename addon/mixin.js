import Ember from 'ember';
import Errors from 'ember-validations/errors';
import Base from 'ember-validations/validators/base';
import getOwner from 'ember-getowner-polyfill';

var get = Ember.get;
var set = Ember.set;

var setValidityMixin = Ember.Mixin.create({
  isValid: Ember.computed('validators.@each.isValid', function() {
    var compactValidators = get(this, 'validators').compact();
    var filteredValidators = compactValidators.filter(function(validator) {
      return !get(validator, 'isValid');
    });

    return get(filteredValidators, 'length') === 0;
  }),
  isInvalid: Ember.computed.not('isValid')
});

var pushValidatableObject = function(model, property) {
  var content = get(model, property);

  model.removeObserver(property, pushValidatableObject);
  if (Ember.isArray(content)) {
    model.validators.pushObject(ArrayValidatorProxy.create({model: model, property: property, contentBinding: 'model.' + property}));
  } else {
    model.validators.pushObject(content);
  }
};

var lookupValidator = function(validatorName) {
  var owner = getOwner(this);
  var service = owner.lookup('service:validations');
  var validators = [];
  var cache;

  if (service) {
    cache = get(service, 'cache');
  } else {
    cache = {};
  }

  if (cache[validatorName]) {
    validators = validators.concat(cache[validatorName]);
  } else {
    var local = owner.resolveRegistration('validator:local/' + validatorName);
    var remote = owner.resolveRegistration('validator:remote/' + validatorName);

    if (local || remote) {
      validators = validators.concat([local, remote]);
    } else {
      var base = owner.resolveRegistration('validator:'+validatorName);

      if (base) {
        validators = validators.concat([base]);
      } else {
        local = owner.resolveRegistration('ember-validations@validator:local/'+validatorName);
        remote = owner.resolveRegistration('ember-validations@validator:remote/'+validatorName);

        if (local || remote) {
          validators = validators.concat([local, remote]);
        }
      }
    }

    cache[validatorName] = validators;
  }

  Ember.warn('Could not find the "'+validatorName+'" validator.', !Ember.isEmpty(validators), {id: 'ember-validations.faild-to-find-validator'});

  return validators;
};

var ArrayValidatorProxy = Ember.ArrayProxy.extend(setValidityMixin, {
  validate: function() {
    return this._validate();
  },
  _validate: Ember.on('init', function() {
    var promises = get(this, 'content').invoke('_validate').without(undefined);
    return Ember.RSVP.all(promises);
  }),
  validators: Ember.computed.alias('content')
});

export default Ember.Mixin.create(setValidityMixin, {
  init: function() {
    this._super();
    this.errors = Errors.create();
    this.dependentValidationKeys = {};
    this.validators = Ember.A();
    if (get(this, 'validations') === undefined) {
      set(this, 'validations', {});
    }
    this.buildValidators();
    this.validators.forEach(function(validator) {
      validator.addObserver('errors.[]', this, function(sender) {
        var errors = Ember.A();
        this.validators.forEach(function(validator) {
          if (validator.property === sender.property) {
            errors.addObjects(validator.errors);
          }
        }, this);
        set(this, 'errors.' + sender.property, errors);
      });
    }, this);
  },
  buildValidators: function() {
    var property, validations = get(this, 'validations');

    for (property in validations) {
      if (validations[property].constructor === Object) {
        this.buildRuleValidator(property);
      } else {
        this.buildObjectValidator(property);
      }
    }
  },
  buildRuleValidator: function(property) {
    var validations = get(this, 'validations');
    var pushValidator = function(validator) {
      if (validator) {
        this.validators.pushObject(validator.create({model: this, property: property, options: validations[property][validatorName]}));
      }
    };

    if (validations[property].callback) {
      validations[property] = { inline: validations[property] };
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

    for (var validatorName in validations[property]) {
      if (validatorName === 'inline') {
        pushValidator.call(this, createInlineClass(validations[property][validatorName].callback));
      } else if (validations[property].hasOwnProperty(validatorName)) {
        lookupValidator.call(this, validatorName).forEach(pushValidator, this);
      }
    }
  },
  buildObjectValidator: function(property) {
    if (Ember.isNone(get(this, property))) {
      this.addObserver(property, this, pushValidatableObject);
    } else {
      pushValidatableObject(this, property);
    }
  },
  validate: function() {
    var self = this;
    return this._validate().then(function(vals) {
      var errors = get(self, 'errors');
      if (vals.indexOf(false) > -1) {
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
