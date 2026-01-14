class Address < ApplicationRecord
  belongs_to :application, optional: true

  validates :street, presence: true
  validates :city, presence: true
  validates :state, presence: true
  validates :zip,
            presence: true,
            format: { with: /\A\d{5}(-\d{4})?\z/, message: "must be a valid ZIP code" }
end
