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

ActiveRecord::Schema[8.0].define(version: 2026_01_13_212956) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.string "street", null: false
    t.string "city", null: false
    t.string "state", null: false
    t.string "zip", null: false
    t.bigint "application_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index [ "application_id" ], name: "index_addresses_on_application_id"
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
    t.index [ "application_number" ], name: "index_applications_on_application_number", unique: true
    t.index [ "status" ], name: "index_applications_on_status"
    t.index [ "user_id" ], name: "index_applications_on_user_id"
  end

  create_table "jwt_denylists", force: :cascade do |t|
    t.string "jti"
    t.datetime "exp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index [ "jti" ], name: "index_jwt_denylists_on_jti"
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
    t.index [ "email" ], name: "index_users_on_email", unique: true
    t.index [ "phone_number" ], name: "index_users_on_phone_number", unique: true
  end

  add_foreign_key "addresses", "applications"
  add_foreign_key "applications", "users"
end
