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
    end
  end
end
