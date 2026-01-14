FactoryBot.define do
  factory :application do
    association :user

    sequence(:application_number) { |n| "#AL-#{Time.current.year}-#{n.to_s.rjust(5, '0')}" }

    status { 'draft' }
    application_progress { 'personal' }

    purchase_price { 25000.00 }
    down_payment { 5000.00 }
    loan_amount { 20000.00 }
    term_months { 60 }
    apr { 5.9 }
    monthly_payment { nil } # Will be calculated by callback

    submitted_date { nil }

    trait :submitted do
      status { 'submitted' }
      submitted_date { Date.today }
    end

    trait :approved do
      status { 'approved' }
      submitted_date { 1.week.ago }
    end

    trait :rejected do
      status { 'rejected' }
      submitted_date { 1.week.ago }
    end

    trait :zero_apr do
      apr { 0 }
    end

    trait :high_loan do
      purchase_price { 50000.00 }
      down_payment { 10000.00 }
      loan_amount { 40000.00 }
    end

    trait :short_term do
      term_months { 36 }
    end

    trait :long_term do
      term_months { 72 }
    end
  end
end
