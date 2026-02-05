class ChangeDobToDateInPersonalInfos < ActiveRecord::Migration[8.0]
  def up
    change_column :personal_infos, :dob, :date, using: 'dob::date'
  end

  def down
    change_column :personal_infos, :dob, :string, using: 'dob::text'
  end
end
