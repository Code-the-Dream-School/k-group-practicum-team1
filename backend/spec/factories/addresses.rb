FactoryBot.define do
  factory :address do
    street { Faker::Address.street_address }
    city {  Faker::Address.city  }
    state { Faker::Address.state_abbr }
    zip { Faker::Address.zip_code }

    application { nil }

    trait :with_application do
      association :application
    end
  end
end
