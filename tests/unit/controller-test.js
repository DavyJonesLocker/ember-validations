import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:foo', 'Controller sanity test', {
  integration: true
});

test('does not blow up', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
