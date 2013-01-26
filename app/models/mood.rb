class Mood < ActiveRecord::Base
  OPTIONS = [:happy, :neutral, :angry, :jealous, :frustrated, :disturbed, :leftout]

  belongs_to :user
  attr_accessible :label, :duration
end
