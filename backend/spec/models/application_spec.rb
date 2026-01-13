require 'rails_helper'

RSpec.describe Application, type: :model do
  let(:user) { create(:user) }

  describe 'associations' do
    it { should belong_to(:user) }
  end

  describe 'enums' do
    it do
      should define_enum_for(:status)
        .with_values(
          draft: 'draft',
          submitted: 'submitted',
          pending: 'pending',
          under_review: 'under_review',
          pending_documents: 'pending_documents',
          approved: 'approved',
          rejected: 'rejected'
        )
        .backed_by_column_of_type(:string)
    end

    it do
      should define_enum_for(:application_progress)
        .with_values(
          personal: 'personal',
          vehicle: 'vehicle',
          financial: 'financial',
          terms: 'terms'
        )
        .backed_by_column_of_type(:string)
    end
  end

  describe 'validations' do
    it 'validates presence of user_id' do
      application = build(:application, user: nil)
      expect(application).not_to be_valid
      expect(application.errors[:user]).to include("must exist")
    end

    it 'validates presence of status' do
      application = build(:application, user: user)
      application.status = nil
      expect(application).not_to be_valid
      expect(application.errors[:status]).to include("can't be blank")
    end

    it 'validates presence of purchase_price' do
      application = build(:application, user: user, purchase_price: nil, loan_amount: nil, down_payment: nil)
      expect(application).not_to be_valid
      expect(application.errors[:purchase_price]).to include("can't be blank")
    end

    it 'validates purchase_price is greater than 0' do
      application = build(:application, user: user, purchase_price: 0)
      expect(application).not_to be_valid
      expect(application.errors[:purchase_price]).to include("must be greater than 0")
    end

    it 'validates presence of loan_amount' do
      application = build(:application, user: user, loan_amount: nil)
      expect(application).not_to be_valid
      expect(application.errors[:loan_amount]).to include("can't be blank")
    end

    it 'validates loan_amount is greater than 0' do
      application = build(:application, user: user, loan_amount: 0)
      expect(application).not_to be_valid
      expect(application.errors[:loan_amount]).to include("must be greater than 0")
    end

    it 'validates presence of down_payment' do
      application = build(:application, user: user, down_payment: nil)
      expect(application).not_to be_valid
      expect(application.errors[:down_payment]).to include("can't be blank")
    end

    it 'validates down_payment is greater than or equal to 0' do
      application = build(:application, user: user, down_payment: -1)
      expect(application).not_to be_valid
      expect(application.errors[:down_payment]).to include("must be greater than or equal to 0")
    end

    it 'validates presence of term_months' do
      application = build(:application, user: user, term_months: nil)
      expect(application).not_to be_valid
      expect(application.errors[:term_months]).to include("can't be blank")
    end

    it 'validates term_months is in allowed values' do
      application = build(:application, user: user, term_months: 24)
      expect(application).not_to be_valid
      expect(application.errors[:term_months]).to include("must be 36, 48, 60, or 72 months")
    end

    it 'validates apr is greater than or equal to 0 when present' do
      application = build(:application, user: user, apr: -1)
      expect(application).not_to be_valid
      expect(application.errors[:apr]).to include("must be greater than or equal to 0")
    end

    it 'validates apr is less than 100 when present' do
      application = build(:application, user: user, apr: 100)
      expect(application).not_to be_valid
      expect(application.errors[:apr]).to include("must be less than 100")
    end

    it 'validates presence of application_progress' do
      application = build(:application, user: user)
      application.application_progress = nil
      expect(application).not_to be_valid
      expect(application.errors[:application_progress]).to include("can't be blank")
    end

    describe 'application_number format' do
      it 'accepts valid format' do
        application = build(:application, user: user, application_number: '#AL-2026-00001')
        expect(application).to be_valid
      end

      it 'rejects invalid format without hash' do
        application = build(:application, user: user, application_number: 'CA-2026-00001')
        expect(application).not_to be_valid
        expect(application.errors[:application_number]).to include('must be in proper format (XX-XXXX-XXXXX)')
      end

      it 'rejects invalid format with wrong state code length' do
        application = build(:application, user: user, application_number: '#C-2026-00001')
        expect(application).not_to be_valid
      end

      it 'rejects invalid format with wrong year length' do
        application = build(:application, user: user, application_number: '#CA-26-00001')
        expect(application).not_to be_valid
      end

      it 'rejects invalid format with wrong number length' do
        application = build(:application, user: user, application_number: '#CA-2026-001')
        expect(application).not_to be_valid
      end
    end

    describe 'loan_amount validation' do
      it 'must be less than or equal to purchase_price' do
        application = build(:application, user: user, purchase_price: 20000, loan_amount: 25000, down_payment: 0)
        expect(application).not_to be_valid
      end

      it 'can equal purchase_price with zero down payment' do
        application = build(:application, user: user, purchase_price: 20000, loan_amount: 20000, down_payment: 0)
        expect(application).to be_valid
      end
    end
  end

  describe 'custom validations' do
    describe '#down_payment_plus_loan_equals_purchase_price' do
      it 'is valid when down_payment + loan_amount equals purchase_price' do
        application = build(:application,
          user: user,
          purchase_price: 25000,
          down_payment: 5000,
          loan_amount: 20000
        )
        expect(application).to be_valid
      end

      it 'is invalid when down_payment + loan_amount does not equal purchase_price' do
        application = build(:application,
          user: user,
          purchase_price: 25000,
          down_payment: 5000,
          loan_amount: 19000
        )
        expect(application).not_to be_valid
        expect(application.errors[:base]).to include('Down payment + Loan amount must equal Purchase price')
      end

      it 'allows small rounding differences (less than 0.01)' do
        application = build(:application,
          user: user,
          purchase_price: 25000.00,
          down_payment: 5000.00,
          loan_amount: 19999.999
        )
        expect(application).to be_valid
      end
    end
  end

  describe 'factory' do
    it 'creates a valid application' do
      application = build(:application, user: user)
      expect(application).to be_valid
    end

    it 'has a valid default status' do
      application = create(:application, user: user)
      expect(application.status).to eq('draft')
    end

    it 'has a valid default application_progress' do
      application = create(:application, user: user)
      expect(application.application_progress).to eq('personal')
    end
  end

  describe 'business logic' do
    it 'calculates correct monthly payment for typical auto loan' do
      # Real-world scenario: $25,000 car with $5,000 down
      application = create(:application,
        user: user,
        purchase_price: 25000,
        down_payment: 5000,
        loan_amount: 20000,
        apr: 5.9,
        term_months: 60
      )

      expect(application.monthly_payment).to be_within(1.0).of(386.0)
    end

    it 'handles zero down payment scenario' do
      application = create(:application,
        user: user,
        purchase_price: 30000,
        down_payment: 0,
        loan_amount: 30000,
        apr: 6.5,
        term_months: 72
      )

      expect(application).to be_valid
      expect(application.monthly_payment).to be > 0
    end

    it 'supports all valid term options' do
      [ 36, 48, 60, 72 ].each do |term|
        application = build(:application, user: user, term_months: term)
        expect(application).to be_valid
      end
    end
  end
end
