FactoryBot.define do
  factory :document do
    association :application

    document_name { Faker::File.file_name }
    description { [ 'ID', 'income proof', 'paystubs', 'bank statements', 'additional documents' ].sample }
    file_url { Faker::Internet.url }

    trait :id_document do
      document_name { 'Driver License' }
      description { 'ID' }
    end

    trait :income_proof do
      document_name { 'Income Statement' }
      description { 'income proof' }
    end

    trait :paystubs do
      document_name { 'Pay Stub' }
      description { 'paystubs' }
    end

    trait :bank_statements do
      document_name { 'Bank Statement' }
      description { 'bank statements' }
    end

    trait :additional do
      document_name { 'Additional Document' }
      description { 'additional documents' }
    end
  end
end
