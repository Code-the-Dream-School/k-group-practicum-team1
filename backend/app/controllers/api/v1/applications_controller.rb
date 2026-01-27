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
          render json: @application, status: :created
        else
          render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/applications/:id
      def show
        render json: application_json(@application), status: :ok
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
        params.require(:application).permit(
          :purchase_price, :loan_amount, :down_payment,
          :term_months, :apr, :application_progress
        )
      end

      def application_json(app)
        {
          id: app.id,
          application_number: app.application_number,
          status: app.status,
          purchase_price: app.purchase_price,
          loan_amount: app.loan_amount,
          down_payment: app.down_payment,
          term_months: app.term_months,
          apr: app.apr,
          monthly_payment: app.monthly_payment,
          application_progress: app.application_progress,
          submitted_date: app.submitted_date,
          user_id: app.user_id,
          vehicle: app.vehicle && {
            id: app.vehicle.id,
            vehicle_type: app.vehicle.vehicle_type,
            year: app.vehicle.year,
            make: app.vehicle.make,
            model: app.vehicle.model,
            trim: app.vehicle.trim,
            vin: app.vehicle.vin,
            mileage: app.vehicle.mileage,
            vehicle_value: app.vehicle.vehicle_value
          },
          addresses: app.addresses.map do |addr|
            {
              id: addr.id,
              address_street: addr.address_street,
              city: addr.city,
              state: addr.state,
              zip: addr.zip
            }
          end,
          financial_info: app.financial_info && {
            id: app.financial_info.id,
            employment_status: app.financial_info.employment_status,
            employer: app.financial_info.employer,
            job_title: app.financial_info.job_title,
            years_employed: app.financial_info.years_employed,
            annual_income: app.financial_info.annual_income,
            additional_income: app.financial_info.additional_income,
            monthly_expenses: app.financial_info.monthly_expenses,
            credit_score: app.financial_info.credit_score
          }
        }
      end
    end
  end
end
