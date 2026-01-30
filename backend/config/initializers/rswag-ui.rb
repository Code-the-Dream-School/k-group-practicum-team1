# backend/config/initializers/rswag-ui.rb
require "rswag/ui"
Rswag::Ui.configure do |c|
  c.openapi_endpoint "/swagger.yaml", "CTD AutoLoan API V1"
end
