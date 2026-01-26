class ApplicationReview < ApplicationRecord
  belongs_to :application
  belongs_to :reviewer, class_name: "User", foreign_key: "reviewed_by_id", optional: true

  validates :application_id, presence: true, uniqueness: true
  validates :personal_info_complete, inclusion: { in: [ true, false ] }
  validates :vehicle_info_complete, inclusion: { in: [ true, false ] }
  validates :financial_info_complete, inclusion: { in: [ true, false ] }
  validates :documents_complete, inclusion: { in: [ true, false ] }
  validates :credit_check_authorized, inclusion: { in: [ true, false ] }

  def all_complete?
    personal_info_complete &&
      vehicle_info_complete &&
      financial_info_complete &&
      documents_complete &&
      credit_check_authorized
  end

  def mark_as_completed!(reviewer_user)
    update!(
      reviewed_by_id: reviewer_user.id,
      review_completed_at: Time.current
    )
  end
end
