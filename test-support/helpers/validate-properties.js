import Ember from 'ember';
import { test } from 'ember-qunit';

var run = Ember.run;

function validateValues(object, propertyName, values, isTestForValid) {
  var promise = null;
  var validatedValues = [];

  values.forEach(function(value) {
    function handleValidation(errors) {
      var hasErrors = object.get('errors.' + propertyName + '.firstObject');
      if ((hasErrors && !isTestForValid) || (!hasErrors && isTestForValid)) {
        validatedValues.push(value);
      }
    }

    run(object, 'set', propertyName, value);

    var objectPromise = null;
    run(function() {
      objectPromise = object.validate().then(handleValidation, handleValidation);
    });

    // Since we are setting the values in a different run loop as we are validating them,
    // we need to chain the promises so that they run sequentially. The wrong value will
    // be validated if the promises execute concurrently
    promise = promise ? promise.then(objectPromise) : objectPromise;
  });

  return promise.then(function() {
    return validatedValues;
  });
}

function testPropertyValues(propertyName, values, isTestForValid, context) {
  var validOrInvalid = (isTestForValid ? 'Valid' : 'Invalid');
  var testName = validOrInvalid + ' ' + propertyName;

  test(testName, function(assert) {
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
        assert.deepEqual(validatedValues, values, assertMessage);
      });
  });
}

export function testValidPropertyValues(propertyName, values, context) {
  testPropertyValues(propertyName, values, true, context);
}

export function testInvalidPropertyValues(propertyName, values, context) {
  testPropertyValues(propertyName, values, false, context);
}
