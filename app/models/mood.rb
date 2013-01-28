class Mood < ActiveRecord::Base
  OPTIONS = [
    :excited,
    :optimistic,
    :important,
    :entertained,
    :happy,
    :neutral,
    :angry,
    :jealous,
    :frustrated,
    #:leftout,
    :anxious,
    :disturbed,
    :shocked
  ]

  belongs_to :user
  attr_accessible :label, :duration
end
