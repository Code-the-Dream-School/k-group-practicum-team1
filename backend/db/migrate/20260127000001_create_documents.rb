class CreateDocuments < ActiveRecord::Migration[8.0]
  def change
    create_table :documents do |t|
      t.references :application, null: false, foreign_key: true
      t.string :document_name
      t.string :description
      t.string :file_url

      t.timestamps
    end
  end
end
