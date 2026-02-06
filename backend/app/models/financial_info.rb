class FinancialInfo < ApplicationRecord
  belongs_to :application

  enum :credit_score, {
    excellent: "excellent",
    good: "good",
    fair: "fair",
    poor: "poor"
  }

  validates :application_id, uniqueness: true

  validates :years_employed, numericality: { greater_than_or_equal_to: 0 },
            allow_nil: true

  validates :annual_income, numericality: { greater_than_or_equal_to: 0 },
            allow_nil: true

  validates :additional_income, numericality: { greater_than_or_equal_to: 0 },
            allow_nil: true

  validates :monthly_expenses, numericality: { greater_than_or_equal_to: 0 },
            allow_nil: true
end
