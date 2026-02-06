require 'rails_helper'

RSpec.describe Vehicle, type: :model do
  let(:application) { create(:application) }

  describe 'associations' do
    it { should belong_to(:application) }
  end

  describe 'enums' do
    it do
      should define_enum_for(:vehicle_type)
        .with_values(
          new_vehicle: 'new',
          certified_used: 'certified_used',
          used: 'used'
        )
        .backed_by_column_of_type(:string)
    end
  end

  describe 'validations' do
    it 'validates presence of application_id' do
      vehicle = build(:vehicle, application: nil)
      expect(vehicle).not_to be_valid
      expect(vehicle.errors[:application]).to include("must exist")
    end

    it 'validates uniqueness of application_id' do
      create(:vehicle, application: application)
      duplicate_vehicle = build(:vehicle, application: application)
      expect(duplicate_vehicle).not_to be_valid
      expect(duplicate_vehicle.errors[:application_id]).to include("has already been taken")
    end

    it 'validates presence of vehicle_type' do
      vehicle = build(:vehicle, application: application)
      vehicle.vehicle_type = nil
      expect(vehicle).not_to be_valid
      expect(vehicle.errors[:vehicle_type]).to include("can't be blank")
    end

    it 'validates presence of year' do
      vehicle = build(:vehicle, application: application, year: nil)
      expect(vehicle).not_to be_valid
      expect(vehicle.errors[:year]).to include("can't be blank")
    end

    it 'validates year is an integer' do
      vehicle = build(:vehicle, application: application, year: 2023.5)
      expect(vehicle).not_to be_valid
      expect(vehicle.errors[:year]).to include("must be an integer")
    end

    it 'validates year is greater than or equal to 1900' do
      vehicle = build(:vehicle, application: application, year: 1899)
      expect(vehicle).not_to be_valid
      expect(vehicle.errors[:year]).to include("must be greater than or equal to 1900")
    end

    it 'validates year is not in the distant future' do
      vehicle = build(:vehicle, application: application, year: Date.current.year + 2)
      expect(vehicle).not_to be_valid
    end

    it 'allows year to be current year plus one (for next model year)' do
      vehicle = build(:vehicle, application: application, year: Date.current.year + 1)
      expect(vehicle).to be_valid
    end

    it 'validates presence of make' do
      vehicle = build(:vehicle, application: application, make: nil)
      expect(vehicle).not_to be_valid
      expect(vehicle.errors[:make]).to include("can't be blank")
    end

    it 'validates presence of model' do
      vehicle = build(:vehicle, application: application, model: nil)
      expect(vehicle).not_to be_valid
      expect(vehicle.errors[:model]).to include("can't be blank")
    end

    it 'allows trim to be nil' do
      vehicle = build(:vehicle, application: application, trim: nil)
      expect(vehicle).to be_valid
    end

    it 'validates vin to be nil' do
      vehicle = build(:vehicle, application: application, vin: nil)
      expect(vehicle).to be_valid
    end

    it 'validates uniqueness of vin' do
      vin = "2HGBH42JXMN1#{format('%05d', rand(100_000))}"
      create(:vehicle, application: application, vin: vin)
      new_application = create(:application)
      duplicate_vehicle = build(:vehicle, application: new_application, vin: vin)
      expect(duplicate_vehicle).not_to be_valid
      expect(duplicate_vehicle.errors[:vin]).to include("has already been taken")
    end

    describe 'vin format validation' do
      it 'accepts valid 17-character VIN' do
        vin = "2HGBH42JXMN1#{format('%05d', rand(100_000))}"
        vehicle = build(:vehicle, application: application, vin: vin)
        expect(vehicle).to be_valid
      end

      it 'rejects VIN shorter than 17 characters' do
        vehicle = build(:vehicle, application: application, vin: '1HGBH41JXMN10818')
        expect(vehicle).not_to be_valid
        expect(vehicle.errors[:vin]).to include("must be 17 characters (excluding I, O, Q)")
      end

      it 'rejects VIN longer than 17 characters' do
        vehicle = build(:vehicle, application: application, vin: '1HGBH41JXMN1081866')
        expect(vehicle).not_to be_valid
        expect(vehicle.errors[:vin]).to include("must be 17 characters (excluding I, O, Q)")
      end

      it 'rejects VIN containing letter I' do
        vehicle = build(:vehicle, application: application, vin: '1HGBH41JXMN10818I')
        expect(vehicle).not_to be_valid
        expect(vehicle.errors[:vin]).to include("must be 17 characters (excluding I, O, Q)")
      end

      it 'rejects VIN containing letter O' do
        vehicle = build(:vehicle, application: application, vin: '1HGBH41JXMN10818O')
        expect(vehicle).not_to be_valid
        expect(vehicle.errors[:vin]).to include("must be 17 characters (excluding I, O, Q)")
      end

      it 'rejects VIN containing letter Q' do
        vehicle = build(:vehicle, application: application, vin: '1HGBH41JXMN10818Q')
        expect(vehicle).not_to be_valid
        expect(vehicle.errors[:vin]).to include("must be 17 characters (excluding I, O, Q)")
      end

      it 'normalizes VIN to uppercase' do
        vin = "2hgbh42jxmn1#{format('%05d', rand(100_000))}"
        vehicle = create(:vehicle, application: application, vin: vin)
        expect(vehicle.vin).to eq(vin.upcase)
      end

      it 'strips whitespace from VIN' do
        vin = "2HGBH42JXMN1#{format('%05d', rand(100_000))}"
        vehicle = create(:vehicle, application: application, vin: " #{vin} ")
        expect(vehicle.vin).to eq(vin)
      end
    end

    describe 'mileage validation' do
      it 'allows nil mileage' do
        vehicle = build(:vehicle, application: application, mileage: nil)
        expect(vehicle).to be_valid
      end

      it 'validates mileage is an integer' do
        vehicle = build(:vehicle, application: application, mileage: 100.5)
        expect(vehicle).not_to be_valid
        expect(vehicle.errors[:mileage]).to include("must be an integer")
      end

      it 'validates mileage is greater than or equal to 0' do
        vehicle = build(:vehicle, application: application, mileage: -1)
        expect(vehicle).not_to be_valid
        expect(vehicle.errors[:mileage]).to include("must be greater than or equal to 0")
      end

      it 'allows mileage of 0' do
        vehicle = build(:vehicle, application: application, mileage: 0)
        expect(vehicle).to be_valid
      end

      it 'allows high mileage values' do
        vehicle = build(:vehicle, application: application, mileage: 250000)
        expect(vehicle).to be_valid
      end
    end

    describe 'vehicle_value validation' do
      it 'allows nil vehicle_value' do
        vehicle = build(:vehicle, application: application, vehicle_value: nil)
        expect(vehicle).to be_valid
      end

      it 'validates vehicle_value is greater than 0' do
        vehicle = build(:vehicle, application: application, vehicle_value: 0)
        expect(vehicle).not_to be_valid
        expect(vehicle.errors[:vehicle_value]).to include("must be greater than 0")
      end

      it 'rejects negative vehicle_value' do
        vehicle = build(:vehicle, application: application, vehicle_value: -1000)
        expect(vehicle).not_to be_valid
        expect(vehicle.errors[:vehicle_value]).to include("must be greater than 0")
      end

      it 'allows valid vehicle_value' do
        vehicle = build(:vehicle, application: application, vehicle_value: 25000.00)
        expect(vehicle).to be_valid
      end
    end
  end

  describe 'factory' do
    it 'creates a valid vehicle' do
      vehicle = build(:vehicle, application: application)
      expect(vehicle).to be_valid
    end

    it 'has a valid default vehicle_type' do
      vehicle = create(:vehicle, application: application)
      expect(vehicle.vehicle_type).to eq('new_vehicle')
    end

    it 'creates a new vehicle with :new_vehicle trait' do
      vehicle = create(:vehicle, :new_vehicle, application: application)
      expect(vehicle.vehicle_type).to eq('new_vehicle')
      expect(vehicle.mileage).to eq(0)
    end

    it 'creates a used vehicle with :used trait' do
      vehicle = create(:vehicle, :used, application: application)
      expect(vehicle.vehicle_type).to eq('used')
      expect(vehicle.mileage).to be > 0
    end

    it 'creates a certified used vehicle with :certified_used trait' do
      vehicle = create(:vehicle, :certified_used, application: application)
      expect(vehicle.vehicle_type).to eq('certified_used')
      expect(vehicle.mileage).to be > 0
      expect(vehicle.mileage).to be < 50000
    end

    it 'creates a Honda with :honda trait' do
      vehicle = create(:vehicle, :honda, application: application)
      expect(vehicle.make).to eq('Honda')
      expect(vehicle.model).to eq('Accord')
    end

    it 'creates a Ford with :ford trait' do
      vehicle = create(:vehicle, :ford, application: application)
      expect(vehicle.make).to eq('Ford')
      expect(vehicle.model).to eq('F-150')
    end

    it 'creates a high mileage vehicle with :high_mileage trait' do
      vehicle = create(:vehicle, :high_mileage, application: application)
      expect(vehicle.vehicle_type).to eq('used')
      expect(vehicle.mileage).to be >= 100000
    end
  end
end
