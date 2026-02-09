module Api
  module V1
    class ApplicationsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_application, only: [ :show, :update ]
      before_action :authorize_user!, only: [ :show, :update ]
      before_action :enforce_update_permissions!, only: [ :update ]

      # POST /api/v1/applications
      def create
        @application = current_user.applications.build(application_params)
        if @application.save
          render json: ApplicationSerializer.new(@application).as_json, status: :created
        else
          render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/applications
      def index
        scope = index_scope
        scope = apply_index_filters(scope) if current_user.loan_officer? || current_user.underwriter?
        scope = apply_index_sort(scope)
        total = scope.count
        page = [ params[:page].to_i, 1 ].max
        per_page = 20
        offset = (page - 1) * per_page
        applications = scope.limit(per_page).offset(offset)
        total_pages = (total.to_f / per_page).ceil
        render json: {
          applications: applications.map { |a| ApplicationSerializer.list_item(a, logged_in_user: current_user) },
          meta: {
            total: total,
            count: applications.size,
            current_page: page,
            total_pages: total_pages
          }
        }, status: :ok
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

      def enforce_update_permissions!
        return if @application.nil?
        unless @application.draft? || @application.pending? || @application.under_review?
          render json: { errors: [ "Only draft, pending, or under review applications can be updated" ] }, status: :forbidden
          return
        end
        if current_user.loan_officer? || current_user.underwriter?
          if @application.draft?
            render json: { errors: [ "Draft applications cannot be updated by loan officers or underwriters" ] }, status: :forbidden
          end
        elsif !@application.draft?
          render json: { errors: [ "Only draft applications can be updated" ] }, status: :forbidden
        end
      end

      def application_params
        if params[:application].present?
          application_params = params.require(:application).dup
          application_params.delete(:submitted_date)
          application_params.delete(:vehicle_attributes) if application_params[:vehicle_attributes].blank?
          application_params.delete(:financial_info_attributes) if application_params[:financial_info_attributes].blank?

          permitted_params = [
            :purchase_price, :loan_amount, :down_payment,
            :term_months, :apr, :monthly_payment, :application_progress,
            {
              personal_info_attributes: [
                :id, :first_name, :last_name, :email,
                :phone_number, :dob, :ssn
              ],
              addresses_attributes: [
                :id, :address_type, :address_street, :city, :state, :zip
              ],
              vehicle_attributes: [
                :id, :vehicle_type, :make, :model, :year, :vin, :trim, :mileage
              ],
              financial_info_attributes: [
                :id, :employment_status, :employer, :job_title, :years_employed,
                :annual_income, :additional_income, :monthly_expenses,
                :credit_score
              ],
              application_review_attributes: [
                :id, :review_notes
              ]
            }
          ]
          permitted_params << :status if current_user.loan_officer? || current_user.underwriter?

          application_params.permit(*permitted_params)
        else
          raise ActionController::ParameterMissing.new(:application), "Request must include 'application' key in JSON body"
        end
      end

      def index_scope
        if current_user.customer?
          current_user.applications
        else
          Application.includes(:user).where.not(status: :draft)
        end
      end

      def apply_index_filters(scope)
        scope = scope.where("application_number ILIKE ?", "%#{sanitize_like(params[:application_number])}%") if params[:application_number].present?
        scope = scope.where(status: params[:status]) if params[:status].present? && Application.statuses.key?(params[:status])
        if params[:applicant_name].present?
          q = "%#{sanitize_like(params[:applicant_name])}%"
          scope = scope.joins(:user).where("users.first_name ILIKE :q OR users.last_name ILIKE :q", q: q)
        end
        scope
      end

      def apply_index_sort(scope)
        if current_user.customer?
          scope.order(created_at: :desc)
        else
          sort_by = %w[application_number status submitted_date created_at].include?(params[:sort_by]) ? params[:sort_by] : "created_at"
          sort_order = params[:sort_order].to_s.downcase == "asc" ? :asc : :desc
          scope.order(Application.arel_table[sort_by].send(sort_order))
        end
      end

      def sanitize_like(value)
        return "" if value.blank?

        ActiveRecord::Base.sanitize_sql_like(value.to_s)
      end
    end
  end
end
