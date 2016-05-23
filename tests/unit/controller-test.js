import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:foo', 'Controller sanity test', {
  needs: [
    'service:validations',
    'ember-validations@service:validations/messages',
    'ember-validations@validator:local/presence'
  ]
});

test('does not blow up', function(assert) {
  var controller = this.subject();
  assert.ok(controller);
});
