require 'rails_helper'

RSpec.describe ApplicationReview, type: :model do
  describe "associations" do
    it { should belong_to(:application) }
    it { should belong_to(:reviewer).class_name("User").with_foreign_key("reviewed_by_id").optional }
  end

  describe "validations" do
    subject { create(:application_review) }

    it { should validate_presence_of(:application_id) }
    it { should validate_uniqueness_of(:application_id) }
  end

  describe "#all_complete?" do
    let(:application_review) { create(:application_review) }

    context "when all fields are complete" do
      before do
        application_review.update(
          personal_info_complete: true,
          vehicle_info_complete: true,
          financial_info_complete: true,
          documents_complete: true,
          credit_check_authorized: true
        )
      end

      it "returns true" do
        expect(application_review.all_complete?).to be true
      end
    end

    context "when some fields are incomplete" do
      before do
        application_review.update(
          personal_info_complete: true,
          vehicle_info_complete: false,
          financial_info_complete: true,
          documents_complete: true,
          credit_check_authorized: true
        )
      end

      it "returns false" do
        expect(application_review.all_complete?).to be false
      end
    end

    context "when all fields are incomplete" do
      it "returns false" do
        expect(application_review.all_complete?).to be false
      end
    end
  end

  describe "mark_as_completed!" do
    let(:application_review) { create(:application_review) }
    let(:reviewer) { create(:user, role: :loan_officer) }

    it "updates reviewed_by_id and review_completed_at" do
      current_time = Time.current
      allow(Time).to receive(:current).and_return(current_time)

      application_review.mark_as_completed!(reviewer)

      expect(application_review.reviewed_by_id).to eq(reviewer.id)
    end

    it "persists the changes to the database" do
      application_review.mark_as_completed!(reviewer)
      application_review.reload

      expect(application_review.reviewed_by_id).to eq(reviewer.id)
      expect(application_review.review_completed_at).not_to be_nil
    end
  end
end
