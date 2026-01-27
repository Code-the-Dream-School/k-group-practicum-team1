class CreateApplicationReviews < ActiveRecord::Migration[8.0]
  def change
    create_table :application_reviews do |t|
      t.references :application, null: false, foreign_key: true, index: { unique: true }
      t.boolean :personal_info_complete, default: false
      t.boolean :vehicle_info_complete, default: false
      t.boolean :financial_info_complete, default: false
      t.boolean :documents_complete, default: false
      t.boolean :credit_check_authorized, default: false
      t.references :reviewed_by, foreign_key: { to_table: :users }
      t.datetime :review_completed_at
      t.text :review_notes

      t.timestamps
    end
  end
end
