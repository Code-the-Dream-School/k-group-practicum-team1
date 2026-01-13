# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json

   before_action :sign_out_existing_user, only: [ :create ]

  private

  def sign_out_existing_user
    sign_out(current_user) if current_user
    request.reset_session
  end

  def respond_with(resource, _opts = {})
  token = request.env["warden-jwt_auth.token"]
    render json: {
      status: { code: 200, message: "Logged in successfully.", token: token }
    }, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: { code: 200, message: "Logged out successfully." }
      }, status: :ok
    else
      render json: {
        status: { code: 401, message: "Couldn't find an active session." }
      }, status: :unauthorized
    end
  end
end
