# Ember Validations #

[![Build Status](https://secure.travis-ci.org/dockyard/ember-validations.png?branch=master)](http://travis-ci.org/dockyard/ember-validations)

## Getting a build ##

[Please choose from our list of builds for Ember-Validations](http://builds.dockyard.com)

## Building yourself ##

You will require Ruby to be installed on your system. If it is please
run the following:

```bash
gem install bundler
git clone git://github.com/dockyard/ember-validations.git
cd ember-validations
bundle install
bundle exec rake dist
```

The builds will be in the `dist/` directory.

## Looking for help? ##

If it is a bug [please open an issue on GitHub](https://github.com/dockyard/ember-validations/issues).

## Usage ##

You need to mixin `Ember.Validations.Mixin` into any controller you want to add
validations to:

```javascript
var App.UserController = Ember.ObjectController.extend(Ember.Validations.Mixin);
```

You define your validations as a JSON object. They should be added to
the controller that represents the model in question.
The keys in the object should map to properties. If you pass a
JSON object as the value this will be seen as validation rules to apply
to the property. If you pass `true` then the property itself will be
seen as a validatable object.

```javascript
App.UserController.reopen({
  validations: {
    firstName: {
      presence: true,
      length: { minimum: 5 }
    },
    age: {
      numericality: true
    },
    profile: true
  }
});
```

## Validators ##

The currently supported validators

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
`property`

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
numericality: { odd: true, messages: { odd: 'must be an odd number' } }
numericality: { onlyInteger, greaterThan: 5, lessThanOrEqualTo : 10 }
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

### URL ##

Validates the property has a value that is a URL.

#### Options ####
  * `allowBlank` - If `true` skips validation if value is empty
  * `allowIp` - Passing `true` will validate URLs using IP address. By default, IP addresses will be invalid.
  * `allowUserPass` - Passing `true` will validate URLs with username / passwords. By default, usernames and password will be invalid.
  * `allowPort` - If `true` will validate URLs with ports. By default, URLs with ports will be invalid.
  * `domainOnly` - If `true` will only allow domains/sub-domains to be valid. URLs with protocols, ports or paths will be invalid.
  * `protocols` - An array with accepted protocols. Default protocols are `http` and `https`.

```javascript
// Examples
url { allowUserPass: true }
url { allowBlank: true, allowIp: true, allowPort: true, protocols: ['http', 'https', 'ftp'] }
url { domainOnly: true }
```

### Conditional Validators ##

Each validator can take an `if` or an `unless` in its `options` hash.
The value of the conditional can be an inline function, a string that
represents a property on the object, or a string that represents a
function on the object. The result should be a boolean.

```javascript
// function form
firstName: {
  presence: {
    if: function(object, validator) {
      return true;
    }
  }
}

// string form
// if 'canValidate' is a function on the object it will be called
// if 'canValidate' is a property object.get('canValidate') will be called
firstName: {
  presence: {
    unless: 'canValidate'
  }
}
```

## Running Validations

Validations will automatically run when the object is created and when
each property changes. `isValid` states bubble up and help define the
direct parent's validation state. `isInvalid` is also available for convenience.

If you want to force all validations to run simply call `.validate()` on the object. `isValid` will be set to `true`
or `false`. All validations are run as deferred objects, so the validations will
not be completed when `validate` is done. So `validate` returns a promise, call `then`
with a function containing the code you want to run after the validations have
completed.

```javascript
user.validate().then(function() {
  user.get('isValid'); // true
  user.get('isInvalid'); // false
})
```

## Inspecting Errors ##

After mixing in `Ember.Validations.Mixin` into your object it will now have a
`.errors` object. All validation error messages will be placed in there
for the corresponding property. Errors messages will always be an array.

```javascript
App.User = Ember.Object.extend(Ember.Validations.Mixin, {
  validations: {
    firstName: { presence: true }
  }
});

user = App.User.create();
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

## i18n ##

When you use [ember-i18n](https://github.com/jamesarosen/ember-i18n) your `Ember.I18n.translations` object should contain the following keys under the `errors` key:

```javascript
Ember.I18n.translations = {
  errors:
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
````

## Authors ##

* [Brian Cardarella](http://twitter.com/bcardarella)

[We are very thankful for the many contributors](https://github.com/dockyard/ember-validations/graphs/contributors)

## Versioning ##

This library follows [Semantic Versioning](http://semver.org)

## Want to help? ##

Please do! We are always looking to improve this gem. Please see our
[Contribution Guidelines](https://github.com/dockyard/ember-validations/blob/master/CONTRIBUTING.md)
on how to properly submit issues and pull requests.

## Legal ##

[DockYard](http://dockyard.com), LLC &copy; 2013

[@dockyard](http://twitter.com/dockyard)

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)
