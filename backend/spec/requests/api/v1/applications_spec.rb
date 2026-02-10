require "rails_helper"

RSpec.describe "API::V1::Applications", type: :request do
  let!(:customer) { create(:user, :customer) }
  let!(:other_customer) { create(:user, :customer) }
  let!(:loan_officer) { create(:user, :loan_officer) }
  let!(:underwriter) { create(:user, :underwriter) }

  let!(:application) { create(:application, user: customer, status: "draft") }
  let!(:other_application) { create(:application, user: other_customer) }
  let!(:submitted_application) { create(:application, :submitted, user: customer) }
  let!(:other_submitted_application) { create(:application, :submitted, user: other_customer) }

  def auth_headers(user)
    token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
    { "Authorization" => "Bearer #{token}" }
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
        post "/api/v1/applications", headers: auth_headers(customer), params: valid_params
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["application_number"]).to be_present
      end

      it "sets initial status to draft" do
        post "/api/v1/applications", headers: auth_headers(customer), params: valid_params
        json = JSON.parse(response.body)
        expect(json["status"]).to eq("draft")
      end

      it "sets initial application_progress to personal" do
        post "/api/v1/applications", headers: auth_headers(customer), params: valid_params
        json = JSON.parse(response.body)
        expect(json["application_progress"]).to eq("personal")
      end

      it "returns created application details" do
        post "/api/v1/applications", headers: auth_headers(customer), params: valid_params
        json = JSON.parse(response.body)
        expect(json["purchase_price"].to_f).to eq(25000.00)
        expect(json["loan_amount"].to_f).to eq(20000.00)
        expect(json["down_payment"].to_f).to eq(5000.00)
        expect(json["term_months"]).to eq(60)
      end
    end

    context "validation failures" do
      it "returns error for invalid term_months" do
        invalid_params = { application: valid_params[:application].merge(term_months: 24) }
        post "/api/v1/applications", headers: auth_headers(customer), params: invalid_params
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include(/Term months/)
      end

      it "returns error when loan + down_payment != purchase_price" do
        invalid_params = { application: valid_params[:application].merge(down_payment: 1000.00) }
        post "/api/v1/applications", headers: auth_headers(customer), params: invalid_params
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include(/Down payment \+ Loan amount must equal Purchase price/)
      end
    end

    context "authorization" do
      it "returns unauthorized without auth token" do
        post "/api/v1/applications", params: valid_params
        expect(response).to have_http_status(:unauthorized)
      end

      it "allows customer to create application" do
        post "/api/v1/applications", headers: auth_headers(customer), params: valid_params
        expect(response).to have_http_status(:created)
      end

      it "allows loan_officer to create application" do
        post "/api/v1/applications", headers: auth_headers(loan_officer), params: valid_params
        expect(response).to have_http_status(:created)
      end
    end
  end

  describe "GET /api/v1/applications" do
    context "when authenticated" do
      it "returns only customer's own applications for customer" do
        get "/api/v1/applications", headers: auth_headers(customer)
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["applications"].size).to eq(2)
        json["applications"].each { |app| expect(app["user_id"]).to eq(customer.id) }
        expect(json["meta"]["total"]).to eq(2)
      end

      it "returns all non-draft applications for loan officer" do
        get "/api/v1/applications", headers: auth_headers(loan_officer)
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["applications"].size).to be >= 2
        expect(json["meta"]["total"]).to be >= 2
        json["applications"].each { |app| expect(app["status"]).not_to eq("draft") }
      end

      it "returns all non-draft applications for underwriter" do
        get "/api/v1/applications", headers: auth_headers(underwriter)
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["applications"].size).to be >= 2
      end

      it "includes applicant_name in each application" do
        get "/api/v1/applications", headers: auth_headers(loan_officer)
        json = JSON.parse(response.body)
        expect(json["applications"]).not_to be_empty
        expect(json["applications"].first).to have_key("applicant_name")
        expect(json["applications"].first["applicant_name"]).to match(/\S+/)
      end

      it "includes meta with total, count, current_page, total_pages" do
        get "/api/v1/applications", headers: auth_headers(customer)
        json = JSON.parse(response.body)
        expect(json["meta"]).to include("total", "count", "current_page", "total_pages")
      end

      it "paginates with 20 per page for loan officer" do
        25.times { create(:application, :submitted, user: other_customer) }
        get "/api/v1/applications", headers: auth_headers(loan_officer), params: { page: 1 }
        json = JSON.parse(response.body)
        expect(json["applications"].size).to eq(20)
        expect(json["meta"]["count"]).to eq(20)
        expect(json["meta"]["current_page"]).to eq(1)
        expect(json["meta"]["total_pages"]).to be >= 2
      end

      it "filters by application_number for loan officer" do
        get "/api/v1/applications", headers: auth_headers(loan_officer),
            params: { application_number: application.application_number[0..5] }
        json = JSON.parse(response.body)
        json["applications"].each do |app|
          expect(app["application_number"].downcase).to include(application.application_number[0..5].downcase)
        end
      end

      it "filters by status for loan officer" do
        get "/api/v1/applications", headers: auth_headers(loan_officer), params: { status: "submitted" }
        json = JSON.parse(response.body)
        json["applications"].each { |app| expect(app["status"]).to eq("submitted") }
      end

      it "sorts by created_at desc by default for loan officer" do
        get "/api/v1/applications", headers: auth_headers(loan_officer)
        json = JSON.parse(response.body)
        created_ats = json["applications"].map { |a| a["created_at"] }
        expect(created_ats).to eq(created_ats.sort.reverse)
      end

      it "returns empty applications and total 0 when customer has no applications" do
        customer_without_apps = create(:user, :customer)
        get "/api/v1/applications", headers: auth_headers(customer_without_apps)
        json = JSON.parse(response.body)
        expect(json["applications"]).to eq([])
        expect(json["meta"]["total"]).to eq(0)
        expect(json["meta"]["count"]).to eq(0)
      end
    end

    context "when not authenticated" do
      it "returns 401" do
        get "/api/v1/applications"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /api/v1/applications/:id" do
    context "when authenticated" do
      it "allows customer to see their own application" do
        get "/api/v1/applications/#{application.id}", headers: auth_headers(customer)

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["id"]).to eq(application.id)
        expect(json["user_id"]).to eq(customer.id)
      end

      it "prevents customer from seeing someone else's application" do
        get "/api/v1/applications/#{other_application.id}", headers: auth_headers(customer)

        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include("Unauthorized")
      end

      it "allows loan officer to see any application" do
        get "/api/v1/applications/#{application.id}", headers: auth_headers(loan_officer)

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["id"]).to eq(application.id)
      end

      it "allows underwriter to see any application" do
        get "/api/v1/applications/#{application.id}", headers: auth_headers(underwriter)

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
        get "/api/v1/applications/#{application.id}"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH /api/v1/applications/:id" do
    context "successful updates" do
      it "allows owner to update draft application" do
        patch "/api/v1/applications/#{application.id}",
              params: { application: { purchase_price: 35000, loan_amount: 28000, down_payment: 7000 } },
              headers: auth_headers(customer)

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["purchase_price"].to_f).to eq(35000.0)
      end

      it "allows loan officer to update any draft application" do
        patch "/api/v1/applications/#{application.id}",
              params: { application: { application_progress: "vehicle" } },
              headers: auth_headers(loan_officer)

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["application_progress"]).to eq("vehicle")
      end
    end

    context "validation failures" do
      it "returns errors for invalid data" do
        patch "/api/v1/applications/#{application.id}",
              params: { application: { purchase_price: -100 } },
              headers: auth_headers(customer)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["errors"]).to be_present
      end

      it "returns errors for invalid term_months" do
        patch "/api/v1/applications/#{application.id}",
              params: { application: { term_months: 99 } },
              headers: auth_headers(customer)

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "unauthorized access" do
      it "prevents unauthenticated user from updating" do
        patch "/api/v1/applications/#{application.id}",
              params: { application: { purchase_price: 35000 } }

        expect(response).to have_http_status(:unauthorized)
      end

      it "prevents other customer from updating" do
        patch "/api/v1/applications/#{application.id}",
              params: { application: { purchase_price: 35000 } },
              headers: auth_headers(other_customer)

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "non-draft applications" do
      it "prevents updating submitted application" do
        application.update_column(:status, "submitted")
        patch "/api/v1/applications/#{application.id}",
              params: { application: { purchase_price: 35000 } },
              headers: auth_headers(customer)

        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)["errors"]).to include("Only draft, pending, or under review applications can be updated")
      end

      it "prevents updating approved application" do
        application.update_column(:status, "approved")
        patch "/api/v1/applications/#{application.id}",
              params: { application: { purchase_price: 35000 } },
              headers: auth_headers(customer)

        expect(response).to have_http_status(:forbidden)
      end
    end

    context "application not found" do
      it "returns 404 for non-existent application" do
        patch "/api/v1/applications/999999",
              params: { application: { purchase_price: 35000 } },
              headers: auth_headers(customer)

        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
