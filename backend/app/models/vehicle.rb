class Vehicle < ApplicationRecord
  belongs_to :application

  enum :vehicle_type, {
    new_vehicle: "new",
    certified_used: "certified_used",
    used: "used"
  }

  validates :application_id, uniqueness: true
  validates :vehicle_type, presence: true
  validates :year, presence: true,
            numericality: { only_integer: true, greater_than_or_equal_to: 1900, less_than_or_equal_to: ->(_) { Date.current.year + 1 } }
  validates :make, presence: true
  validates :model, presence: true
  validates :trim, presence: false
  validates :vin, presence: true, uniqueness: true,
            format: { with: /\A[A-HJ-NPR-Z0-9]{17}\z/, message: "must be 17 characters (excluding I, O, Q)" }
  validates :mileage, numericality: { only_integer: true, greater_than_or_equal_to: 0 },
            allow_nil: true
  validates :vehicle_value, numericality: { greater_than: 0 },
            allow_nil: true

  before_validation :normalize_vin

  private

  def normalize_vin
    self.vin = vin&.upcase&.strip
  end
end
