class Application < ApplicationRecord
  belongs_to :user
  has_many :addresses, dependent: :destroy
  has_one :vehicle, dependent: :destroy
  has_one :financial_info, dependent: :destroy
  has_one :application_review, dependent: :destroy
  has_one :personal_info, dependent: :destroy

  accepts_nested_attributes_for :personal_info, :financial_info, :vehicle, :addresses, allow_destroy: true

  enum :status, {
    draft: "draft",
    submitted: "submitted",
    pending: "pending",
    under_review: "under_review",
    pending_documents: "pending_documents",
    approved: "approved",
    rejected: "rejected"
  }

  enum :application_progress, {
    personal: "personal",
    vehicle: "vehicle",
    financial: "financial",
    terms: "terms"
  }

  validates :application_number, presence: true, uniqueness: true,
            format: { with: /\A#[A-Z]{2}-\d{4}-\d{5}\z/, message: "must be in proper format (XX-XXXX-XXXXX)" }

  validates :user_id, presence: true

  validates :status, presence: true

  validates :purchase_price, numericality: { greater_than: 0 }, allow_nil: true

  validates :loan_amount, numericality: { greater_than: 0, less_than_or_equal_to: :purchase_price }, allow_nil: true

  validates :down_payment, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  validates :term_months, inclusion: { in: [ 36, 48, 60, 72 ], message: "must be 36, 48, 60, or 72 months" }, allow_nil: true

  validates :apr, numericality: { greater_than_or_equal_to: 0, less_than: 100 },
            allow_nil: true

  validates :monthly_payment, numericality: { greater_than: 0 },
            allow_nil: true

  validates :application_progress, presence: true

  validate :down_payment_plus_loan_equals_purchase_price

  before_validation :generate_application_number, on: :create
  before_validation :calculate_monthly_payment, if: :can_calculate_payment?

  private

  def generate_application_number
    return if application_number.present?

    year = Time.current.year
    state_code = get_state_code

    last_number = Application.where("application_number LIKE ?", "##{state_code}-#{year}-%")
                             .order(application_number: :desc)
                             .first
                             &.application_number
                             &.split("-")
                             &.last
                             &.to_i || 0

    new_number = (last_number + 1).to_s.rjust(5, "0")
    self.application_number = "##{state_code}-#{year}-#{new_number}"
  end

  def get_state_code
     if respond_to?(:address) && address&.state.present?
      address.state.upcase
     else
        "CA"
     end
  end

  def calculate_monthly_payment
    return unless loan_amount.present? && apr.present? && term_months.present?

    # Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    # Where: P = loan amount, r = monthly interest rate, n = number of months

    monthly_rate = (apr / 100) / 12

    if monthly_rate.zero?
      self.monthly_payment = loan_amount / term_months
    else
      self.monthly_payment = loan_amount *
        (monthly_rate * (1 + monthly_rate)**term_months) / ((1 + monthly_rate)**term_months - 1)
    end

    self.monthly_payment = monthly_payment.round(2)
  end

  def can_calculate_payment?
    loan_amount.present? && apr.present? && term_months.present?
  end

  def down_payment_plus_loan_equals_purchase_price
    return unless down_payment.present? && loan_amount.present? && purchase_price.present?

    total = down_payment + loan_amount
    unless (total - purchase_price).abs < 0.01
      errors.add(:base, "Down payment + Loan amount must equal Purchase price")
    end
  end
end
