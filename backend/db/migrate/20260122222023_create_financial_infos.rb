class CreateFinancialInfos < ActiveRecord::Migration[8.0]
  def change
    create_table :financial_infos do |t|
      t.references :application, null: false, foreign_key: true, index: { unique: true }
      t.string :employment_status
      t.string :employer
      t.string :job_title
      t.decimal :years_employed, precision: 4, scale: 1
      t.decimal :annual_income, precision: 12, scale: 2
      t.decimal :additional_income, precision: 12, scale: 2
      t.decimal :monthly_expenses, precision: 12, scale: 2
      t.string :credit_score

      t.timestamps
    end
  end
end
