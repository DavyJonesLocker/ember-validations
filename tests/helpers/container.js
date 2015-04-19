import Ember from 'ember';
import resolver from './resolver';

function buildContainer() {
  return new Ember.Container(buildRegistry());
}

function buildRegistry() {
  var registry = new Ember.Registry();
  registry.resolver = buildResolver();
  registry.normalizeFullName = registry.resolver.normalize;
  registry.describe = registry.resolver.describe;
  registry.makeToString = registry.resolver.makeToString;

  return registry;
}

function buildResolver() {
  function resolve(fullname) {
    return resolver.resolve(fullname);
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
      return fullName;
    }
  };

  resolve.__resolver__ = resolver;

  return resolve;
}

export { buildContainer };
