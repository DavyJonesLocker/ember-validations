(function() {
var user, User;

module('Conditional validations', {
  setup: function() {
    User = Ember.Object.extend(Ember.Validations.Mixin);
  }
});

asyncTest('if with function', function() {
  expect(4);
  User.reopen({
    validations: {
      firstName: {
        presence: {
          if: function(model) {
            return false;
          }
        }
      }
    }
  });

  Ember.run(function(){
    user = User.create();
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), []);
      var validator = user.validators.get('firstObject');
      validator.conditionals['if'] = function(model, property) {
        equal(user, model, "the conditional validator is passed the model being validated");
        equal(property, 'firstName', "the conditional validator is passed the name of the property being validated");
        return true;
      };
      user.validate().then(null, function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('if with property reference', function() {
  User.reopen({
    validations: {
      firstName: {
        presence: {
          if: 'canValidate'
        }
      }
    }
  });


  Ember.run(function(){
    user = User.create();
    user.set('canValidate', false);
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), []);
      user.set('canValidate', true);
      user.validate().then(null, function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('if with function reference', function() {
  User.reopen({
    validations: {
      firstName: {
        presence: {
          if: 'canValidate'
        }
      }
    },
    canValidate: function() {
      return false;
    }
  });

  Ember.run(function(){
    user = User.create();
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), []);
      user.set('canValidate', true);
      user.canValidate = function() {
        return true;
      };
      user.validate().then(null, function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('unless with function', function() {
  expect(4);
  User.reopen({
    validations: {
      firstName: {
        presence: {
          unless: function(model) {
            return true;
          }
        }
      }
    }
  });

  Ember.run(function(){
    user = User.create();
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), []);
      var validator = user.validators.get('firstObject');
      validator.conditionals['unless'] = function(model, property) {
        equal(user, model, "the conditional validator is passed the model being validated");
        equal(property, 'firstName', "the conditional validator is passed the name of the property being validated");
        return false;
      };
      user.validate().then(null, function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('unless with property reference', function() {
  User.reopen({
    validations: {
      firstName: {
        presence: {
          unless: 'canValidate'
        }
      }
    },
    canValidate: true
  });

  Ember.run(function(){
    user = User.create();
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), []);
      user.set('canValidate', false);
      user.validate().then(null, function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

asyncTest('unless with function reference', function() {
  User.reopen({
    validations: {
      firstName: {
        presence: {
          unless: 'canValidate'
        }
      }
    },
    canValidate: function() {
      return true;
    }
  });

  Ember.run(function(){
    user = User.create();
    user.validate().then(function(){
      deepEqual(user.errors.get('firstName'), []);
      user.set('canValidate', true);
      user.canValidate = function() {
        return false;
      };
      user.validate().then(null, function(){
        deepEqual(user.errors.get('firstName'), ["can't be blank"]);
        start();
      });
    });
  });
});

})();

(function() {
var user, User;

module('Errors test', {
  setup: function() {
    User = Ember.Object.extend(Ember.Validations.Mixin, {
      validations: {
        name: {
          presence: true
        },
        age: {
          presence: true,
          numericality: true
        }
      }
    });
  },
  teardown: function() {
    delete Ember.I18n;
  }
});

test('validations are run on instantiation', function() {
  Ember.run(function() {
    user = User.create();
  });
  equal(user.get('isValid'), false);
  deepEqual(user.get('errors.name'), ["can't be blank"]);
  deepEqual(user.get('errors.age'), ["can't be blank", 'is not a number']);
  Ember.run(function() {
    user = User.create({name: 'Brian', age: 33});
  });
  ok(user.get('isValid'));
  deepEqual(user.get('errors.name'), []);
  deepEqual(user.get('errors.age'), []);
});

test('when errors are resolved', function() {
  Ember.run(function() {
    user = User.create();
  });
  equal(user.get('isValid'), false);
  deepEqual(user.get('errors.name'), ["can't be blank"]);
  deepEqual(user.get('errors.age'), ["can't be blank", 'is not a number']);
  Ember.run(function() {
    user.set('name', 'Brian');
  });
  equal(user.get('isValid'), false);
  deepEqual(user.get('errors.name'), []);
  deepEqual(user.get('errors.age'), ["can't be blank", 'is not a number']);
  Ember.run(function() {
    user.set('age', 'thirty three');
  });
  equal(user.get('isValid'), false);
  deepEqual(user.get('errors.name'), []);
  deepEqual(user.get('errors.age'), ['is not a number']);
  Ember.run(function() {
    user.set('age', 33);
  });
  ok(user.get('isValid'));
  deepEqual(user.get('errors.name'), []);
  deepEqual(user.get('errors.age'), []);
});

test('validations use Ember.I18n.t to render the message if Ember.I18n is present', function() {
  Ember.I18n = {
    translations: {
      errors: {
        blank: 'muss ausgefüllt werden',
        notANumber: 'ist keine Zahl'
      }
    },
    lookupKey: function(key, hash) {
      var firstKey, idx, remainingKeys;

      if (hash[key] !== null && hash[key] !== undefined) { return hash[key]; }

      if ((idx = key.indexOf('.')) !== -1) {
        firstKey = key.substr(0, idx);
        remainingKeys = key.substr(idx + 1);
        hash = hash[firstKey];
        if (hash) { return Ember.I18n.lookupKey(remainingKeys, hash); }
      }
    },
    t: function(key, context) {
      return Ember.I18n.lookupKey(key, Ember.I18n.translations);
    }
  };
  
  Ember.run(function() {
    user = User.create();
  });
  equal(user.get('isValid'), false);
  deepEqual(user.get('errors.name'), ['muss ausgefüllt werden']);
  deepEqual(user.get('errors.age'), ['muss ausgefüllt werden', 'ist keine Zahl']);
  Ember.run(function() {
    user.set('age', 'thirty three');
  });
  equal(user.get('isValid'), false);
  deepEqual(user.get('errors.age'), ['ist keine Zahl']);
});

})();

(function() {
var user, User;

module('Validate test', {
  setup: function() {
    User = Ember.Object.extend(Ember.Validations.Mixin, {
      validations: {
        firstName: {
          presence: true,
          length: 5
        },
        lastName: {
          format: { with: /\w+/ }
        }
      }
    });
    Ember.run(function() {
      user = User.create();
    });
  }
});

asyncTest('returns a promise', function() {
  Ember.run(function(){
    user.validate().then(function(){
      ok(false, 'expected validation failed');
    }, function() {
      equal(user.get('isValid'), false);
      start();
    });
  });
});

test('isInvalid tracks isValid', function() {
  equal(user.get('isInvalid'), true);
  Ember.run(function() {
    user.setProperties({firstName: 'Brian', lastName: 'Cardarella'});
  });
  equal(user.get('isInvalid'), false);
});

asyncTest('runs all validations', function() {
  Ember.run(function(){
    user.validate().then(null, function(errors){
      deepEqual(errors.get('firstName'), ["can't be blank", 'is the wrong length (should be 5 characters)']);
      deepEqual(errors.get('lastName'), ["is invalid"]);
      equal(user.get('isValid'), false);
      user.set('firstName', 'Bob');
      user.validate('firstName').then(null, function(errors){
        deepEqual(errors.get('firstName'), ['is the wrong length (should be 5 characters)']);
        equal(user.get('isValid'), false);
        user.set('firstName', 'Brian');
        user.set('lastName', 'Cardarella');
        user.validate().then(function(errors){
          deepEqual(errors.get('firstName'), []);
          deepEqual(errors.get('lastName'), []);
          equal(user.get('isValid'), true);
          start();
        });
      });
    });
  });
});

test('can be mixed into an object controller', function() {
  var Controller, controller, user;
  Controller = Ember.ObjectController.extend(Ember.Validations.Mixin, {
    validations: {
      name: {
        presence: true
      }
    }
  });

  Ember.run(function() {
    controller = Controller.create();
  });
  equal(controller.get('isValid'), false);
  user = Ember.Object.create();
  Ember.run(function() {
    controller.set('content', user);
  });
  equal(controller.get('isValid'), false);
  Ember.run(function() {
    user.set('name', 'Brian');
  });
  equal(controller.get('isValid'), true);
});

module('Array controller');

test('can be mixed into an array controller', function() {
  var Controller, controller, container, user, UserController;
  container = new Ember.Container();
  UserController = Ember.ObjectController.extend(Ember.Validations.Mixin, {
    validations: {
      name: {
        presence: true
      }
    }
  });
  container.register('controller:User', UserController);
  Controller = Ember.ArrayController.extend(Ember.Validations.Mixin, {
    itemController: 'User',
    container: container,
    validations: {
      '[]': true
    }
  });

  Ember.run(function() {
    controller = Controller.create();
  });
  equal(controller.get('isValid'), true);
  user = Ember.Object.create();
  Ember.run(function() {
    controller.pushObject(user);
  });
  equal(controller.get('isValid'), false);
  Ember.run(function() {
    user.set('name', 'Brian');
  });
  equal(controller.get('isValid'), true);
  Ember.run(function() {
    user.set('name', undefined);
  });
  equal(controller.get('isValid'), false);
  Ember.run(function() {
    controller.get('content').removeObject(user);
  });
  equal(controller.get('isValid'), true);
});

var Profile, profile;

module('Relationship validators', {
  setup: function() {
    Profile = Ember.Object.extend(Ember.Validations.Mixin, {
      validations: {
        title: {
          presence: true
        }
      }
    });

    Ember.run(function() {
      profile = Profile.create({hey: 'yo'});
    });

    User = Ember.Object.extend(Ember.Validations.Mixin);
  }
});

test('validates other validatable property', function() {
  Ember.run(function() {
    user = User.create({
      validations: {
        profile: true
      }
    });
  });
  equal(user.get('isValid'), true);
  Ember.run(function() {
    user.set('profile', profile);
  });
  equal(user.get('isValid'), false);
  Ember.run(function() {
    profile.set('title', 'Developer');
  });
  equal(user.get('isValid'), true);
});

// test('validates custom validator', function() {
  // Ember.run(function() {
    // user = User.create({
      // profile: profile,
      // validations: [AgeValidator]
    // });
  // });
  // equal(user.get('isValid'), false);
  // Ember.run(function() {
    // user.set('age', 22);
  // });
  // equal(user.get('isValid'), true);
// });

test('validates array of validable objects', function() {
  var friend1, friend2;

  Ember.run(function() {
    user = User.create({
      validations: {
        friends: true
      }
    });
  });

  equal(user.get('isValid'), true);

  Ember.run(function() {
    user.set('friends', Ember.makeArray());
  });

  equal(user.get('isValid'), true);

  Ember.run(function() {
    friend1 = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  Ember.run(function() {
    user.friends.pushObject(friend1);
  });

  equal(user.get('isValid'), false);

  Ember.run(function() {
    friend1.set('name', 'Stephanie');
  });

  equal(user.get('isValid'), true);

  Ember.run(function() {
    friend2 = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });

    user.friends.pushObject(friend2);
  });

  equal(user.get('isValid'), false);

  Ember.run(function() {
    user.friends.removeObject(friend2);
  });

  equal(user.get('isValid'), true);
});


test('revalidates arrays when they are replaced', function() {
  var friend1, friend2;

  Ember.run(function() {
    user = User.create({
      validations: {
        friends: true
      }
    });
  });

  equal(user.get('isValid'), true);

  Ember.run(function() {
    user.set('friends', Ember.makeArray());
  });

  equal(user.get('isValid'), true);

  Ember.run(function() {
    friend1 = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });
  });

  Ember.run(function() {
    user.set('friends', [friend1]);
  });

  equal(user.get('isValid'), false);

  Ember.run(function() {
    friend1.set('name', 'Stephanie');
  });

  equal(user.get('isValid'), true);

  Ember.run(function() {
    friend2 = User.create({
      validations: {
        name: {
          presence: true
        }
      }
    });

    user.set('friends', [friend1, friend2]);
  });

  equal(user.get('isValid'), false);

  Ember.run(function() {
    user.friends.removeObject(friend2);
  });

  equal(user.get('isValid'), true);
});

})();

(function() {
var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Absence Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function() {
  options = { message: 'failed validation' };
  Ember.run(function(){
    validator = Ember.Validations.validators.local.Absence.create({model: model, property: 'attribute', options: options});
  });
  deepEqual(validator.errors, []);
  Ember.run(function() {
    model.set('attribute', 'not empty');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when value is made empty', function() {
  model.set('attribute', 'not empty');
  options = { message: 'failed validation' };
  Ember.run(function(){
    validator = Ember.Validations.validators.local.Absence.create({model: model, property: 'attribute', options: options});
    model.set('attribute', undefined);
  });
  deepEqual(validator.errors, []);
});

test('when options is true', function() {
  options = true;
  Ember.run(function(){
    validator = Ember.Validations.validators.local.Absence.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'not empty');
  });
  deepEqual(validator.errors, ["must be blank"]);
});

})();

(function() {
var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Acceptance Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when attribute is true', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Acceptance.create({model: model, property: 'attribute', options: options});
    model.set('attribute', true);
  });
  deepEqual(validator.errors, []);
});

test('when attribute is not true', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Acceptance.create({model: model, property: 'attribute', options: options});
    model.set('attribute', false);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when attribute is value of 1', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Acceptance.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 1);
  });
  deepEqual(validator.errors, []);
});

test('when attribute value is 2 and accept value is 2', function() {
  options = { message: 'failed validation', accept: 2 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Acceptance.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 2);
  });
  deepEqual(validator.errors, []);
});

test('when attribute value is 1 and accept value is 2', function() {
  options = { message: 'failed validation', accept: 2 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Acceptance.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 1);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is true', function() {
  options = true;
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Acceptance.create({model: model, property: 'attribute', options: options});
    model.set('attribute', false);
  });
  deepEqual(validator.errors, ['must be accepted']);
});

test('when no message is passed', function() {
  options = { accept: 2 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Acceptance.create({model: model, property: 'attribute', options: options});
    model.set('attribute', false);
  });
  deepEqual(validator.errors, ['must be accepted']);
});

})();

(function() {
var model, Model, options, CustomValidator, validator;

module('Base Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    CustomValidator = Ember.Validations.validators.Base.extend({
      init: function() {
        this._super();
        this._dependentValidationKeys.pushObject('otherAttribute');
      },
      call: function() {}
    });
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function() {
  Ember.run(function() {
    validator = CustomValidator.create({model: model, property: 'attribute'});
  });
  equal(validator.get('isValid'), true);
});

test('generates _dependentValidationKeys on the model', function() {
  Ember.run(function() {
    validator = CustomValidator.create({model: model, property: 'attribute'});
  });
  deepEqual(model.get('_dependentValidationKeys'), {attribute: ['otherAttribute']});
});

test('inactive validators should be considered valid', function() {
  var canValidate = true;
  Ember.run(function() {
    validator = CustomValidator.createWithMixins({
      model: model,
      property: 'attribute',
      canValidate: function() {
        return canValidate;
      },
      call: function() {
        this.errors.pushObject("nope");
      }
    });
  });
  equal(validator.get('isValid'), false);
  canValidate = false;
  Ember.run(validator, 'validate');
  equal(validator.get('isValid'), true);
});



})();

(function() {
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

})();

(function() {
var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Exclusion Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is not in the list', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 4);
  });
  deepEqual(validator.errors, []);
});

test('when value is in the list', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 1);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3], allowBlank: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
  });
  deepEqual(validator.errors, []);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when value is not in the range', function() {
  options = { 'message': 'failed validation', 'range': [1, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 4);
  });
  deepEqual(validator.errors, []);
});

test('when value is in the range', function() {
  options = { 'message': 'failed validation', 'range': [1, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 1);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is an array', function() {
  options = [1, 2, 3];
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is reserved']);
});

test('when no message is passed', function() {
  options = { in: [1, 2, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Exclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is reserved']);
});

})();

(function() {
var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Format Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when matching format', function() {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Format.create({model: model, property: 'attribute', options: options});
    model.set('attribute',  '123');
  });
  deepEqual(validator.errors, []);
});

test('when not matching format', function() {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Format.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'abc');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowing blank', function() {
  options = { 'message': 'failed validation', 'with': /\d+/, 'allowBlank': true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Format.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation', 'with': /\d+/ };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Format.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is regexp', function() {
  options = /\d+/;
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Format.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is invalid']);
});

test('when no message is passed', function() {
  options = { 'with': /\d+/ };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Format.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is invalid']);
});

})();

(function() {
var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Inclusion Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is in the list', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 1);
  });
  deepEqual(validator.errors, []);
});

test('when value is not in the list', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 4);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3], allowBlank: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation', 'in': [1, 2, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when value is in the range', function() {
  options = { 'message': 'failed validation', 'range': [1, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 1);
  });
  deepEqual(validator.errors, []);
});

test('when value is not in the range', function() {
  options = { 'message': 'failed validation', 'range': [1, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 4);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is array', function() {
  options = [1, 2, 3];
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is not included in the list']);
});

test('when no message is passed', function() {
  options = { in: [1, 2, 3] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Inclusion.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is not included in the list']);
});

})();

(function() {
var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Length Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when allowed length is 3 and value length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '123');
  });
  deepEqual(validator.errors, []);
});

test('when allowed length is 3 and value length is 4', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '1234');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowed length is 3 and value length is 2', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '12');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowing blank and allowed length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3, allowBlank: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when allowing blank and minimum length is 3 and maximum length is 100', function() {
  options = { messages: { tooShort: 'failed minimum validation', tooLong: 'failed maximum validation' }, minimum: 3, maximum: 100, allowBlank: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when not allowing blank and allowed length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowed length is 3 and a different tokenizer', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3, tokenizer: function(value) { return value.split(' '); } };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'one two three');
  });
  deepEqual(validator.errors, []);
});

test('when allowed length minimum is 3 and value length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '123');
  });
  deepEqual(validator.errors, []);
});

test('when allowed length minimum is 3 and value length is 2', function() {
  options = { messages: { tooShort: 'failed validation' }, minimum: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '12');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowed length maximum is 3 and value length is 3', function() {
  options = { messages: { wrongLength: 'failed validation' }, is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '123');
  });
  deepEqual(validator.errors, []);
});

test('when allowed length maximum is 3 and value length is 4', function() {
  options = { messages: { tooLong: 'failed validation' }, maximum: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '1234');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when allowed length maximum is 3 and value is blank', function() {
  options = { maximum: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when options is a number', function() {
  model.set('attribute', '1234');
  options = 3;
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is the wrong length (should be 3 characters)']);
});

test('when options is a number and value is undefined', function() {
  options = 3;
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is the wrong length (should be 3 characters)']);
});

test('when allowed length is 3, value length is 4 and no message is set', function() {
  options = { is: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '1234');
  });
  deepEqual(validator.errors, ['is the wrong length (should be 3 characters)']);
});

test('when allowed length minimum is 3, value length is 2 and no message is set', function() {
  options = { minimum: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '12');
  });
  deepEqual(validator.errors, ['is too short (minimum is 3 characters)']);
});

test('when allowed length maximum is 3, value length is 4 and no message is set', function() {
  options = { maximum: 3 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '1234');
  });
  deepEqual(validator.errors, ['is too long (maximum is 3 characters)']);
});

test('when using a property instead of a number', function() {
  options = { is: 'countProperty' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Length.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '123');
  });
  deepEqual(validator.errors, ['is the wrong length (should be 0 characters)']);
  Ember.run(function() {
    model.set('countProperty', 3);
  });
  deepEqual(validator.errors, []);
  Ember.run(function() {
    model.set('countProperty', 5);
  });
  deepEqual(validator.errors, ['is the wrong length (should be 5 characters)']);
});

})();

(function() {
var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('Numericality Validator', {
  setup: function() {
    Model =  Ember.Object.extend(validator = Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is a number', function() {
  options = { messages: { numericality: 'failed validation' } };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 123);
  });
  deepEqual(validator.errors, []);
});

test('when value is a decimal number', function() {
  options = { messages: { numericality: 'failed validation' } };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 123.456);
  });
  deepEqual(validator.errors, []);
});

test('when value is not a number', function() {
  options = { messages: { numericality: 'failed validation' } };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'abc123');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when no value', function() {
  options = { messages: { numericality: 'failed validation' } };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when no value and allowing blank', function() {
  options = { messages: { numericality: 'failed validation' }, allowBlank: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when bad value and allowing blank', function() {
  options = { messages: { numericality: 'failed validation' }, allowBlank: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'abc123');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing integers and value is integer', function() {
  options = { messages: { onlyInteger: 'failed validation', numericality: 'failed validation' }, onlyInteger: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 123);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing integers and value is not integer', function() {
  options = { messages: { onlyInteger: 'failed integer validation', numericality: 'failed validation' }, onlyInteger: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 123.456);
  });
  deepEqual(validator.errors, ['failed integer validation']);
});

test('when only integer and no message is passed', function() {
  options = { onlyInteger: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 1.1);
  });
  deepEqual(validator.errors, ['must be an integer']);
});

test('when only integer is passed directly', function() {
  options = 'onlyInteger';
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 1.1);
  });
  deepEqual(validator.errors, ['must be an integer']);
});

test('when only allowing values greater than 10 and value is greater than 10', function() {
  options = { messages: { greaterThan: 'failed validation', numericality: 'failed validation' }, greaterThan: 10 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values greater than 10 and value is 10', function() {
  options = { messages: { greaterThan: 'failed validation', numericality: 'failed validation' }, greaterThan: 10 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing values greater than or deepEqual to 10 and value is 10', function() {
  options = { messages: { greaterThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, greaterThanOrEqualTo: 10 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values greater than or deepEqual to 10 and value is 9', function() {
  options = { messages: { greaterThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, greaterThanOrEqualTo: 10 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 9);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing values less than 10 and value is less than 10', function() {
  options = { messages: { lessThan: 'failed validation', numericality: 'failed validation' }, lessThan: 10 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 9);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values less than 10 and value is 10', function() {
  options = { messages: { lessThan: 'failed validation', numericality: 'failed validation' }, lessThan: 10 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing values less than or deepEqual to 10 and value is 10', function() {
  options = { messages: { lessThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, lessThanOrEqualTo: 10 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values less than or deepEqual to 10 and value is 11', function() {
  options = { messages: { lessThanOrEqualTo: 'failed validation', numericality: 'failed validation' }, lessThanOrEqualTo: 10 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 11);
  deepEqual(validator.errors, ['failed validation']);
  });
});

test('when only allowing values equal to 10 and value is 10', function() {
  options = { messages: { equalTo: 'failed validation', numericality: 'failed validation' }, equalTo: 10 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing values equal to 10 and value is 11', function() {
  options = { messages: { equalTo: 'failed equal validation', numericality: 'failed validation' }, equalTo: 10 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, ['failed equal validation']);
});

test('when only allowing value equal to 0 and value is 1', function() {
  options = { messages: { equalTo: 'failed equal validation', numericality: 'failed validation' }, equalTo: 0 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 1);
  });
  deepEqual(validator.errors, ['failed equal validation']);
});

test('when only allowing odd values and the value is odd', function() {
  options = { messages: { odd: 'failed validation', numericality: 'failed validation' }, odd: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing odd values and the value is even', function() {
  options = { messages: { odd: 'failed validation', numericality: 'failed validation' }, odd: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when only allowing even values and the value is even', function() {
  options = { messages: { even: 'failed validation', numericality: 'failed validation' }, even: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, []);
});

test('when only allowing even values and the value is odd', function() {
  options = { messages: { even: 'failed validation', numericality: 'failed validation' }, even: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when value refers to another present property', function() {
  options   = { messages: { greaterThan: 'failed to be greater', numericality: 'failed validation' }, greaterThan: 'attribute_2' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute_1', options: options});
    model.set('attribute_1', 0);
    model.set('attribute_2', 1);
  });
  deepEqual(validator.errors, ['failed to be greater']);
  Ember.run(function() {
    model.set('attribute_1', 2);
    model.set('attribute_2', 1);
  });
  deepEqual(validator.errors, []);
});

test('when options is true', function() {
  options = true;
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['is not a number']);
});

test('when equal to  and no message is passed', function() {
  options = { equalTo: 11 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['must be equal to 11']);
});

test('when greater than and no message is passed', function() {
  options = { greaterThan: 11 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['must be greater than 11']);
});

test('when greater than or equal to and no message is passed', function() {
  options = { greaterThanOrEqualTo: 11 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['must be greater than or equal to 11']);
});

test('when less than and no message is passed', function() {
  options = { lessThan: 10 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, ['must be less than 10']);
});

test('when less than or equal to and no message is passed', function() {
  options = { lessThanOrEqualTo: 10 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, ['must be less than or equal to 10']);
});

test('when odd and no message is passed', function() {
  options = { odd: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 10);
  });
  deepEqual(validator.errors, ['must be odd']);
});

test('when even and no message is passed', function() {
  options = { even: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 11);
  });
  deepEqual(validator.errors, ['must be even']);
});

test('when other messages are passed but not a numericality message', function() {
  options = { messages: { greaterThan: 'failed validation' } };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'abc');
  });
  deepEqual(validator.errors, ['is not a number']);
});

test("numericality validators don't call addObserver on null props", function() {
  expect(1);

  var stubbedObserverCalled = false;

  var realAddObserver = Ember.addObserver;
  Ember.addObserver = function(_, path) {
    stubbedObserverCalled = true;
    if (!path) {
      ok(false, "shouldn't call addObserver with falsy path");
    }
    return realAddObserver.apply(this, arguments);
  };

  options = { lessThanOrEqualTo: 10 };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Numericality.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 11);
  });
  Ember.addObserver = realAddObserver;

  ok(stubbedObserverCalled, "stubbed addObserver was called");
});


})();

(function() {
var model, Model, options, validator;

module('Presence Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

test('when value is not empty', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Presence.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'not empty');
  });
  deepEqual(validator.errors, []);
});

test('when value is empty', function() {
  options = { message: 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Presence.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when options is true', function() {
  options = true;
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Presence.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ["can't be blank"]);
});

})();

(function() {
// module('Uniqueness options', {
  // setup: function() {
    // Ember.Validations.forms['new_user'] = {
      // type: 'ActionView::Helpers::FormBuilder',
      // input_tag: '<div class="field_with_errors"><span id="input_tag" /><label class="message"></label></div>',
      // label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
      // validators: {'user[email]':{"uniqueness":[{"message": "must be unique", "scope":{'name':"pass"}}]},"presence":[{"message": "must be present"}]}
    // }

    // $('#qunit-fixture')
      // .append($('<form />', {
        // action: '/users',
        // 'data-validate': true,
        // method: 'post',
        // id: 'new_user'
      // }))
      // .find('form')
        // .append($('<input />', {
          // name: 'user[name]',
          // id: 'user_name',
          // type: 'text'
        // }))
        // .append($('<input />', {
          // name: 'user[email]',
          // id: 'user_email',
          // type: 'text'
        // }))

    // $('form#new_user').call();
  // }
// });

// test('when matching uniqueness on a non-nested resource', function() {
  // var element = $('<input type="text" name="user[email]"/>');
  // var options = { 'message': "failed validation" };
  // element.val('nottaken@test.com');
  // equal(Ember.Validations.validators.remote.uniqueness(model, property, options), undefined);
// });

// test('when matching uniqueness on a non-nested resource', function() {
  // var element = $('<input type="text" name="user[email]"/>');
  // var options = { 'message': "failed validation" };
  // element.val('taken@test.com');
  // equal(Ember.Validations.validators.remote.uniqueness(model, property, options), "failed validation");
// });

// test('when matching uniqueness on a nested singular resource', function() {
  // var element = $('<input type="text" name="profile[user_attributes][email]"/>');
  // var options = { 'message': "failed validation" };
  // element.val('nottaken@test.com');
  // equal(Ember.Validations.validators.remote.uniqueness(model, property, options), undefined);
// });

// test('when matching uniqueness on a nested singular resource', function() {
  // var element = $('<input type="text" name="profile[user_attributes][email]"/>');
  // var options = { 'message': "failed validation" };
  // element.val('taken@test.com');
  // equal(Ember.Validations.validators.remote.uniqueness(model, property, options), "failed validation");
// });

// test('when using scopes with no replacement', function() {
  // var element = $('<input type="text" name="person[age]" />');
  // var options = { 'message': "failed validation", 'with': /\d+/, 'scope': { 'name': 'test name' } };
  // element.val('test');
  // equal(Ember.Validations.validators.remote.uniqueness(model, property, options), "failed validation");
// });

// test('when using scopes with replacement', function() {
  // var element = $('<input type="text" name="person[age]" />');
  // var options = { 'message': "failed validation", 'with': /\d+/, 'scope': { 'name': 'test name' } };
  // element.val('test')
  // $('#qunit-fixture').append('<input type="text" name="person[name]" />').find('input[name="person[name]"]').val('other name');
  // equal(Ember.Validations.validators.remote.uniqueness(model, property, options), undefined);
// });

// test('when validating by scope and mixed focus order', function() {
  // var unique_element = $('#user_email'), scope_element = $('#user_name');
  // unique_element.val('free@test.com');
  // unique_element.trigger('change');
  // unique_element.trigger('focusout');
  // equal($('.message[for="user_email"]').text(), '');

  // scope_element.val('test name');
  // scope_element.trigger('change');
  // scope_element.trigger('focusout');
  // equal($('.message[for="user_email"]').text(), 'must be unique');
// });

// test('when using scopes with replacement as checkboxes', function() {
  // var element = $('<input type="text" name="person[age]" />');
  // var options = { 'message': "failed validation", 'with': /\d+/, 'scope': { 'name': 'test name' } };
  // element.val('test')
  // $('#qunit-fixture')
    // .append('<input type="hidden" name="person[name]" value="other name"')
    // .append('<input type="checkbox" name="person[name]" value="test name"/>')
    // .find('input[name="person[name]"]').val('other name');
  // equal(Ember.Validations.validators.remote.uniqueness(model, property, options), undefined);
  // $('[name="person[name]"]:checkbox')[0].checked = true;
  // equal(Ember.Validations.validators.remote.uniqueness(model, property, options), 'failed validation');
// });

// test('when matching uniqueness on a resource with a defined class name', function() {
  // var element = $('<input type="text" name="user2[email]"/>');
  // var options = { 'message': "failed validation", 'class': "active_record_test_module/user2" };
  // element.val('nottaken@test.com');
  // equal(Ember.Validations.validators.remote.uniqueness(model, property, options), 'failed validation');
// });

// test('when allowing blank', function() {
 // var element = $('<input type="text" name="user2[email]" />');
 // var options = { 'message': "failed validation", 'with': /\d+/, 'allowBlank': true };
 // equal(Ember.Validations.validators.remote.uniqueness(model, property, options), undefined);
// });

// test('when not allowing blank', function() {
 // var element = $('<input type="text" name="user2[email]" />');
 // var options = { 'message': "failed validation", 'with': /\d+/ };
 // equal(Ember.Validations.validators.remote.uniqueness(model, property, options), "failed validation");
// });

// test('when matching local uniqueness for nested has-many resources', function() {
  // $('#qunit-fixture')
    // .append($('<form />', {
      // action: '/users',
      // 'data-validate': true,
      // method: 'post',
      // id: 'new_user_2'
    // }))
    // .find('form')
      // .append($('<input />', {
        // name: 'profile[user_attributes][0][email]',
        // id: 'user_0_email',
      // }))
      // .append($('<input />', {
        // name: 'profile[user_attributes][1][email]',
        // id: 'user_1_email',
      // }));

  // Ember.Validations.forms['new_user_2'] = {
    // type: 'ActionView::Helpers::FormBuilder',
    // input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
    // label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
    // validators: { 'user[email]':{"uniqueness":[{"message": "must be unique"}]}}
  // }
  // $('form#new_user_2').call();

  // var user_0_email = $('#user_0_email'),
      // user_1_email = $('#user_1_email'),
      // options = { 'message': "must be unique" };

  // user_0_email.val('not-locally-unique');
  // user_1_email.val('not-locally-unique');

  // equal(Ember.Validations.validators.remote.uniqueness(user_1_email, options), undefined);
  // equal(Ember.Validations.validators.local.uniqueness(user_1_email, options), "must be unique");
// });

})();

(function() {
var model, Model, options, validator;
var pass = function() {
  ok(true, 'validation is working');
};
var fail = function() {
  ok(false, 'validation is not working');
};

module('URL Validator', {
  setup: function() {
    Model = Ember.Object.extend(Ember.Validations.Mixin);
    Ember.run(function() {
      model = Model.create();
    });
  }
});

// Test allowBlank

test('when allowing blank', function() {
  options = { 'message': 'failed validation', allowBlank: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, []);
});

test('when not allowing blank', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', '');
  });
  deepEqual(validator.errors, ['failed validation']);
});

// Test with valid URLs

test('when valid url with domain', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com');
  });
  deepEqual(validator.errors, []);
});

test('when valid uri with domain and port', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com');
  });
  deepEqual(validator.errors, []);
});

test('when valid uri with domain, port and path', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com/path/to/file.html');
  });
  deepEqual(validator.errors, []);
});

test('when valid uri with domain, port, path and query', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com/path/to/file.html?one=two&three=four');
  });
  deepEqual(validator.errors, []);
});

test('when valid uri with domain, port, path, query and fragment', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com/path/to/file.html?one=two&three=four#anchor=drop');
  });
  deepEqual(validator.errors, []);
});


// Tests to fail validation

test('when uri has space', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://example . com');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when protocol not valid', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'invalid://www.example.com');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when domain not valid', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.******.com');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when port not valid', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com:PORT');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when path not valid', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com/path to file');
  });
  deepEqual(validator.errors, ['failed validation']);
});

test('when query not valid', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com/path/to/file.html?one two');
  });
  deepEqual(validator.errors, ['failed validation']);
});


test('when anchor not valid', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com/path/to/file.html?one=two&three=four#anchor drop');
  });
  deepEqual(validator.errors, ['failed validation']);
});


// Test domainOnly

test('when domain only', function() {
  options = { 'message': 'failed validation', domainOnly: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'www.example.com');
  });
  deepEqual(validator.errors, []);
});

test('when domain only not valid', function() {
  options = { 'message': 'failed validation', domainOnly: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com');
  });
  deepEqual(validator.errors, ['failed validation']);
});

// Protocols

test('when defined protocols', function() {
  options = { 'message': 'failed validation', protocols: ['https'] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'https://www.example.com');
  });
  deepEqual(validator.errors, []);
});

test('when defined protocols not valid', function() {
  options = { 'message': 'failed validation', protocols: ['https'] };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com');
  });
  deepEqual(validator.errors, ['failed validation']);
});


// Test allowPort

test('when port allowed', function() {
  options = { 'message': 'failed validation', allowPort: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com:80');
  });
  deepEqual(validator.errors, []);
});


test('when port not allowed', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://www.example.com:80');
  });
  deepEqual(validator.errors, ['failed validation']);
});

// Test allowUserPass

test('when username and password allowed', function() {
  options = { 'message': 'failed validation', allowUserPass: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://username:password@example.com');
  });
  deepEqual(validator.errors, []);
});


test('when username and password not allowed', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://username:password@example.com');
  });
  deepEqual(validator.errors, ['failed validation']);
});


// Test allowIp

test('when IP allowed', function() {
  options = { 'message': 'failed validation', allowIp: true };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://127.0.0.1');
  });
  deepEqual(validator.errors, []);
});


test('when IP not allowed', function() {
  options = { 'message': 'failed validation' };
  Ember.run(function() {
    validator = Ember.Validations.validators.local.Url.create({model: model, property: 'attribute', options: options});
    model.set('attribute', 'http://127.0.0.1');
  });
  deepEqual(validator.errors, ['failed validation']);
});

})();

