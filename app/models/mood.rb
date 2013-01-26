class Mood < ActiveRecord::Base
  OPTIONS = [:happy, :neutral, :mad, :jealous, :frustrated, :angry, :leftout]

  belongs_to :user
  attr_accessible :label, :duration
end
