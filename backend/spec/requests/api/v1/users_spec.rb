require 'rails_helper'

RSpec.describe "API::V1::Users", type: :request do
  let!(:customer) { create(:user, :customer) }
  let!(:loan_officer) { create(:user, :loan_officer) }
  let!(:underwriter) { create(:user, :underwriter) }

  def auth_headers(user)
    token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
    { 'Authorization' => "Bearer #{token}" }
  end

  describe "GET /api/v1/me" do
    it "returns current customer" do
      get '/api/v1/me', headers: auth_headers(customer)
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['id']).to eq(customer.id)
    end

    it "returns current loan officer" do
      get '/api/v1/me', headers: auth_headers(loan_officer)
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['id']).to eq(loan_officer.id)
    end
  end

  describe "GET /api/v1/users" do
    it "allows loan officer to see all users" do
      get '/api/v1/users', headers: auth_headers(loan_officer)
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(User.count)
    end

    it "allows underwriter to see all users" do
      get '/api/v1/users', headers: auth_headers(underwriter)
      expect(response).to have_http_status(:ok)
    end

    it "prevents customer from seeing all users" do
      get '/api/v1/users', headers: auth_headers(customer)
      expect(response).to have_http_status(:unauthorized)
      json = JSON.parse(response.body)
      expect(json['errors']).to include("Unauthorized")
    end
  end

  describe "GET /api/v1/users/:id" do
    it "allows customer to see their own profile" do
      get "/api/v1/users/#{customer.id}", headers: auth_headers(customer)
      expect(response).to have_http_status(:ok)
    end

    it "prevents customer from seeing other users" do
      get "/api/v1/users/#{loan_officer.id}", headers: auth_headers(customer)
      expect(response).to have_http_status(:unauthorized)
    end

    it "allows loan officer to see any user" do
      get "/api/v1/users/#{customer.id}", headers: auth_headers(loan_officer)
      expect(response).to have_http_status(:ok)
    end
  end

  describe "PATCH /api/v1/users/:id" do
    it "allows customer to update own profile" do
      patch "/api/v1/users/#{customer.id}",
        headers: auth_headers(customer),
        params: { user: { first_name: "Updated" } }

      expect(response).to have_http_status(:ok)
      expect(customer.reload.first_name).to eq("Updated")
    end

    it "prevents customer from updating other users" do
      patch "/api/v1/users/#{loan_officer.id}",
        headers: auth_headers(customer),
        params: { user: { first_name: "Hack" } }

      expect(response).to have_http_status(:unauthorized)
    end

    it "allows loan officer to update any user" do
      patch "/api/v1/users/#{customer.id}",
        headers: auth_headers(loan_officer),
        params: { user: { first_name: "OfficerUpdated" } }

      expect(response).to have_http_status(:ok)
      expect(customer.reload.first_name).to eq("OfficerUpdated")
    end
  end

  describe "DELETE /api/v1/users/:id" do
    it "prevents customer from deleting users" do
      delete "/api/v1/users/#{loan_officer.id}", headers: auth_headers(customer)
      expect(response).to have_http_status(:forbidden)
    end

    it "allows loan officer to delete customer" do
      delete "/api/v1/users/#{customer.id}", headers: auth_headers(loan_officer)
      expect(response).to have_http_status(:no_content)
      expect(User.exists?(customer.id)).to be_falsey
    end
  end
end
