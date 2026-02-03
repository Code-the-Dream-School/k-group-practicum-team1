class PersonalInfo < ApplicationRecord
  belongs_to :application

  validates :application_id, uniqueness: true
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone_number, presence: true, length: { is: 10 }
  validates :dob, presence: true
  validates :ssn, presence: true, length: { is: 9 }
  validate :validate_date_of_birth

  private

  def validate_date_of_birth
    return if dob.blank?

    unless dob.match?(/\A\d{2}\/\d{2}\/\d{4}\z/)
      errors.add(:dob, "must be in format mm/dd/yyyy")
      return
    end

    begin
      birth_date = Date.strptime(dob, "%m/%d/%Y")
      age = ((Date.today - birth_date) / 365).floor

      errors.add(:dob, "must be at least 18 years old") if age < 18
    rescue ArgumentError
      errors.add(:dob, "is not a valid date")
    end
  end
end
