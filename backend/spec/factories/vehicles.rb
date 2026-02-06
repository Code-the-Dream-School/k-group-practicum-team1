FactoryBot.define do
  factory :vehicle do
    association :application

    vehicle_type { 'new' }
    year { Date.current.year }
    make { 'Toyota' }
    model { 'Camry' }
    trim { 'LE' }
    sequence(:vin) { |n| "1HGBH41JXMN1#{n.to_s.rjust(5, '0')}" }
    mileage { 0 }
    vehicle_value { 25000.00 }

    trait :new do
      vehicle_type { 'new' }
      mileage { 0 }
      vehicle_value { 30000.00 }
    end

    trait :used do
      vehicle_type { 'used' }
      year { Date.current.year - 3 }
      mileage { 35000 }
      vehicle_value { 18000.00 }
    end

    trait :certified_used do
      vehicle_type { 'certified_used' }
      year { Date.current.year - 2 }
      mileage { rand(5000..49999) }
      vehicle_value { 22000.00 }
    end

    trait :honda do
      make { 'Honda' }
      model { 'Accord' }
      trim { 'EX' }
    end

    trait :ford do
      make { 'Ford' }
      model { 'F-150' }
      trim { 'XLT' }
    end

    trait :high_mileage do
      vehicle_type { 'used' }
      year { Date.current.year - 8 }
      mileage { 120000 }
      vehicle_value { 8000.00 }
    end
  end
end
