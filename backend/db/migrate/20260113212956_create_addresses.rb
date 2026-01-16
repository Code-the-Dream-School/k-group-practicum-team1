class CreateAddresses < ActiveRecord::Migration[8.0]
  def change
    create_table :addresses do |t|
      t.string :address_street, null: false
      t.string :city, null: false
      t.string :state, null: false
      t.string :zip, null: false
      t.references :application, null: true, foreign_key: true

      t.timestamps
    end
  end
end
