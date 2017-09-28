class CreateLinks < ActiveRecord::Migration[5.1]
  def change
    create_table :links do |t|
      t.string :title
      t.text :url
      t.string :media
      t.string :sub
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
