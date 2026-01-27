require 'rails_helper'

RSpec.describe "API::V1::Applications", type: :request do
  let!(:customer) { create(:user, :customer) }
  let!(:other_customer) { create(:user, :customer) }
  let!(:loan_officer) { create(:user, :loan_officer) }
  let!(:underwriter) { create(:user, :underwriter) }

  let!(:customer_application) { create(:application, user: customer) }
  let!(:other_application) { create(:application, user: other_customer) }

  def auth_headers(user)
    token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
    { 'Authorization' => "Bearer #{token}" }
  end

  describe "GET /api/v1/applications/:id" do
    context "when authenticated" do
      it "allows customer to see their own application" do
        get "/api/v1/applications/#{customer_application.id}", headers: auth_headers(customer)

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["id"]).to eq(customer_application.id)
        expect(json["user_id"]).to eq(customer.id)
      end

      it "prevents customer from seeing someone else's application" do
        get "/api/v1/applications/#{other_application.id}", headers: auth_headers(customer)

        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include("Unauthorized")
      end

      it "allows loan officer to see any application" do
        get "/api/v1/applications/#{customer_application.id}", headers: auth_headers(loan_officer)

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["id"]).to eq(customer_application.id)
      end

      it "allows underwriter to see any application" do
        get "/api/v1/applications/#{customer_application.id}", headers: auth_headers(underwriter)

        expect(response).to have_http_status(:ok)
      end

      it "returns 404 when application does not exist" do
        get "/api/v1/applications/0", headers: auth_headers(loan_officer)

        expect(response).to have_http_status(:not_found)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include("Application not found")
      end
    end

    context "when not authenticated" do
      it "returns 401 Unauthorized" do
        get "/api/v1/applications/#{customer_application.id}"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
