# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts 'Seeding users...'

loan_officer = User.find_or_initialize_by(email: 'loan.officer@example.com')
loan_officer.assign_attributes(
  first_name: 'Loan',
  last_name: 'Officer',
  phone_number: '1112223333',
  password: 'Password123!',
  password_confirmation: 'Password123!',
  role: :loan_officer
)
loan_officer.save!

underwriter = User.find_or_initialize_by(email: 'underwriter@example.com')
underwriter.assign_attributes(
  first_name: 'Under',
  last_name: 'Writer',
  phone_number: '4445556666',
  password: 'Password123!',
  password_confirmation: 'Password123!',
  role: :underwriter
)
underwriter.save!

puts '✔ Loan officer and underwriter created successfully'
