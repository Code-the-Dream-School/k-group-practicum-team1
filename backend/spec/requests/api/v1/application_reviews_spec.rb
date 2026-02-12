require "rails_helper"

RSpec.describe 'PATCH api/v1/application_reviews', type: :request do
    let(:customer) { create(:user, :customer) }
    let(:loan_officer) { create(:user, :loan_officer) }
    let(:underwriter) { create(:user, :underwriter) }
    let(:application) { create(:application, user: customer) }

    def auth_headers(user)
      token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
      { 'Authorization' => "Bearer #{token}" }
    end

    let(:valid_review_params) do
      {
        application_review: {
          personal_info_complete: true,
          vehicle_info_complete: true,
          financial_info_complete: true,
          documents_complete: true,
          credit_check_authorized: true,
          review_notes: "All documents verified and approved"
        }
      }
    end

    context "when user is not authenticated" do
      it "returns 401 unauthorized" do
        patch "/api/v1/applications/#{application.id}/review", params: valid_review_params
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when user is not a loan officer or underwriter" do
      it "returns 403 forbidden for customer" do
        patch "/api/v1/applications/#{application.id}/review",
              headers: auth_headers(customer),
              params: valid_review_params
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when application does not exist" do
      it "returns 404 not found" do
        patch "/api/v1/applications/99999/review",
              headers: auth_headers(loan_officer),
              params: valid_review_params
        expect(response).to have_http_status(:not_found)
        json = JSON.parse(response.body)
        expect(json['error']).to eq("Application not found.")
      end
    end

    context "when user is a loan officer" do
      it "creates a new application review" do
        expect {
          patch "/api/v1/applications/#{application.id}/review",
                headers: auth_headers(loan_officer),
                params: valid_review_params
        }.to change(ApplicationReview, :count).by(1)

        expect(response).to have_http_status(:ok)
      end

      it "updates existing application review" do
        existing_review = create(:application_review, application: application, personal_info_complete: false)

        patch "/api/v1/applications/#{application.id}/review",
              headers: auth_headers(loan_officer),
              params: valid_review_params

        expect(response).to have_http_status(:ok)
        existing_review.reload
        expect(existing_review.personal_info_complete).to be true
        expect(existing_review.review_notes).to eq("All documents verified and approved")
      end

      it "sets reviewed_by and review_completed_at when all checks are complete" do
        patch "/api/v1/applications/#{application.id}/review",
              headers: auth_headers(loan_officer),
              params: valid_review_params

        expect(response).to have_http_status(:ok)
        review = ApplicationReview.last
        expect(review.reviewed_by_id).to eq(loan_officer.id)
        expect(review.review_completed_at).to be_present
      end

      it "does not set reviewed_by when not all checks are complete" do
        partial_params = {
          application_review: {
            personal_info_complete: true,
            vehicle_info_complete: false,
            review_notes: "In progress"
          }
        }

        patch "/api/v1/applications/#{application.id}/review",
              headers: auth_headers(loan_officer),
              params: partial_params

        expect(response).to have_http_status(:ok)
        review = ApplicationReview.last
        expect(review.reviewed_by_id).to be_nil
        expect(review.review_completed_at).to be_nil
      end

      it "returns the updated review data" do
        patch "/api/v1/applications/#{application.id}/review",
              headers: auth_headers(loan_officer),
              params: valid_review_params

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['personal_info_complete']).to be true
        expect(json['vehicle_info_complete']).to be true
        expect(json['financial_info_complete']).to be true
        expect(json['documents_complete']).to be true
        expect(json['credit_check_authorized']).to be true
        expect(json['review_notes']).to eq("All documents verified and approved")
      end
    end

    context "when user is an underwriter" do
      it "successfully creates the review" do
        expect {
          patch "/api/v1/applications/#{application.id}/review",
                headers: auth_headers(underwriter),
                params: valid_review_params
        }.to change(ApplicationReview, :count).by(1)

        expect(response).to have_http_status(:ok)
      end

      it "successfully updates the review" do
        existing_review = create(:application_review, application: application)

        patch "/api/v1/applications/#{application.id}/review",
              headers: auth_headers(underwriter),
              params: valid_review_params

        expect(response).to have_http_status(:ok)
        existing_review.reload
        expect(existing_review.personal_info_complete).to be true
      end
    end

    context "with invalid parameters" do
      it "returns 422 with validation errors when required params are missing" do
        invalid_params = {}

        patch "/api/v1/applications/#{application.id}/review",
              headers: auth_headers(loan_officer),
              params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
end
