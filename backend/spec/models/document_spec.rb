require 'rails_helper'

RSpec.describe Document, type: :model do
  let(:application) { create(:application) }

  describe 'associations' do
    it { should belong_to(:application) }
  end

  describe 'validations' do
    it 'validates presence of application_id' do
      document = build(:document, application: nil)
      expect(document).not_to be_valid
      expect(document.errors[:application]).to include("must exist")
    end

    it 'validates presence of document_name' do
      document = build(:document, application: application, document_name: nil)
      expect(document).not_to be_valid
      expect(document.errors[:document_name]).to include("can't be blank")
    end

    it 'allows nil file_url' do
      document = build(:document, application: application, file_url: nil)
      expect(document).to be_valid
    end

    it 'allows nil description' do
      document = build(:document, application: application, description: nil)
      expect(document).to be_valid
    end

    it 'allows valid document with all fields' do
      document = build(:document, application: application)
      expect(document).to be_valid
    end
  end

  describe 'factory' do
    it 'creates a valid document' do
      document = build(:document, application: application)
      expect(document).to be_valid
    end

    it 'creates document with :id_document trait' do
      document = create(:document, :id_document, application: application)
      expect(document.document_name).to eq('Driver License')
      expect(document.description).to eq('ID')
    end

    it 'creates document with :income_proof trait' do
      document = create(:document, :income_proof, application: application)
      expect(document.document_name).to eq('Income Statement')
      expect(document.description).to eq('income proof')
    end

    it 'creates document with :paystubs trait' do
      document = create(:document, :paystubs, application: application)
      expect(document.document_name).to eq('Pay Stub')
      expect(document.description).to eq('paystubs')
    end

    it 'creates document with :bank_statements trait' do
      document = create(:document, :bank_statements, application: application)
      expect(document.document_name).to eq('Bank Statement')
      expect(document.description).to eq('bank statements')
    end

    it 'creates document with :additional trait' do
      document = create(:document, :additional, application: application)
      expect(document.document_name).to eq('Additional Document')
      expect(document.description).to eq('additional documents')
    end
  end

  describe 'one-to-many relationship with application' do
    it 'allows multiple documents per application' do
      application = create(:application)
      document1 = create(:document, application: application)
      document2 = create(:document, application: application)

      expect(application.documents.count).to eq(2)
      expect(application.documents).to include(document1, document2)
    end

    it 'destroys associated documents when application is destroyed' do
      application = create(:application)
      document1 = create(:document, application: application)
      document2 = create(:document, application: application)
      document_ids = [ document1.id, document2.id ]

      expect { application.destroy }.to change { Document.count }.by(-2)
      document_ids.each do |id|
        expect(Document.find_by(id: id)).to be_nil
      end
    end

    it 'allows application without documents' do
      application = create(:application)
      expect(application.documents).to be_empty
      expect(application).to be_valid
    end
  end
end
