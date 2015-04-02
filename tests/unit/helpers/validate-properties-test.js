import { moduleFor } from 'ember-qunit';
import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

moduleFor('controller:foo', 'Unit - Foo Controller Test', {
  needs: [
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
