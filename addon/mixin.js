import Ember from 'ember';
import Errors from 'ember-validations/errors';
import Base from 'ember-validations/validators/base';

const {
  A,
  ArrayProxy,
  EnumerableUtils,
  Mixin,
  RSVP,
  isArray,
  isEmpty,
  isNone,
  computed,
  on,
  warn
} = Ember;

const {
  alias,
  not
} = computed;

const get = Ember.get;
const set = Ember.set;

const setValidityMixin = Mixin.create({
  isValid: computed('validators.@each.isValid', function() {
    const compactValidators = get(this, 'validators').compact();
    const filteredValidators = EnumerableUtils.filter(compactValidators, function(validator) {
      return !get(validator, 'isValid');
    });

    return get(filteredValidators, 'length') === 0;
  }),

  isInvalid: not('isValid')
});

const ArrayValidatorProxy = ArrayProxy.extend(setValidityMixin, {
  validate() {
    return this._validate();
  },

  _validate: on('init', function() {
    const promises = get(this, 'content').invoke('_validate').without(undefined);
    return RSVP.all(promises);
  }),
  validators: alias('content')
});

const pushValidatableObject = function(model, property) {
  const content = get(model, property);

  model.removeObserver(property, pushValidatableObject);
  if (isArray(content)) {
    model.validators.pushObject(ArrayValidatorProxy.create({ model, property, contentBinding: `model.${property}` }));
  } else {
    model.validators.pushObject(content);
  }
};

const lookupValidator = function(validatorName) {
  const container = get(this, 'container');
  const service = container.lookup('service:validations');
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
    let local = container.lookupFactory(`validator:local/${validatorName}`);
    let remote = container.lookupFactory(`validator:remote/${validatorName}`);

    if (local || remote) {
      validators = validators.concat([local, remote]);
    } else {
      const base = container.lookupFactory(`validator:${validatorName}`);

      if (base) {
        validators = validators.concat([base]);
      } else {
        local = container.lookupFactory(`ember-validations@validator:local/${validatorName}`);
        remote = container.lookupFactory(`ember-validations@validator:remote/${validatorName}`);

        if (local || remote) {
          validators = validators.concat([local, remote]);
        }
      }
    }

    cache[validatorName] = validators;
  }

  if (isEmpty(validators)) {
    warn(`Could not find the "${validatorName}" validator.`);
  }

  return validators;
};

export default Mixin.create(setValidityMixin, {
  init() {
    this._super();
    this.errors = Errors.create();
    this.dependentValidationKeys = {};
    this.validators = A();
    if (get(this, 'validations') === undefined) {
      this.validations = {};
    }
    this.buildValidators();
    this.validators.forEach(function(validator) {
      validator.addObserver('errors.[]', this, function(sender) {
        const errors = A();
        this.validators.forEach(function(validator) {
          if (validator.property === sender.property) {
            errors.addObjects(validator.errors);
          }
        }, this);
        set(this, `errors.${sender.property}`, errors);
      });
    }, this);
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
    const pushValidator = function(validator) {
      if (validator) {
        this.validators.pushObject(validator.create({ model: this, property, options: this.validations[property][validatorName] }));
      }
    };

    if (this.validations[property].callback) {
      this.validations[property] = { inline: this.validations[property] };
    }

    const createInlineClass = function(callback) {
      return Base.extend({
        call() {
          const errorMessage = this.callback.call(this);

          if (errorMessage) {
            this.errors.pushObject(errorMessage);
          }
        },

        callback
      });
    };

    // jscs:disable
    for (var validatorName in this.validations[property]) {
      // jscs:enable
      if (validatorName === 'inline') {
        pushValidator.call(this, createInlineClass(this.validations[property][validatorName].callback));
      } else if (this.validations[property].hasOwnProperty(validatorName)) {
        EnumerableUtils.forEach(lookupValidator.call(this, validatorName), pushValidator, this);
      }
    }
  },
  buildObjectValidator(property) {
    if (isNone(get(this, property))) {
      this.addObserver(property, this, pushValidatableObject);
    } else {
      pushValidatableObject(this, property);
    }
  },

  validate() {
    const self = this;
    return this._validate().then(function(vals) {
      const errors = get(self, 'errors');
      if (EnumerableUtils.indexOf(vals, false) > -1) {
        return RSVP.reject(errors);
      }
      return errors;
    });
  },

  _validate: on('init', function() {
    const promises = this.validators.invoke('_validate').without(undefined);
    return RSVP.all(promises);
  })
});
