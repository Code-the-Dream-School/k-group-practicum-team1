# frozen_string_literal: true

class DeviseCreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :phone_number, null: false
      t.integer :role, null: false
      t.string :email, null: false
      t.string :encrypted_password, null: false

      t.timestamps null: false
    end

    add_index :users, :email,                unique: true
    add_index :users, :phone_number,         unique: true
  end
end
