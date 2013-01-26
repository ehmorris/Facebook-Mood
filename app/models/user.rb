class User < ActiveRecord::Base
  include Clearance::User
  has_many :moods, dependent: :destroy, :order => 'created_at desc'
end
