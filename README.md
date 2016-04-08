# Ember Validations #

[![Build Status](https://secure.travis-ci.org/dockyard/ember-validations.svg?branch=master)](http://travis-ci.org/dockyard/ember-validations)

## Building yourself ##

```bash
npm install
bower install
ember build
```

The builds will be in the `dist/` directory.

## Installing ##

#### With Ember-CLI ####

If you are using
[`ember-cli`](https://github.com/stefanpenner/ember-cli) you can add
`ember-validations` to your `package.json`:

```javascript
"devDependencies": {
  ...
  "ember-validations": "~ 2.0.0"
}
```

You may want to be more precise with your version locking.

#### Without Ember-CLI ####

We will continue to build `EmberValidations` to the DockYard build
server until `ember-cli` is officially recommended by Ember. You can
select a build version from:
[http://builds.dockyard.com](http://builds.dockyard.com) for use in
Bower.

## Looking for help? ##

If it is a bug [please open an issue on GitHub](https://github.com/dockyard/ember-validations/issues).

## Usage ##

You need to mixin `EmberValidations` into any `Ember.Object` you want to add
validations to:

```javascript
import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations);
```

You define your validations as a JSON object. They should be added to
the controller that represents the model in question.
The keys in the object should map to properties. If you pass a
JSON object as the value this will be seen as validation rules to apply
to the property. If you pass `true` then the property itself will be
seen as a validatable object.

```javascript
import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations, {
  validations: {
    'model.firstName': {
      presence: true,
      length: { minimum: 5 }
    },
    'model.age': {
      numericality: true
    },
    'model.profile': true
  }
});
```

Though not yet explicitly part of the API, you can also add validators
to nested objects:

```javascript
import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
  validations: {
    'user.firstName': {
      presence: true,
      length: { minimum: 5 }
    }
  }
});
```

This is useful for things like Components which don't act as proxies, but
again, until this is officially built into the project, YMMV.

**Note: If you override the init function, you must call _super()**

```javascript
import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations, {
  init: function() {
    // this call is necessary, don't forget it!
    this._super.apply(this, arguments);

    // Your init code...
  }
});
```

## Validators ##

### Absence ###
Validates the property has a value that is `null`, `undefined`, or `''`

#### Options ####
  * `true` - Passing just `true` will activate validation and use default message
  * `message` - Any string you wish to be the error message. Overrides `i18n`.

```javascript
// Examples
absence: true
absence: { message: 'must be blank' }
```

### Acceptance ###
By default the values `'1'`, `1`, and `true` are the acceptable values

#### Options ####
  * `true` - Passing just `true` will activate validation and use default message
  * `message` - Any string you wish to be the error message. Overrides `i18n`.
  * `accept` - the value for acceptance

```javascript
// Examples
acceptance: true
acceptance: { message: 'you must accept', accept: 'yes' }
```

### Confirmation ###
Expects a `propertyConfirmation` to have the same value as
`property`. The validation must be applied to the `property`, not the `propertyConfirmation` (otherwise it would expect a `propertyConfirmationConfirmation`).

#### Options ####
  * `true` - Passing just `true` will activate validation and use default message
  * `message` - Any string you wish to be the error message. Overrides `i18n`.

```javascript
// Examples
confirmation: true
confirmation: { message: 'you must confirm' }
```

### Exclusion ###
A list of values that are not allowed

#### Options ####
  * `message` - Any string you wish to be the error message. Overrides `i18n`.
  * `allowBlank` - If `true` skips validation if value is empty
  * `in` - An array of values that are excluded
  * `range` - an array with the first element as the lower bound the and second element as the upper bound. Any value that falls within the range will be considered excluded

```javascript
// Examples
exclusion: { in: ['Yellow', 'Black', 'Red'] }
exclusion: { range: [5, 10], allowBlank: true, message: 'cannot be between 5 and 10' }
```

### Format ###
A regular expression to test with the value

#### Options ####
  * `message` - Any string you wish to be the error message. Overrides `i18n`.
  * `allowBlank` - If `true` skips validation if value is empty
  * `with` - The regular expression to test with

```javascript
// Examples
format: { with: /^([a-zA-Z]|\d)+$/, allowBlank: true, message: 'must be letters and numbers only'  }
```

### Inclusion ###
A list of the only values allowed

#### Options ####
  * `message` - Any string you wish to be the error message. Overrides `i18n`.
  * `allowBlank` - If `true` skips validation if value is empty
  * `in` - An array of values that are allowed
  * `range` - an array with the first element as the lower bound the and
second element as the upper bound. Only values that fall within the range will be considered allowed

```javascript
// Examples
inclusion: { in: ['Yellow', 'Black', 'Red'] }
inclusion: { range: [5, 10], allowBlank: true, message: 'must be between 5 and 10' }
```

### Length ###
Define the lengths that are allowed

#### Options ####
  * `number` - Alias for `is`
  * `array` - Will expand to `minimum` and `maximum`. First element is the lower bound, second element is the upper bound.
  * `allowBlank` - If `true` skips validation if value is empty
  * `minimum` - The minimum length of the value allowed
  * `maximum` - The maximum length of the value allowed
  * `is` - The exact length of the value allowed
  * `tokenizer` - A function that should return a object that responds to `length`

##### Messages #####
  * `tooShort` - the message used when the `minimum` validation fails. Overrides `i18n`
  * `tooLong` - the message used when the `maximum` validation fails. Overrides `i18n`
  * `wrongLength` - the message used when the `is` validation fails. Overrides `i18n`

```javascript
// Examples
length: 5
length: [3, 5]
length: { is: 10, allowBlank: true }
length: { minimum: 3, maximum: 5, messages: { tooShort: 'should be more than 3 characters', tooLong: 'should be less than 5 characters' } }
length: { is: 5, tokenizer: function(value) { return value.split(''); } }
```

### Numericality ###
Will ensure the value is a number

#### Options ####
  * `true` - Passing just `true` will activate validation and use default message
  * `allowBlank` - If `true` skips validation if value is empty
  * `onlyInteger` - Will only allow integers
  * `greaterThan` - Ensures the value is greater than
  * `greaterThanOrEqualTo` - Ensures the value is greater than or equal to
  * `equalTo` - Ensures the value is equal to
  * `lessThan` - Ensures the value is less than
  * `lessThanOrEqualTo` - Ensures the value is less than or equal to
  * `odd` - Ensures the value is odd
  * `even` - Ensures the value is even

##### Messages #####
  * `numericality` - Message used when value failes to be a number. Overrides `i18n`
  * `onlyInteger` -  Message used when value failes to be an integer. Overrides `i18n`
  * `greaterThan` - Message used when value failes to be greater than. Overrides `i18n`
  * `greaterThanOrEqualTo` - Message used when value failes to be greater than or equal to. Overrides `i18n`
  * `equalTo` - Message used when value failes to be equal to. Overrides `i18n`
  * `lessThan` - Message used when value failes to be less than. Overrides `i18n`
  * `lessThanOrEqualTo` - Message used when value failes to be less than or equal to. Overrides `i18n`
  * `odd` - Message used when value failes to be odd. Overrides `i18n`
  * `even` - Message used when value failes to be even. Overrides `i18n`

```javascript
// Examples
numericality: true
numericality: { messages: { numericality: 'must be a number' } }
numericality: { odd: true, messages: { odd: 'must be an odd number' } }
numericality: { onlyInteger: true, greaterThan: 5, lessThanOrEqualTo : 10 }
```

### Presence ###
Validates the property has a value that is not `null`, `undefined`, or `''`

#### Options ####
  * `true` - Passing just `true` will activate validation and use default message
  * `message` - Any string you wish to be the error message. Overrides `i18n`.

```javascript
// Examples
presence: true
presence: { message: 'must not be blank' }
```

### Uniqueness ###

*Not yet implemented.*

### Conditional Validators ##

Each validator can take an `if` or an `unless` in its `options` hash.
The value of the conditional can be an inline function, a string that
represents a property on the object, or a string that represents a
function on the object. The result should be a boolean.

**note that `if` is considered a keyword in IE8 and so you should put it
in quotes**

```javascript
// function form
'model.firstName': {
  presence: {
    'if': function(object, validator) {
      return true;
    }
  }
}

// string form
// if 'canValidate' is a function on the object it will be called
// if 'canValidate' is a property object.get('canValidate') will be called
'model.firstName': {
  presence: {
    unless: 'canValidate'
  }
}
```

### Custom Validators ###

### With Ember-CLI ###

You can place your custom validators into
`my-app/app/validators/{local,remote}/<name>`:

```javascript
import Base from 'ember-validations/validators/base';

export default Base.extend({
  // ...
});
```

It is recommended that you separate between `local` and `remote`
validators. However, if you wish you can place your validator into
`my-app/app/validators/<name>`. However, any similarly named validator
in `local/` or `remote/` has a higher lookup presedence over those in
`validators/`.

The "native" validators that come with `ember-validations` have the
lowest lookup priority.

### Without Ember-CLI ###

You can add your validators to the global object:

```javascript
EmberValidations.validators.local.<ClassName> =
EmberValidations.validators.Base.extend({
  // ...
});
```

### Creating ###

To create a new validator you need to override the `call` function. When
the validator is run its `call` function is what handles determining if
the validator is valid or not. Call has access to `this.model`,
`this.property`. If the validation fails you **must** push the failing
message onto the validator's `this.errors` array. A simple example of a
validator could be:

```javascript
import Base from 'ember-validations/validators/base';
import Ember from 'ember';

export default Base.extend({
  call: function() {
    if (Ember.isBlank(this.model.get(this.property))) {
      this.errors.pushObject("cannot be blank");
    }
  }
});
```

You may want to create a more complex validator that can observer for
changes on multiple properties. You should override the `init` function
to accomplish this:

```javascript
import Base from 'ember-validations/validators/base';
import Ember from 'ember';

export default Base.extend({
  init: function() {
    // this call is necessary, don't forget it!
    this._super();

    this.dependentValidationKeys.pushObject(this.options.alsoWatch);
  },
  call: function() {
    if (Ember.isBlank(this.model.get(this.property))) {
      this.errors.pushObject("cannot be blank");
    }
  }
});
```

The `init` function is given access to the `this.options` wich is simply
a POJO of the options passed to the validator.
`dependentValidationKeys` is the collection of paths relative to
`this.model` that will be observed for changes. If any changes occur on
any given path the validator will automatically trigger.

#### Inline Validators ####

If you want to create validators inline you can use the
`validator` function that is part of the `ember-validations` export:

```javascript
import EmberValidations, { validator } from 'ember-validations';

User.create({
  validations: {
    'model.name': {
      inline: validator(function() {
        if (this.model.get('canNotDoSomething')) {
          return "you can't do this!"
        }
      })
    }
  }
});
```

Inside the `validator` function you have access to `this.model` which is
a reference to the model. You **must** return an error message that will
be attached to the errors array for the property it is created on.
Return nothing for the validator to pass.

Alternatively if the property doesn't have any additional validations
you can use a more concise syntax:

```javascript
User.create({
  validations: {
    'model.name': EmberValidations.validator(function() {
      if (this.model.get('canNotDoSomething')) {
        return "you can't do this!"
      }
    })
  }
});
```

## Running Validations

Validations will automatically run when the object is created and when
each property changes. `isValid` states bubble up and help define the
direct parent's validation state. `isInvalid` is also available for convenience.

If you want to force all validations to run simply call `.validate()` on the object. `isValid` will be set to `true`
or `false`. All validations are run as deferred objects, so the validations will
not be completed when `validate` is done. So `validate` returns a promise, call `then`
with a function containing the code you want to run after the validations have successfully
completed.

```javascript
user.validate().then(function() {
  // all validations pass
  user.get('isValid'); // true
}).catch(function() {
  // any validations fail
  user.get('isValid'); // false
}).finally(function() {
  // all validations complete
  // regardless of isValid state
 user.get('isValid'); // true || false
});
```

## Inspecting Errors ##

After mixing in `EmberValidations` into your object it will now have a
`.errors` object. All validation error messages will be placed in there
for the corresponding property. Errors messages will always be an array.

```javascript
import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Object.extend(EmberValidations, {
  validations: {
    'model.firstName': { presence: true }
  }
});
```

```javascript
import User from 'my-app/models/user';

user = User.create();
user.validate().then(null, function() {
  user.get('isValid'); // false
  user.get('errors.firstName'); // ["can't be blank"]
  user.set('firstName', 'Brian');
  user.validate().then(function() {
    user.get('isValid'); // true
    user.get('errors.firstName'); // []
  })
})

```

## Testing ##

#### With Ember QUnit ####

For Ember Validations to work with [Ember QUnit](https://github.com/rwjblue/ember-qunit),
you must define all your validations in the `needs` property of the `moduleFor`
call. This will ensure Ember QUnit's isolated container will be able to locate
the validations during testing.

```javascript
import { test, moduleFor } from 'ember-qunit';

moduleFor('controller:user/edit', 'UserEditController', {
  needs: ['service:validations',
          'ember-validations@validator:local/presence',
          'ember-validations@validator:local/length',
          'validator:local/name',
          'validator:local/email'
          ]
});

test('Controller Test', function() { ... });
```

Where `UserEditController` uses the built-in `presence` and `length` validators,
and the locally defined `name` and `email` validators.

#### Test Helpers ####

To test whether your Ember validations are working correctly, you can
use the test helpers:

**`testValidPropertyValues(propertyName, values [, context ])`**

**`testInvalidPropertyValues(propertyName, values [, context ])`**

* `propertyName` (String): the property that you are validating.
* `values` (Array): an array of property values to check.
* `context` (function) _optional_: if specified, this function will be
  called with the object under test as an argument. See example below.

```javascript
import { test, moduleFor } from 'ember-qunit';
import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

moduleFor('controller:user', 'UserController', {
  needs: ['ember-validations@validator:local/presence',
          'ember-validations@validator:local/length'
         ]
});

testValidPropertyValues('firstName', ['Winston', '12345']);
testInvalidPropertyValues('firstName', ['abc', '', null, undefined]);
```

If a property's validation relies on another property, you can pass a
context to the test helper:

```javascript
testValidPropertyValues('lastName', ['Dog', '12345'], function(subject) {
  subject.set('firstName', 'Boomer');
});

testValidPropertyValues('lastName', ['', null, undefined], function(subject) {
  subject.set('firstName', null);
});
```

## i18n ##

When you use [ember-i18n](https://github.com/jamesarosen/ember-i18n) your `Ember.I18n.translations` object should contain the following keys under the `errors` key:

```javascript
Ember.I18n.translations = {
  errors: {
    inclusion: "is not included in the list",
    exclusion: "is reserved",
    invalid: "is invalid",
    confirmation: "doesn't match {{attribute}}",
    accepted: "must be accepted",
    empty: "can't be empty",
    blank: "can't be blank",
    present: "must be blank",
    tooLong: "is too long (maximum is {{count}} characters)",
    tooShort: "is too short (minimum is {{count}} characters)",
    wrongLength: "is the wrong length (should be {{count}} characters)",
    notANumber: "is not a number",
    notAnInteger: "must be an integer",
    greaterThan: "must be greater than {{count}}",
    greaterThanOrEqualTo: "must be greater than or equal to {{count}}",
    equalTo: "must be equal to {{count}}",
    lessThan: "must be less than {{count}}",
    lessThanOrEqualTo: "must be less than or equal to {{count}}",
    otherThan: "must be other than {{count}}",
    odd: "must be odd",
    even: "must be even"
  }
}
````

## Other Resources ##

* [Six-part screencast series on ember-validations](https://www.emberscreencasts.com/tags/form-validations)

## Authors ##

* [Brian Cardarella](http://twitter.com/bcardarella)

[We are very thankful for the many contributors](https://github.com/dockyard/ember-validations/graphs/contributors)

## Versioning ##

This library follows [Semantic Versioning](http://semver.org)

## Want to help? ##

Please do! We are always looking to improve this library. Please see our
[Contribution Guidelines](https://github.com/dockyard/ember-validations/blob/master/CONTRIBUTING.md)
on how to properly submit issues and pull requests.

## Legal ##

[DockYard](http://dockyard.com/ember-consulting), LLC &copy; 2013

[@dockyard](http://twitter.com/dockyard)

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)
