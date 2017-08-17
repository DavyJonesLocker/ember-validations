import Ember from 'ember';
import Errors from 'ember-validations/errors';
import Base from 'ember-validations/validators/base';

const {
  A: emberArray,
  ArrayProxy,
  Mixin,
  RSVP: { all, reject },
  computed,
  computed: { alias, not },
  get,
  isArray,
  isNone,
  isPresent,
  set,
  warn
} = Ember;

const setValidityMixin = Mixin.create({
  isValid: computed('validators.@each.isValid', function() {
    let compactValidators = get(this, 'validators').compact();
    let filteredValidators = compactValidators.filter((validator) => !get(validator, 'isValid'));

    return get(filteredValidators, 'length') === 0;
  }),

  isInvalid: not('isValid')
});

const pushValidatableObject = function(model, property) {
  let content = get(model, property);

  model.removeObserver(property, pushValidatableObject);

  if (isArray(content)) {
    model.validators.pushObject(ArrayValidatorProxy.create({ model, property, contentBinding: `model.${property}` }));
  } else {
    model.validators.pushObject(content);
  }
};

const lookupValidator = function(validatorName) {
  let owner = Ember.getOwner(this);
  let service = owner.lookup('service:validations');
  let validators = [];
  let cache;

  if (service) {
    cache = get(service, 'cache');
  } else {
    cache = {};
  }

  if (cache[validatorName]) {
    validators = validators.concat(cache[validatorName]);
  } else {
    let local = owner.resolveRegistration(`validator:local/${validatorName}`);
    let remote = owner.resolveRegistration(`validator:remote/${validatorName}`);

    if (local || remote) {
      validators = validators.concat([local, remote]);
    } else {
      let base = owner.resolveRegistration(`validator:${validatorName}`);

      if (base) {
        validators = validators.concat([base]);
      } else {
        local = owner.resolveRegistration(`ember-validations@validator:local/${validatorName}`);
        remote = owner.resolveRegistration(`ember-validations@validator:remote/${validatorName}`);

        if (local || remote) {
          validators = validators.concat([local, remote]);
        }
      }
    }

    cache[validatorName] = validators;
  }

  warn(`Could not find the "${validatorName}" validator.`, isPresent(validators), {
    id: 'ember-validations.faild-to-find-validator'
  });

  return validators;
};

const ArrayValidatorProxy = ArrayProxy.extend(setValidityMixin, {
  init() {
    this._validate();
  },

  validate() {
    return this._validate();
  },

  _validate() {
    let promises = get(this, 'content').invoke('_validate').without(undefined);
    return all(promises);
  },

  validators: alias('content')
});

export default Mixin.create(setValidityMixin, {

  init() {
    this._super(...arguments);
    this.errors = Errors.create();
    this.dependentValidationKeys = {};
    this.validators = emberArray();

    if (get(this, 'validations') === undefined) {
      this.validations = {};
    }

    this.buildValidators();

    this.validators.forEach((validator) => {
      validator.addObserver('errors.[]', this, function(sender) {
        let errors = emberArray();

        this.validators.forEach((validator) => {
          if (validator.property === sender.property) {
            errors.addObjects(validator.errors);
          }
        });

        set(this, `errors.${sender.property}`, errors);
      });
    });

    this._validate();
  },

  buildValidators() {
    let property;

    for (property in this.validations) {
      if (this.validations[property].constructor === Object) {
        this.buildRuleValidator(property);
      } else {
        this.buildObjectValidator(property);
      }
    }
  },

  buildRuleValidator(property) {
    let pushValidator = (validator, validatorName) => {
      if (validator) {
        this.validators.pushObject(validator.create({ model: this, property, options: this.validations[property][validatorName] }));
      }
    };

    if (this.validations[property].callback) {
      this.validations[property] = { inline: this.validations[property] };
    }

    let createInlineClass = (callback) => {
      return Base.extend({
        call() {
          let errorMessage = this.callback.call(this);

          if (errorMessage) {
            this.errors.pushObject(errorMessage);
          }
        },

        callback
      });
    };

    Object.keys(this.validations[property]).forEach((validatorName) => {
      if (validatorName === 'inline') {
        let validator = createInlineClass(this.validations[property][validatorName].callback);
        pushValidator(validator, validatorName);
      } else if (this.validations[property].hasOwnProperty(validatorName)) {
        lookupValidator.call(this, validatorName).forEach((validator) => {
          return pushValidator.call(this, validator, validatorName);
        });
      }
    });
  },

  buildObjectValidator(property) {
    if (isNone(get(this, property))) {
      this.addObserver(property, this, pushValidatableObject);
    } else {
      pushValidatableObject(this, property);
    }
  },

  validate() {
    return this._validate().then((vals) => {
      let errors = get(this, 'errors');

      if (vals.indexOf(false) > -1) {
        return reject(errors);
      }

      return errors;
    });
  },

  _validate() {
    let promises = this.validators.invoke('_validate').without(undefined);
    return all(promises);
  }
});
