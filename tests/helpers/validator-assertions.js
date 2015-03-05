export { pass, fail };

function pass (assert) {
  assert.ok(true, 'validation is working');
}

function fail (assert) {
  assert.ok(false, 'validation is not working');
}
