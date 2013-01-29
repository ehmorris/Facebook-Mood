class AddLabelToMood < ActiveRecord::Migration
  def change
    create_table :moods do |t|
      t.string  :label
      t.integer :duration # integer in seconds.
      t.integer :user_id
      t.timestamps
    end
  end
end