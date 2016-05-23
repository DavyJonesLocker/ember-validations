import { moduleFor } from 'ember-qunit';
import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

var _deepEqual;

moduleFor('controller:foo', 'Unit - Foo Controller Test', {
  needs: [
    'service:validations',
    'ember-validations@service:validations/messages',
    'ember-validations@validator:local/presence',
    'ember-validations@validator:local/length'
  ]
});

testValidPropertyValues('bar', ['Winston', '12345']);

testInvalidPropertyValues('bar', ['', null, undefined, 'abc']);

testValidPropertyValues('baz', ['Winston', '12345'], function(subject) {
  subject.set('isBaz', true);
});

testInvalidPropertyValues('baz', ['', null, undefined], function(subject) {
  subject.set('isBaz', true);
});

testValidPropertyValues('baz', ['Winston', '12345', null, undefined, ''], function(subject) {
  subject.set('isBaz', false);
});


moduleFor('controller:foo', 'Unit - Ensure validate properties test helpers fail when invalid', {
  needs: [
    'service:validations',
    'ember-validations@service:validations/messages',
    'ember-validations@validator:local/presence',
    'ember-validations@validator:local/length'
  ],

  beforeEach: function(assert) {
    // use inverse of deepEqual to ensure the test helpers fail when invalid
    assert.deepEqual = assert.notDeepEqual;
  }
});

testValidPropertyValues('bar', [undefined, 'Winston', '12345']);
testValidPropertyValues('bar', ['Winston', undefined, '12345']);
testValidPropertyValues('bar', ['Winston', '12345', undefined]);

testInvalidPropertyValues('bar', ['', null, undefined, 'abc', 'Winston']);
testInvalidPropertyValues('bar', ['Winston', null, undefined, 'abc']);
testInvalidPropertyValues('bar', [null, 'Winston', undefined, 'abc']);

testInvalidPropertyValues('baz', ['Winston', '12345'], function(subject) {
  subject.set('isBaz', true);
});

testValidPropertyValues('baz', [undefined, 'Winston', '12345'], function(subject) {
  subject.set('isBaz', true);
});
testValidPropertyValues('baz', ['Winston', '12345', undefined], function(subject) {
  subject.set('isBaz', true);
});
testValidPropertyValues('baz', ['Winston', undefined, '12345'], function(subject) {
  subject.set('isBaz', true);
});

testInvalidPropertyValues('baz', ['', null, undefined, 'Winston'], function(subject) {
  subject.set('isBaz', true);
});
testInvalidPropertyValues('baz', ['Winston', null, undefined], function(subject) {
  subject.set('isBaz', true);
});
testInvalidPropertyValues('baz', ['', null, 'Winston', undefined], function(subject) {
  subject.set('isBaz', true);
});

testInvalidPropertyValues('baz', ['Winston', '12345', null, undefined, ''], function(subject) {
  subject.set('isBaz', false);
});
