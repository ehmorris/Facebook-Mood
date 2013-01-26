class ApplicationController < ActionController::Base
  include Clearance::Authentication
  protect_from_forgery

  def index
    if request.fullpath =~ /\/moods\/new/
      session[:redirect_after_signin_to] = request.fullpath
    end
    @user = User.new
  end
end
