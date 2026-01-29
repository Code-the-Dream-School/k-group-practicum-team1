# backend/app/controllers/api/v1/applications_controller.rb
module Api
  module V1
    class ApplicationsController < ApplicationController
      before_action :authenticate_user!

      # POST /api/v1/applications
      def create
        @application = current_user.applications.build(application_params)

        if @application.save
          render json: @application, status: :created
        else
          render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/applications/:id/review
      def update_review
        if current_user.loan_officer? || current_user.underwriter?
          application = Application.find_by(id: params[:id])
          unless application
            return render json: { error: "Application not found." }, status: :not_found
          end

          application_review = ApplicationReview.find_or_initialize_by(application_id: params[:id])

          if application_review.update(application_review_params)
            # Set reviewed_by_id and review_completed_at if all checks are complete
            if application_review.personal_info_complete &&
               application_review.vehicle_info_complete &&
               application_review.financial_info_complete &&
               application_review.documents_complete
              application_review.update_columns(
                reviewed_by_id: current_user.id,
                review_completed_at: Time.current
              )
            end

            render json: application_review, status: :ok
          else
            render json: { errors: application_review.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: "Unauthorized" }, status: :forbidden
        end
      end

      private

      def application_params
        params.require(:application).permit(
          :purchase_price,
          :loan_amount,
          :down_payment,
          :term_months,
          :apr
        )
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
