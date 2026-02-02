class ApplicationSerializer
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
      financial_info: financial_info_json
    }
  end

  private

  def vehicle_json
    return nil unless @app.vehicle

    @app.vehicle.slice(:id, :vehicle_type, :year, :make, :model, :trim, :vin, :mileage, :vehicle_value)
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
end
