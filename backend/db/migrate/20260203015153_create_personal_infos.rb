class CreatePersonalInfos < ActiveRecord::Migration[8.0]
  def change
    create_table :personal_infos do |t|
      t.references :application, null: false, foreign_key: true, index: { unique: true }
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :phone_number
      t.string :dob
      t.string :ssn

      t.timestamps
    end
  end
end
