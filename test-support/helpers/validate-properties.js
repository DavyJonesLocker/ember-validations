import Ember from 'ember';
import { test } from 'ember-qunit';

var map = Ember.EnumerableUtils.map;
var run = Ember.run;
var RSVP = Ember.RSVP;

function validateValue(object, propertyName, value, isTestForValid) {
  function handleValidation(errors) {
    var hasErrors = object.get('errors.' + propertyName + '.firstObject');
    if ((hasErrors && !isTestForValid) || (!hasErrors && isTestForValid)) {
      return value;
    }
  }

  run(object, 'set', propertyName, value);

  return object.validate().then(handleValidation, handleValidation);
}

function validateValues(object, propertyName, values, isTestForValid) {
  var promises = map(values, function(value) {
    return validateValue(object, propertyName, value, isTestForValid);
  });

  return RSVP.all(promises).then(function(validatedValues) {
    return validatedValues;
  });
}

function testPropertyValues(propertyName, values, isTestForValid, context) {
  var validOrInvalid = (isTestForValid ? 'Valid' : 'Invalid');
  var testName = validOrInvalid + ' ' + propertyName;

  test(testName, function() {
    var object = this.subject();

    if (context && typeof context === 'function') {
      context(object);
    }

    // Use QUnit.dump.parse so null and undefined can be printed as literal 'null' and
    // 'undefined' strings in the assert message.
    var valuesString = QUnit.dump.parse(values).replace(/\n(\s+)?/g, '').replace(/,/g, ', ');
    var assertMessage = 'Expected ' + propertyName + ' to have ' + validOrInvalid.toLowerCase() +
      ' values: ' + valuesString;

    return validateValues(object, propertyName, values, isTestForValid)
      .then(function(validatedValues) {
        deepEqual(validatedValues, values, assertMessage);
      });
  });
}

export function testValidPropertyValues(propertyName, values, context) {
  testPropertyValues(propertyName, values, true, context);
}

export function testInvalidPropertyValues(propertyName, values, context) {
  testPropertyValues(propertyName, values, false, context);
}
