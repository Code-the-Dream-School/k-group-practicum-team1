# /k-group-practicum-team1/backend/spec/rails_helper.rb
# SimpleCov must be started BEFORE requiring any application code
require "simplecov"

SimpleCov.start "rails" do
  enable_coverage :branch
  minimum_coverage line: 80, branch: 70
  minimum_coverage_by_file 70

  add_group "Models", "app/models"
  add_group "Controllers", "app/controllers"
  add_group "Services", "app/services"
  add_group "Policies", "app/policies"

  add_filter "/spec/"
  add_filter "/config/"
  add_filter "/db/"
  add_filter "/vendor/"
end

SimpleCov.at_exit do
  SimpleCov.result.format!

  result = SimpleCov.result
  line_coverage = result.covered_percent
  branch_stats = result.coverage_statistics[:branch]
  branch_coverage = branch_stats ? branch_stats.percent : 0
  models_coverage = result.groups["Models"]&.covered_percent || 0
  controllers_coverage = result.groups["Controllers"]&.covered_percent || 0

  puts "\n" + "=" * 70
  puts "COVERAGE REPORT"
  puts "=" * 70
  puts "Line Coverage:        #{line_coverage.round(2)}% (threshold: 80%)"
  puts "Branch Coverage:      #{branch_coverage.round(2)}% (threshold: 70%)"
  puts "Models Coverage:      #{models_coverage.round(2)}% (threshold: 90%)"
  puts "Controllers Coverage: #{controllers_coverage.round(2)}% (threshold: 90%)"
  puts "=" * 70

  # Per-file coverage report
  files_below_threshold = []
  result.files.each do |file|
    file_coverage = file.covered_percent
    short_path = file.filename.sub(SimpleCov.root + "/", "")
    files_below_threshold << [ short_path, file_coverage ] if file_coverage < 70
  end

  if files_below_threshold.any?
    puts "\nFILES BELOW 70% THRESHOLD:"
    puts "-" * 70
    files_below_threshold.sort_by { |_, pct| pct }.each do |path, pct|
      puts "  #{pct.round(2).to_s.rjust(6)}% - #{path}"
    end
    puts "-" * 70
  else
    puts "\nAll files meet 70% minimum coverage threshold."
  end

  puts "\nPER-FILE COVERAGE (sorted by coverage %):"
  puts "-" * 70
  result.files.sort_by(&:covered_percent).first(10).each do |file|
    short_path = file.filename.sub(SimpleCov.root + "/", "")
    puts "  #{file.covered_percent.round(2).to_s.rjust(6)}% - #{short_path}"
  end
  puts "  ... (showing lowest 10 files)"
  puts "-" * 70

  failed = false

  if line_coverage < 80
    warn "COVERAGE FAILED: Line coverage #{line_coverage.round(2)}% is below 80% threshold"
    failed = true
  end

  if branch_coverage < 70
    warn "COVERAGE FAILED: Branch coverage #{branch_coverage.round(2)}% is below 70% threshold"
    failed = true
  end

  if models_coverage < 90
    warn "COVERAGE FAILED: Models coverage #{models_coverage.round(2)}% is below 90% threshold"
    failed = true
  end

  if controllers_coverage < 90
    warn "COVERAGE FAILED: Controllers coverage #{controllers_coverage.round(2)}% is below 90% threshold"
    failed = true
  end

  exit 1 if failed
end

require "spec_helper"
ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
abort("The Rails environment is running in production mode!") if Rails.env.production?
require "rspec/rails"

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
  config.fixture_paths = [ Rails.root.join("spec/fixtures") ]
  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
end

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end
