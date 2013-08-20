# -*- encoding: utf-8 -*-
require './lib/ember/validations/version'

Gem::Specification.new do |gem|
  gem.name          = "ember-validations-source"
  gem.authors       = ["Brian Cardarella"]
  gem.email         = [""]
  gem.date          = Time.now.strftime("%Y-%m-%d")
  gem.summary       = %q{ember-validations source code wrapper.}
  gem.description   = %q{ember-validations source code wrapper for use with Ruby libs.}
  gem.homepage      = "https://github.com/dockyard/ember-validations"
  gem.version       = Ember::Validations::VERSION

  gem.add_dependency "ember-source"

  gem.files = %w(VERSION) + Dir['dist/ember-validations*.js', 'lib/ember/validations/*.rb']
end