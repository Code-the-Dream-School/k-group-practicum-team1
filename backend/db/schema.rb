# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_02_03_015153) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.string "address_street", null: false
    t.string "city", null: false
    t.string "state", null: false
    t.string "zip", null: false
    t.bigint "application_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_id"], name: "index_addresses_on_application_id"
  end

  create_table "application_reviews", force: :cascade do |t|
    t.bigint "application_id", null: false
    t.boolean "personal_info_complete", default: false
    t.boolean "vehicle_info_complete", default: false
    t.boolean "financial_info_complete", default: false
    t.boolean "documents_complete", default: false
    t.boolean "credit_check_authorized", default: false
    t.bigint "reviewed_by_id"
    t.datetime "review_completed_at"
    t.text "review_notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_id"], name: "index_application_reviews_on_application_id", unique: true
    t.index ["reviewed_by_id"], name: "index_application_reviews_on_reviewed_by_id"
  end

  create_table "applications", force: :cascade do |t|
    t.string "application_number", null: false
    t.bigint "user_id", null: false
    t.string "status", default: "draft", null: false
    t.decimal "purchase_price", precision: 12, scale: 2
    t.decimal "loan_amount", precision: 12, scale: 2
    t.decimal "down_payment", precision: 12, scale: 2
    t.integer "term_months"
    t.decimal "apr", precision: 5, scale: 2
    t.decimal "monthly_payment", precision: 12, scale: 2
    t.string "application_progress", default: "personal", null: false
    t.date "submitted_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_number"], name: "index_applications_on_application_number", unique: true
    t.index ["status"], name: "index_applications_on_status"
    t.index ["user_id"], name: "index_applications_on_user_id"
  end

  create_table "financial_infos", force: :cascade do |t|
    t.bigint "application_id", null: false
    t.string "employment_status"
    t.string "employer"
    t.string "job_title"
    t.decimal "years_employed", precision: 4, scale: 1
    t.decimal "annual_income", precision: 12, scale: 2
    t.decimal "additional_income", precision: 12, scale: 2
    t.decimal "monthly_expenses", precision: 12, scale: 2
    t.string "credit_score"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_id"], name: "index_financial_infos_on_application_id", unique: true
  end

  create_table "jwt_denylists", force: :cascade do |t|
    t.string "jti"
    t.datetime "exp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["jti"], name: "index_jwt_denylists_on_jti"
  end

  create_table "personal_infos", force: :cascade do |t|
    t.bigint "application_id", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "phone_number"
    t.string "dob"
    t.string "ssn"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_id"], name: "index_personal_infos_on_application_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "phone_number", null: false
    t.integer "role", null: false
    t.string "email", null: false
    t.string "encrypted_password", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["phone_number"], name: "index_users_on_phone_number", unique: true
  end

  create_table "vehicles", force: :cascade do |t|
    t.bigint "application_id", null: false
    t.string "vehicle_type", null: false
    t.integer "year", null: false
    t.string "make", null: false
    t.string "model", null: false
    t.string "trim"
    t.string "vin", null: false
    t.integer "mileage"
    t.decimal "vehicle_value", precision: 12, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_id"], name: "index_vehicles_on_application_id", unique: true
    t.index ["vin"], name: "index_vehicles_on_vin", unique: true
  end

  add_foreign_key "addresses", "applications"
  add_foreign_key "application_reviews", "applications"
  add_foreign_key "application_reviews", "users", column: "reviewed_by_id"
  add_foreign_key "applications", "users"
  add_foreign_key "financial_infos", "applications"
  add_foreign_key "personal_infos", "applications"
  add_foreign_key "vehicles", "applications"
end
