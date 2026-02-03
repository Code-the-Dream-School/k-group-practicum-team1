module Api
  module V1
    class ApplicationsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_application, only: [ :show, :update ]
      before_action :authorize_user!, only: [ :show, :update ]
      before_action :ensure_draft_status!, only: [ :update ]

      # POST /api/v1/applications
      def create
        @application = current_user.applications.build(application_params)
        if @application.save
          render json: ApplicationSerializer.new(@application).as_json, status: :created
        else
          render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/applications/:id
      def show
        render json: ApplicationSerializer.new(@application).as_json, status: :ok
      end

      # PATCH /api/v1/applications/:id
      def update
        if @application.update(application_params)
          render json: ApplicationSerializer.new(@application).as_json, status: :ok
        else
          render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_application
        @application = Application.includes(:vehicle, :addresses, :financial_info).find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { errors: [ "Application not found" ] }, status: :not_found
      end

      def authorize_user!
        return if @application.nil?
        unless current_user == @application.user || current_user.loan_officer? || current_user.underwriter?
          render json: { errors: [ "Unauthorized" ] }, status: :unauthorized
        end
      end

      def ensure_draft_status!
        return if @application.nil?
        unless @application.draft?
          render json: { errors: [ "Only draft applications can be updated" ] }, status: :forbidden
        end
      end

      def application_params
        if params[:application].present?
          params.require(:application).permit(
            :purchase_price, :loan_amount, :down_payment,
            :term_months, :apr, :application_progress,
            personal_info_attributes: [
              :first_name, :last_name, :email,
              :phone_number, :dob, :ssn
            ],
            addresses_attributes: [
              :address_type, :address_street, :city, :state, :zip
            ],
            vehicle_attributes: [
              :vehicle_type, :make, :model, :year, :vin, :trim, :mileage
            ],
            financial_info_attributes: [
              :employment_status, :employer_name, :job_title, :years_employed,
               :annual_income, :additional_income, :monthly_expenses,
               :credit_score
            ],
          )
        else
          raise ActionController::ParameterMissing.new(:application), "Request must include 'application' key in JSON body"
        end
      end
    end
  end
end
