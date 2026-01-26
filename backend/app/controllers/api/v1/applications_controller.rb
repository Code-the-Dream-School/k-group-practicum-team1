# backend/app/controllers/api/v1/applications_controller.rb
module Api
  module V1
    class ApplicationsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_application, only: [:update]
      before_action :authorize_user!, only: [:update]
      before_action :ensure_draft_status!, only: [:update]

      # POST /api/v1/applications
      def create
        @application = current_user.applications.build(application_params)
        if @application.save
          render json: @application, status: :created
        else
          render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/applications/:id
      def update
        if @application.update(application_params)
          render json: @application, status: :ok
        else
          render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_application
        @application = Application.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { errors: ["Application not found"] }, status: :not_found
      end

      def authorize_user!
        return if @application.nil?
        unless current_user == @application.user || current_user.loan_officer? || current_user.underwriter?
          render json: { errors: ["Unauthorized"] }, status: :unauthorized
        end
      end

      def ensure_draft_status!
        return if @application.nil?
        unless @application.draft?
          render json: { errors: ["Only draft applications can be updated"] }, status: :forbidden
        end
      end

      def application_params
        params.require(:application).permit(
          :purchase_price, :loan_amount, :down_payment,
          :term_months, :apr, :application_progress
        )
      end
    end
  end
end
