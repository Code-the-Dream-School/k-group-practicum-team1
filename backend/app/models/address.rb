class Address < ApplicationRecord
  belongs_to :application, optional: true

  VALID_STATES = %w[
    AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN
    MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY
  ]

  validates :address_street, presence: true
  validates :city, presence: true
  validates :state, 
            presence: true, 
            inclusion: { in: VALID_STATES, message: "%{value} is not a valid US state abbreviation" }
  validates :zip,
            presence: true,
            format: { with: /\A\d{5}(-\d{4})?\z/, message: "must be a valid ZIP code" }
end
