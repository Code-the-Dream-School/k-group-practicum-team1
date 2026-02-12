module Api
  module V1
    class DocumentsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_application
      before_action :authorize_user!
      before_action :set_document, only: [ :destroy ]

      # POST /api/v1/applications/:application_id/documents
      def create
        document = @application.documents.build(
          document_name: params[:document][:document_name],
          description: params[:document][:description]
        )

        document.file_url = params[:document][:file_url]

        if document.save
          render json: document_response(document), status: :created
        else
          render json: { error: "Document upload failed", errors: document.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/applications/:application_id/documents/:id
      def destroy
        if @document.file_url.present?
          @document.remove_file_url!
          @document.save!
        end
        @document.destroy

        render json: { message: "Document deleted successfully" }, status: :ok
      end

      private

      def set_application
        @application = Application.find_by(id: params[:application_id])
        render json: { error: "Application not found" }, status: :not_found unless @application
      end

      def set_document
        @document = @application.documents.find_by(id: params[:id])
        render json: { error: "Document not found" }, status: :not_found unless @document
      end

      def authorize_user!
        unless current_user == @application.user || current_user.loan_officer? || current_user.underwriter?
          render json: { error: "Unauthorized" }, status: :unauthorized
        end
      end

      def document_response(doc)
        {
          id: doc.id,
          application_id: doc.application_id,
          document_name: doc.document_name,
          description: doc.description,
          file_url: doc.file_url.presence,
          created_at: doc.created_at,
          updated_at: doc.updated_at
        }
      end
    end
  end
end
