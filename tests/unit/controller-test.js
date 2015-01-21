import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:foo', 'Controller sanity test', {
  needs: ['ember-validations@validator:local/presence']
});

test('does not blow up', function() {
  var controller = this.subject();
  ok(controller);
});
