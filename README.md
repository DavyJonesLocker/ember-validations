# Ember Validations #

[![Build Status](https://secure.travis-ci.org/dockyard/ember-validations.png?branch=master)](http://travis-ci.org/dockyard/ember-validations)

Validation support for Ember Objects

**Note: This is an implementation of ActiveModel::Validations from
Ruby on Rails**

_Eventually framework specific validation rules will have to be written.
Currently only Rails is supported. In future versions the validation
framework will be configurable._

Development on this library will be on-going until `1.0`. We follow
`Semantic Versioning` so expect backwards incompatible changes between
minor version bumps. Patch version bumps will not introduce backwards
incompatible changes but older minor version will not be actively
supported.

## Getting a build ##

[Please choose from our list of builds for Ember-Validations](https://github.com/dockyard/ember-builds/tree/master/validations)

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

If it is a bug [please open an issue on
GitHub](https://github.com/dockyard/ember-validations/issues). If you need help using
the gem please ask the question on
[Stack Overflow](http://stackoverflow.com). Be sure to tag the
question with `DockYard` so we can find it.

## Usage ##

You need to mixin `Ember.Validations.Mixin` into any object you want to add
validations to:

```javascript
var App.User = Ember.Object.extend(Ember.Validations.Mixin);
```

You can add validations to an object by defining the `validations`
object. The keys in the object should map to properties. The values of
the keys should be an object of validations. The keys will be the
validation name followed by the options:

```javascript
App.User.reopen({
  validations: {
    firstName: {
      presence: true,
      length: { minimum: 5 }
    },
    age: {
      numericality: true
    }
  }
}); 
```

## Validators

The currently supported validators

### Absence 
Validates the property has a value that is `null`, `undefined`, or `''`

#### Options
  * `true` - Passing just `true` will activate validation and use default message
  * `message` - Any string you wish to be the error message. Overrides `i18n`.
 
```javascript
// Examples
absence: true
absence: { message: 'must be blank' }
```

### Acceptance
By default the values `'1'`, `1`, and `true` are the acceptable values

#### Options
  * `true` - Passing just `true` will activate validation and use default message
  * `message` - Any string you wish to be the error message. Overrides `i18n`.
  * `accept` - the value for acceptance
 
```javascript
// Examples
acceptance: true
acceptance: { message: 'you must accept', accept: 'yes' }
```

### Confirmation
Expects a `propertyConfirmation` to have the same value as
`property`

#### Options
  * `true` - Passing just `true` will activate validation and use default message
  * `message` - Any string you wish to be the error message. Overrides `i18n`.
 
```javascript
// Examples
confirmation: true
confirmation: { message: 'you must confirm' }
```

### Exclusion
A list of values that are not allowed

#### Options
  * `message` - Any string you wish to be the error message. Overrides `i18n`.
  * `allowBlank` - If `true` skips validation if value is empty
  * `in` - An array of values that are excluded
  * `range` - an array with the first element as the lower bound the and second element as the upper bound. Any value that falls within the range will be considered excluded

```javascript
// Examples
exclusion: { in: ['Yellow', 'Black', 'Red'] }
exclusion: { range: [5, 10], allowBlank: true, message: 'cannot be between 5 and 10' }
```

### Format
A regular expression to test with the value

#### Options
  * `message` - Any string you wish to be the error message. Overrides `i18n`.
  * `allowBlank` - If `true` skips validation if value is empty
  * `with` - The regular expression to test with

```javascript
// Examples
format: { with: /^([a-zA-Z]|\d)+$/, allowBlank: true, message: 'must be letters and numbers only'  }
```

### Inclusion
A list of the only values allowed

#### Options
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

### Length
Define the lengths that are allowed

#### Options
  * `number` - Alias for `is`
  * `array` - Will expand to `minimum` and `maximum`. First element is the lower bound, second element is the upper bound.
  * `allowBlank` - If `true` skips validation if value is empty
  * `minimum` - The minimum length of the value allowed
  * `maximum` - The maximum length of the value allowed
  * `is` - The exact length of the value allowed
  * `tokenizer` - A function that should return a object that responds to `length`
  
##### Messages
  * `tooShort` - the message used when the `minimum` validation fails. Overrides `i18n`
  * `tooLong` - the message used when the `maximum` validation fails. Overrides `i18n`
  * `wrongLength` - the message used when the `is` validation fails. Overrides `i18n`

```javascript
// Examples
length: 5
length: [3, 5]
length: { is: 10, allowBlank: true } 
length: { minimum: 3, maximum: 5, messages { tooShort: 'should be more than 3 characters', tooLong: 'should be less than 5 characters' } }
length: { is: 5, tokenizer: function(value) { return value.split(''); } }
```

### Numericality
Will ensure the value is a number

#### Options
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

##### Messages
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

### Presence
Validates the property has a value that is not `null`, `undefined`, or `''`

#### Options
  * `true` - Passing just `true` will activate validation and use default message
  * `message` - Any string you wish to be the error message. Overrides `i18n`.
 
```javascript
// Examples
presence: true
presence: { message: 'must not be blank' }
```

### Uniqueness

Not yet implemented.

## Running Validations

Simply call `.validate()` on the object. `true` or `false` will be
returned.

```javascript
user.validate();
=> false
```

## Inspecting Errors

After mixing in `Ember.Validations.Mixin` into your object it will now have a
`.errors` object. All validation error messages will be placed in there
for the corresponding property.

```javascript
App.User = Ember.Object.extend(Ember.Validations.Mixin,
  validations:
    firstName: { presence: true }
  }
});

user = App.User.create();
user.validate();
user.get('isValid'); // false
user.errors.get('firstName'); // "can't be blank"
user.set('firstName', 'Brian');
user.validate();
user.get('isValid'); // true
user.errors.get('firstName'); // undefined
```

## Bootstrapping With Server Side Validations

You may want to bootstrap Ember objects that correspond to server-side
models with the validation rules that are already defined on the server.

`Ember-Validations` has the following interface for bootstrapping:

```javascript
App.bootstrapValidations(validations);
```

`Ember-Validations` assumes the rules are emitted in a similar JSON
format as
[ActiveModel::Serializers](https://github.com/rails-api/active_model_serializers).
This means the root keys should correspond to a snake case
representation of the object names. For example, if your app has a model
named `App.UserProfile` then the emitted validation rules should look
like:

```json
{
  'user_profile' : {
    'first_name' : {
      'presence' : true,
    }, {
    'age' : {
      'numericality' : {
        'messages' : {
          'greaterThan' : 10
        }
      }
    }
  }
}
```

Notice how the keys are all snake case. `Ember-Validations` will
camelize all of the keys appropriately. The bootstrapping will attempt
to find an object of the name taken from the root keys under your
application namespace. If any validation rules exist on the object
already those rules will take presedence if any conflicts occur from the
bootstrapped rules.

It is up to you how best to extract the rules from our server.

If you have a Ruby on Rails backend you should checkout our
[ClientSideValidations-Ember](https://github.com/dockyard/client_side_validations-ember) gem which handles the packaging and
bootstrapping automatically. 

We will list solutions for other backend frameworks as they become
available.

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
