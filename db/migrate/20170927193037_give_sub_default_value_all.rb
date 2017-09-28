class GiveSubDefaultValueAll < ActiveRecord::Migration[5.1]
  def up
    change_column_default :links, :sub, 'all'
  end

  def down
    change_column_default :links, :sub, { :from => 'all', :to => ''}
  end

end
