module Api
  module V1
    class UsersController < ApplicationController
#       skip_before_action :verify_authenticity_token
      before_action :authenticate_user!
      before_action :set_user, only: [ :show, :update, :destroy ]

      # GET /api/v1/users
      def index
        if current_user.loan_officer? || current_user.underwriter?
          users = User.all
          render json: users, status: :ok
        else
          render json: { errors: [ "Unauthorized" ] }, status: :unauthorized
        end
      end

      # GET /api/v1/users/:id
      def show
        if current_user.customer? && current_user != @user
          render json: { errors: [ "Unauthorized" ] }, status: :unauthorized
        else
          render json: @user, status: :ok
        end
      end

      # GET /api/v1/me - Everyone can see their own info
      def me
        render json: current_user, status: :ok
      end

      # PATCH/PUT /api/v1/users/:id
      def update
        if current_user.customer? && current_user != @user
          render json: { errors: [ "Unauthorized" ] }, status: :unauthorized
        elsif @user.update(user_params)
          render json: @user, status: :ok
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/users/:id
      def destroy
        unless current_user
          return render json: { errors: ["Unauthorized"] }, status: :unauthorized
        end
      # Only allow loan_officer or underwriter to delete any user
        unless current_user.loan_officer? || current_user.underwriter?
          return render json: { errors: ["Forbidden"] }, status: :forbidden
        end

        # Allow deleting a customer or themselves
        if current_user == @user || @user.customer?
          @user.destroy
          head :no_content
        else
          render json: { errors: ["Permission denied"] }, status: :forbidden
        end
      end

      private

      def set_user
        @user = User.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { errors: [ "User not found" ] }, status: :not_found
      end

      def user_params
        params.require(:user).permit(
          :first_name, :last_name, :email,
          :password, :password_confirmation,
          :phone_number, :role
        )
      end
    end
  end
end
