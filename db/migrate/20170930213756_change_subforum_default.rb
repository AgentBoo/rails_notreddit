class ChangeSubforumDefault < ActiveRecord::Migration[5.1]
  def up
    change_column_default :links, :subforum, 'all'
  end

  def down
    change_column_default :links, :subforum, nil
  end
end
