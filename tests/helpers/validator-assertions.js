export { pass, fail };

function pass () {
  ok(true, 'validation is working');
}

function fail () {
  ok(false, 'validation is not working');
}
