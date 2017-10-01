class AddNotesToLinks < ActiveRecord::Migration[5.1]
  def change
    add_column :links, :notes, :text
  end
end
