FactoryBot.define do
  factory :personal_info do
    association :application

    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    email { Faker::Internet.unique.email }
    phone_number { Faker::Number.number(digits: 10).to_s }
    dob { Faker::Date.birthday(min_age: 18, max_age: 65) }
    ssn { Faker::Number.number(digits: 9).to_s }
  end
end
