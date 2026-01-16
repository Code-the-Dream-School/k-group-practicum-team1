require 'rails_helper'

RSpec.describe Address, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      address = build(:address)
      expect(address).to be_valid
    end

    it 'is valid without an application' do
      address = build(:address)
      expect(address.application).to be_nil
    end

    it 'is valid with an application' do
      application = create(:application)
      address = build(:address, application: application)
      expect(address).to be_valid
      expect(address.application).to eq(application)
    end

    it 'is valid using the :with_application trait' do
      address = build(:address, :with_application)
      expect(address).to be_valid
      expect(address.application).to be_present
    end

    it 'is not valid without address_street' do
      address = build(:address, address_street: nil)
      expect(address).to_not be_valid
      expect(address.errors[:address_street]).to include("can't be blank")
    end

    it 'is not valid without city' do
      address = build(:address, city: nil)
      expect(address).to_not be_valid
      expect(address.errors[:city]).to include("can't be blank")
    end

    it 'is not valid without state' do
      address = build(:address, state: nil)
      expect(address).to_not be_valid
      expect(address.errors[:state]).to include("can't be blank")
    end

    it 'is not valid without zip' do
      address = build(:address, zip: nil)
      expect(address).to_not be_valid
      expect(address.errors[:zip]).to include("can't be blank")
    end

    it 'is not valid with an invalid zip' do
      address = build(:address, zip: "abcd")
      expect(address).to_not be_valid
      expect(address.errors[:zip]).to include("must be a valid ZIP code")
    end
  end

  describe 'associations' do
    it { should belong_to(:application).optional }
  end
end
