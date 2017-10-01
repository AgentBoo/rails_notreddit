class CreateLinkUpvotes < ActiveRecord::Migration[5.1]
  def change
    create_table :link_upvotes do |t|
      t.references :link, foreign_key: true
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
