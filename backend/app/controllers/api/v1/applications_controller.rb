module Api
  module V1
    class ApplicationsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_application

      # GET /api/v1/applications/:id
      def show
        if unauthorized_access?
          render json: { errors: [ "Unauthorized" ] }, status: :unauthorized
          return
        end

        render json: application_json(@application), status: :ok
      end

      private

      def set_application
        @application = Application.includes(:vehicle, :addresses).find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { errors: [ "Application not found" ] }, status: :not_found
      end

      def unauthorized_access?
        current_user.customer? && @application.user_id != current_user.id
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
          end
        }
      end
    end
  end
end
