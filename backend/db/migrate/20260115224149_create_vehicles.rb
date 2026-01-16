class CreateVehicles < ActiveRecord::Migration[8.0]
  def change
    create_table :vehicles do |t|
      t.references :application, null: false, foreign_key: true, index: { unique: true }
      t.string :vehicle_type, null: false
      t.integer :year, null: false
      t.string :make, null: false
      t.string :model, null: false
      t.string :trim
      t.string :vin, null: false
      t.integer :mileage

      t.timestamps
    end

    add_index :vehicles, :vin, unique: true
  end
end
