FactoryBot.define do
  factory :user do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    email { Faker::Internet.unique.email }
    password { 'Password123!' }
    password_confirmation { 'Password123!' }
    phone_number { Faker::Number.number(digits: 10).to_s }
    role { :customer }

    trait :customer do
      role { :customer }
    end

    trait :loan_officer do
      role { :loan_officer }
    end

    trait :underwriter do
      role { :underwriter }
    end
  end
end
