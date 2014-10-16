require 'bundler/setup'
require 'ember-dev/tasks'

task :publish_build => [:dist, 'ember:generate_static_test_site'] do
  root_dir = Pathname.new(__FILE__).dirname
  dist_dir = root_dir.join('dist')

  files = %w{ember-validations.js ember-validations-spade.js
             ember-validations-tests.js ember-validations-tests.html}

  EmberDev::Publish.to_s3({
    :access_key_id => ENV['S3_ACCESS_KEY_ID'],
    :secret_access_key => ENV['S3_SECRET_ACCESS_KEY'],
    :bucket_name => ENV['S3_BUCKET_NAME'],
    :subdirectory => ENV['S3_FILE_PREFIX'],

    :files => files.map { |f| dist_dir.join(f) }
  })
end

task :clean => 'ember:clean'
task :dist => 'ember:dist'
task :test, [:suite] => 'ember:test'
task :default => 'ember:test'
task :test_site => 'ember:generate_static_test_site'
