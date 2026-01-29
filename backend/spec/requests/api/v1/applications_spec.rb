# backend/spec/requests/api/v1/applications_spec.rb
require 'rails_helper'

RSpec.describe "API::V1::Applications", type: :request do
  let!(:customer) { create(:user, :customer) }
  let!(:loan_officer) { create(:user, :loan_officer) }

  def auth_headers(user)
    token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
    { 'Authorization' => "Bearer #{token}" }
  end

  describe "POST /api/v1/applications" do
    let(:valid_params) do
      {
        application: {
          purchase_price: 25000.00,
          loan_amount: 20000.00,
          down_payment: 5000.00,
          term_months: 60,
          apr: 5.9
        }
      }
    end

    context "successful creation" do
      it "creates application with valid params" do
        post '/api/v1/applications', headers: auth_headers(customer), params: valid_params
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json['application_number']).to be_present
      end

      it "sets initial status to draft" do
        post '/api/v1/applications', headers: auth_headers(customer), params: valid_params
        json = JSON.parse(response.body)
        expect(json['status']).to eq('draft')
      end

      it "sets initial application_progress to personal" do
        post '/api/v1/applications', headers: auth_headers(customer), params: valid_params
        json = JSON.parse(response.body)
        expect(json['application_progress']).to eq('personal')
      end

      it "returns created application details" do
        post '/api/v1/applications', headers: auth_headers(customer), params: valid_params
        json = JSON.parse(response.body)
        expect(json['purchase_price'].to_f).to eq(25000.00)
        expect(json['loan_amount'].to_f).to eq(20000.00)
        expect(json['down_payment'].to_f).to eq(5000.00)
        expect(json['term_months']).to eq(60)
      end
    end

    context "validation failures" do
      it "returns error for invalid term_months" do
        invalid_params = { application: valid_params[:application].merge(term_months: 24) }
        post '/api/v1/applications', headers: auth_headers(customer), params: invalid_params
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']).to include(/Term months/)
      end

      it "returns error when loan + down_payment != purchase_price" do
        invalid_params = { application: valid_params[:application].merge(down_payment: 1000.00) }
        post '/api/v1/applications', headers: auth_headers(customer), params: invalid_params
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']).to include(/Down payment \+ Loan amount must equal Purchase price/)
      end
    end

    context "authorization" do
      it "returns unauthorized without auth token" do
        post '/api/v1/applications', params: valid_params
        expect(response).to have_http_status(:unauthorized)
      end

      it "allows customer to create application" do
        post '/api/v1/applications', headers: auth_headers(customer), params: valid_params
        expect(response).to have_http_status(:created)
      end

      it "allows loan_officer to create application" do
        post '/api/v1/applications', headers: auth_headers(loan_officer), params: valid_params
        expect(response).to have_http_status(:created)
      end
    end
  end

  describe "PATCH /api/v1/applications/:id/review" do
    let!(:application) { create(:application, user: customer) }
    let!(:underwriter) { create(:user, :underwriter) }

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
        json = JSON.parse(response.body)
        expect(json['error']).to eq("Unauthorized")
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

        expect(response).to have_http_status(:bad_request)
      end
    end
  end
end
