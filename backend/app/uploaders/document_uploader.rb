# app/uploaders/document_uploader.rb
class DocumentUploader < CarrierWave::Uploader::Base
  include Cloudinary::CarrierWave

  def extension_allowlist
    %w[jpg jpeg png pdf doc docx xls xlsx odt ods rtf txt csv]
  end

  def content_type_allowlist
     %w[image/jpeg image/jpg image/png]
  end

  private

  def default_url(*args)
    if file.present?
      file.url
    else
      nil
    end
  end
end
