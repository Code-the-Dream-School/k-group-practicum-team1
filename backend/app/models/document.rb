class Document < ApplicationRecord
  belongs_to :application

  validates :application_id, presence: true
  validates :document_name, presence: true

  mount_uploader :file_url, DocumentUploader
end
