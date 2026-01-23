FactoryBot.define do
  factory :financial_info do
    association :application

    employment_status { 'employed' }
    employer { Faker::Company.name }
    job_title { Faker::Job.title }
    years_employed { 5.5 }
    annual_income { 75000.00 }
    additional_income { 5000.00 }
    monthly_expenses { 3000.00 }
    credit_score { 'good' }

    trait :excellent_credit do
      credit_score { 'excellent' }
      annual_income { 100000.00 }
      years_employed { 10.0 }
    end

    trait :good_credit do
      credit_score { 'good' }
      annual_income { 75000.00 }
      years_employed { 5.0 }
    end

    trait :fair_credit do
      credit_score { 'fair' }
      annual_income { 50000.00 }
      years_employed { 3.0 }
    end

    trait :poor_credit do
      credit_score { 'poor' }
      annual_income { 35000.00 }
      years_employed { 1.0 }
    end

    trait :self_employed do
      employment_status { 'self_employed' }
      employer { nil }
      job_title { 'Business Owner' }
    end

    trait :unemployed do
      employment_status { 'unemployed' }
      employer { nil }
      job_title { nil }
      annual_income { 0.00 }
      years_employed { 0.0 }
    end

    trait :high_income do
      annual_income { 150000.00 }
      additional_income { 20000.00 }
    end

    trait :low_income do
      annual_income { 30000.00 }
      additional_income { 0.00 }
    end
  end
end
