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
          applications: applications.map { |a| ApplicationSerializer.list_item(a) },
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

      def index_scope
        if current_user.customer?
          current_user.applications.includes(:user)
        else
          Application.includes(:user)
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
