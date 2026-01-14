class CreateApplications < ActiveRecord::Migration[8.0]
  def change
    create_table :applications do |t|
      t.string :application_number, null: false
      t.references :user, null: false, foreign_key: true
      t.string :status, null: false, default: 'draft'
      t.decimal :purchase_price, precision: 12, scale: 2
      t.decimal :loan_amount, precision: 12, scale: 2
      t.decimal :down_payment, precision: 12, scale: 2
      t.integer :term_months
      t.decimal :apr, precision: 5, scale: 2
      t.decimal :monthly_payment, precision: 12, scale: 2
      t.string :application_progress, null: false, default: 'personal'
      t.date :submitted_date

      t.timestamps
    end

    add_index :applications, :application_number, unique: true
    add_index :applications, :status
  end
end
