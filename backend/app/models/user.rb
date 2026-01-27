class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :validatable,
           :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  has_many :applications, dependent: :destroy
  has_many :reviewed_applications, class_name: "ApplicationReview", foreign_key: "reviewed_by_id", dependent: :nullify

  enum :role, { customer: 0, loan_officer: 1, underwriter: 2 }

  validates :email, presence: true, uniqueness: { case_sensitive: false },
            format: { with: URI::MailTo::EMAIL_REGEXP, message: "must be a valid email address" }
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :phone_number, presence: true, uniqueness: true,
            format: { with: /\A\+?\d{10,15}\z/, message: "must be a valid phone number" }
  validates :role, presence: true
end
