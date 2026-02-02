require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    subject { build(:user) }

    it { should validate_presence_of(:first_name) }
    it { should validate_presence_of(:last_name) }
    it { should validate_presence_of(:phone_number) }
    it { should validate_presence_of(:role) }
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }

    it 'validates uniqueness of phone_number' do
      phone = "1#{format('%09d', rand(1_000_000_000))}"
      create(:user, phone_number: phone)
      duplicate_user = build(:user, phone_number: phone)
      expect(duplicate_user).not_to be_valid
      expect(duplicate_user.errors[:phone_number]).to include('has already been taken')
    end
  end

  describe 'enums' do
    it { should define_enum_for(:role).with_values(customer: 0, loan_officer: 1, underwriter: 2) }
  end

  describe 'factory' do
    it 'creates a valid user' do
      user = build(:user)
      expect(user).to be_valid
    end

    it 'creates a loan officer' do
      user = build(:user, :loan_officer)
      expect(user.role).to eq('loan_officer')
    end

    it 'creates an underwriter' do
      user = build(:user, :underwriter)
      expect(user.role).to eq('underwriter')
    end
  end

  describe 'devise modules' do
    it 'responds to devise methods' do
      user = build(:user)
      expect(user).to respond_to(:email)
      expect(user).to respond_to(:encrypted_password)
    end
  end
end
