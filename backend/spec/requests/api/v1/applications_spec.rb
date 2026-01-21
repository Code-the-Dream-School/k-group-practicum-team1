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
end
