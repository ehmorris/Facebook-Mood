class Mood < ActiveRecord::Base
  validates :presence => true
  belongs_to :user
end
