class CreateLinks < ActiveRecord::Migration[5.1]
  def change
    create_table :links do |t|
      t.text :title
      t.text :url
      t.string :subforum

      t.timestamps
    end
  end
end
