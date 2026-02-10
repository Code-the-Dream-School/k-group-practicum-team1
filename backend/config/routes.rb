# backend/config/routes.rb
Rails.application.routes.draw do
  devise_for :users,
             path: "",
             path_names: {
               sign_in: "login",
               sign_out: "logout",
               registration: "signup"
             },
             controllers: {
               sessions: "users/sessions",
               registrations: "users/registrations"
             }
  namespace :api do
    namespace :v1 do
      resources :users
      resources :applications, only: [ :index, :show, :create, :update ] do
        resource :review, only: [ :update ], controller: "application_review"
      end
      get "/me", to: "users#me"
    end
  end

  # Serve Swagger UI at /api-docs
  mount Rswag::Ui::Engine => "/api-docs"
  mount Rswag::Api::Engine => "/api-docs"

  get "up" => "rails/health#show", as: :rails_health_check
end
