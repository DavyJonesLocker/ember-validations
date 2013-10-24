require 'bundler/setup'
require 'ember-dev/tasks'

task :clean => 'ember:clean'
task :dist => 'ember:dist'
task :test, [:suite] => 'ember:test'
task :default => 'ember:test'
task :test_site => 'ember:generate_static_test_site'
