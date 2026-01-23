require 'rails_helper'

RSpec.describe FinancialInfo, type: :model do
  let(:application) { create(:application) }

  describe 'associations' do
    it { should belong_to(:application) }
  end

  describe 'enums' do
    it do
      should define_enum_for(:credit_score)
        .with_values(
          excellent: "excellent",
          good: "good",
          fair: "fair",
          poor: "poor"
        )
        .backed_by_column_of_type(:string)
    end
  end

  describe 'validations' do
    it 'validates presence of application_id' do
      financial_info = build(:financial_info, application: nil)
      expect(financial_info).not_to be_valid
      expect(financial_info.errors[:application]).to include("must exist")
    end

    it 'validates uniqueness of application_id' do
      create(:financial_info, application: application)
      duplicate_financial_info = build(:financial_info, application: application)
      expect(duplicate_financial_info).not_to be_valid
      expect(duplicate_financial_info.errors[:application_id]).to include("has already been taken")
    end

    describe 'years_employed validation' do
      it 'allows nil years_employed' do
        financial_info = build(:financial_info, application: application, years_employed: nil)
        expect(financial_info).to be_valid
      end

      it 'validates years_employed is greater than or equal to 0' do
        financial_info = build(:financial_info, application: application, years_employed: -1)
        expect(financial_info).not_to be_valid
        expect(financial_info.errors[:years_employed]).to include("must be greater than or equal to 0")
      end

      it 'allows years_employed of 0' do
        financial_info = build(:financial_info, application: application, years_employed: 0)
        expect(financial_info).to be_valid
      end

      it 'allows decimal values for years_employed' do
        financial_info = build(:financial_info, application: application, years_employed: 5.5)
        expect(financial_info).to be_valid
      end

      it 'allows high years_employed values' do
        financial_info = build(:financial_info, application: application, years_employed: 30.0)
        expect(financial_info).to be_valid
      end
    end

    describe 'annual_income validation' do
      it 'allows nil annual_income' do
        financial_info = build(:financial_info, application: application, annual_income: nil)
        expect(financial_info).to be_valid
      end

      it 'validates annual_income is greater than or equal to 0' do
        financial_info = build(:financial_info, application: application, annual_income: -1000)
        expect(financial_info).not_to be_valid
        expect(financial_info.errors[:annual_income]).to include("must be greater than or equal to 0")
      end

      it 'allows annual_income of 0' do
        financial_info = build(:financial_info, application: application, annual_income: 0)
        expect(financial_info).to be_valid
      end

      it 'allows valid annual_income values' do
        financial_info = build(:financial_info, application: application, annual_income: 75000.00)
        expect(financial_info).to be_valid
      end

      it 'allows high annual_income values' do
        financial_info = build(:financial_info, application: application, annual_income: 200000.00)
        expect(financial_info).to be_valid
      end
    end

    describe 'additional_income validation' do
      it 'allows nil additional_income' do
        financial_info = build(:financial_info, application: application, additional_income: nil)
        expect(financial_info).to be_valid
      end

      it 'validates additional_income is greater than or equal to 0' do
        financial_info = build(:financial_info, application: application, additional_income: -500)
        expect(financial_info).not_to be_valid
        expect(financial_info.errors[:additional_income]).to include("must be greater than or equal to 0")
      end

      it 'allows additional_income of 0' do
        financial_info = build(:financial_info, application: application, additional_income: 0)
        expect(financial_info).to be_valid
      end

      it 'allows valid additional_income values' do
        financial_info = build(:financial_info, application: application, additional_income: 5000.00)
        expect(financial_info).to be_valid
      end
    end

    describe 'monthly_expenses validation' do
      it 'allows nil monthly_expenses' do
        financial_info = build(:financial_info, application: application, monthly_expenses: nil)
        expect(financial_info).to be_valid
      end

      it 'validates monthly_expenses is greater than or equal to 0' do
        financial_info = build(:financial_info, application: application, monthly_expenses: -100)
        expect(financial_info).not_to be_valid
        expect(financial_info.errors[:monthly_expenses]).to include("must be greater than or equal to 0")
      end

      it 'allows monthly_expenses of 0' do
        financial_info = build(:financial_info, application: application, monthly_expenses: 0)
        expect(financial_info).to be_valid
      end

      it 'allows valid monthly_expenses values' do
        financial_info = build(:financial_info, application: application, monthly_expenses: 3000.00)
        expect(financial_info).to be_valid
      end
    end

    describe 'optional string fields' do
      it 'allows nil employment_status' do
        financial_info = build(:financial_info, application: application, employment_status: nil)
        expect(financial_info).to be_valid
      end

      it 'allows nil employer' do
        financial_info = build(:financial_info, application: application, employer: nil)
        expect(financial_info).to be_valid
      end

      it 'allows nil job_title' do
        financial_info = build(:financial_info, application: application, job_title: nil)
        expect(financial_info).to be_valid
      end

      it 'allows nil credit_score' do
        financial_info = build(:financial_info, application: application, credit_score: nil)
        expect(financial_info).to be_valid
      end
    end
  end

  describe 'factory' do
    it 'creates a valid financial_info' do
      financial_info = build(:financial_info, application: application)
      expect(financial_info).to be_valid
    end

    it 'creates financial_info with :excellent_credit trait' do
      financial_info = create(:financial_info, :excellent_credit, application: application)
      expect(financial_info.credit_score).to eq('excellent')
      expect(financial_info.annual_income).to eq(100000.00)
    end

    it 'creates financial_info with :good_credit trait' do
      financial_info = create(:financial_info, :good_credit, application: application)
      expect(financial_info.credit_score).to eq('good')
      expect(financial_info.annual_income).to eq(75000.00)
    end

    it 'creates financial_info with :fair_credit trait' do
      financial_info = create(:financial_info, :fair_credit, application: application)
      expect(financial_info.credit_score).to eq('fair')
      expect(financial_info.annual_income).to eq(50000.00)
    end

    it 'creates financial_info with :poor_credit trait' do
      financial_info = create(:financial_info, :poor_credit, application: application)
      expect(financial_info.credit_score).to eq('poor')
      expect(financial_info.annual_income).to eq(35000.00)
    end

    it 'creates financial_info with :self_employed trait' do
      financial_info = create(:financial_info, :self_employed, application: application)
      expect(financial_info.employment_status).to eq('self_employed')
      expect(financial_info.employer).to be_nil
    end

    it 'creates financial_info with :unemployed trait' do
      financial_info = create(:financial_info, :unemployed, application: application)
      expect(financial_info.employment_status).to eq('unemployed')
      expect(financial_info.annual_income).to eq(0.00)
    end

    it 'creates financial_info with :high_income trait' do
      financial_info = create(:financial_info, :high_income, application: application)
      expect(financial_info.annual_income).to eq(150000.00)
      expect(financial_info.additional_income).to eq(20000.00)
    end

    it 'creates financial_info with :low_income trait' do
      financial_info = create(:financial_info, :low_income, application: application)
      expect(financial_info.annual_income).to eq(30000.00)
      expect(financial_info.additional_income).to eq(0.00)
    end
  end

  describe 'one-to-one relationship with application' do
    it 'can have one financial_info per application' do
      application = create(:application)
      financial_info = create(:financial_info, application: application)
      expect(application.financial_info).to eq(financial_info)
    end

    it 'destroys associated financial_info when application is destroyed' do
      application = create(:application)
      financial_info = create(:financial_info, application: application)
      financial_info_id = financial_info.id

      expect { application.destroy }.to change { FinancialInfo.count }.by(-1)
      expect(FinancialInfo.find_by(id: financial_info_id)).to be_nil
    end

    it 'allows application without financial_info' do
      application = create(:application)
      expect(application.financial_info).to be_nil
      expect(application).to be_valid
    end
  end
end
