import Ember from 'ember';
import Resolver from 'ember/resolver';

function buildContainer() {
  var container = new Ember.Container();
  container.resolver = buildResolver();
  container.normalizeFullName = container.resolver.normalize;
  container.describe = container.resolver.describe;
  container.makeToString = container.resolver.makeToString;

  return container;
}

function buildResolver() {
  var resolver = Resolver.create({
    namespace: Ember.Namespace.create({
      modulePrefix: 'dummy'
    })
  });

  function resolve(fullName) {
    return resolver.resolve(fullName);
  }

  resolve.describe = function(fullName) {
    return resolver.lookupDescription(fullName);
  };

  resolve.makeToString = function(factory, fullName) {
    return resolver.makeToString(factory, fullName);
  };

  resolve.normalize = function(fullName) {
    if (resolver.normalize) {
      return resolver.normalize(fullName);
    } else {
      Ember.deprecate('The Resolver should now provide a \'normalize\' function', false);
      return fullName;
    }
  };

  resolve.__resolver__ = resolver;

  return resolve;
}

export { buildContainer };
