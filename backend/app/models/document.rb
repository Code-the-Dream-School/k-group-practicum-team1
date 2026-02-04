class Document < ApplicationRecord
  belongs_to :application

  validates :application_id, presence: true
  validates :document_name, presence: true
  validates :file_url, presence: true
end
