class User < ActiveRecord::Base
  include Clearance::User
  has_many :moods, :dependent => :destroy
end
