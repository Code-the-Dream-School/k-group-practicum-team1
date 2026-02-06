class ApplicationSerializer
  def self.list_item(application)
    user = application.user
    applicant_name = user ? "#{user.first_name} #{user.last_name}".strip : ""
    {
      id: application.id,
      application_number: application.application_number,
      user_id: application.user_id,
      applicant_name: applicant_name,
      status: application.status,
      application_progress: application.application_progress,
      purchase_price: application.purchase_price,
      down_payment: application.down_payment,
      loan_amount: application.loan_amount,
      term_months: application.term_months,
      apr: application.apr,
      monthly_payment: application.monthly_payment,
      submitted_date: application.submitted_date,
      created_at: application.created_at,
      updated_at: application.updated_at
    }
  end

  def initialize(application)
    @app = application
  end

  def as_json
    {
      id: @app.id,
      application_number: @app.application_number,
      status: @app.status,
      purchase_price: @app.purchase_price,
      loan_amount: @app.loan_amount,
      down_payment: @app.down_payment,
      term_months: @app.term_months,
      apr: @app.apr,
      monthly_payment: @app.monthly_payment,
      application_progress: @app.application_progress,
      submitted_date: @app.submitted_date,
      user_id: @app.user_id,
      vehicle: vehicle_json,
      addresses: addresses_json,
      financial_info: financial_info_json,
      personal_info: personal_info_json
    }
  end

  private

  def vehicle_json
    return nil unless @app.vehicle

    v = @app.vehicle
    {
      id: v.id,
      vehicle_type: v.read_attribute(:vehicle_type),
      year: v.year,
      make: v.make,
      model: v.model,
      trim: v.trim,
      vin: v.vin,
      mileage: v.mileage,
      vehicle_value: v.vehicle_value
    }
  end

  def addresses_json
    @app.addresses.map { |a| a.slice(:id, :address_street, :city, :state, :zip) }
  end

  def financial_info_json
    return nil unless @app.financial_info

    @app.financial_info.slice(
      :id, :employment_status, :employer, :job_title, :years_employed,
      :annual_income, :additional_income, :monthly_expenses, :credit_score
    )
  end

  def personal_info_json
    return nil unless @app.personal_info

    @app.personal_info.slice(
      :id, :first_name, :last_name, :email,
      :phone_number, :dob, :ssn
    )
  end
end
