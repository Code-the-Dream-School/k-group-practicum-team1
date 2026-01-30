FactoryBot.define do
  factory :application_review do
    association :application
    personal_info_complete { false }
    vehicle_info_complete { false }
    financial_info_complete { false }
    documents_complete { false }
    credit_check_authorized { false }
    reviewed_by_id { nil }
    review_completed_at { nil }
    review_notes { nil }

    trait :complete do
      personal_info_complete { true }
      vehicle_info_complete { true }
      financial_info_complete { true }
      documents_complete { true }
      credit_check_authorized { true }
    end

    trait :reviewed do
      association :reviewer, factory: :user
      review_completed_at { Time.current }
      review_notes { "Application reviewed and approved" }
    end
  end
end
