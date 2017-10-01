class CreateComments < ActiveRecord::Migration[5.1]
  def change
    create_table :comments do |t|
      t.text :body
      t.integer :reply_id
      t.string :reply_type

      t.timestamps
    end
  end
end
