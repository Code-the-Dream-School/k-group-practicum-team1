class ChangeVinToAllowNullInVehicles < ActiveRecord::Migration[8.0]
  def change
    change_column_null :vehicles, :vin, true
  end
end
