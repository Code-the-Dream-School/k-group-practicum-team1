# backend/app/controllers/api/v1/application_reviews_controller.rb
module Api
  module V1
    class ApplicationReviewController < ApplicationController
      before_action :authenticate_user!
      before_action :authorize_reviewer!

      # PATCH /api/v1/applications/:application_id/review
      def update
        application = Application.find_by(id: params[:application_id])
        unless application
          return render json: { error: "Application not found." }, status: :not_found
        end

        application_review = ApplicationReview.find_or_initialize_by(application_id: params[:application_id])

        if application_review.update(application_review_params)
          # Mark as completed if all checks are done
          if application_review.all_complete?
            application_review.mark_as_completed!(current_user)
          end

          render json: application_review, status: :ok
        else
          render json: { errors: application_review.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def authorize_reviewer!
        unless current_user.loan_officer? || current_user.underwriter?
          render json: { error: "Unauthorized. Only loan officers and underwriters can review applications." }, status: :forbidden
        end
      end

      def application_review_params
        params.require(:application_review).permit(
          :personal_info_complete,
          :vehicle_info_complete,
          :financial_info_complete,
          :documents_complete,
          :credit_check_authorized,
          :review_notes
        )
      end
    end
  end
end
