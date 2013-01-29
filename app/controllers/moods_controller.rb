class MoodsController < ApplicationController

  before_filter :redirect_to_sign_in, :unless => :signed_in?

  def index
    @moods = current_user.moods
  end

  def new
    @mood = current_user.moods.new
    @mood.duration = params[:duration] || 0
  end

  def create
    @mood = current_user.moods.create(params[:mood])
    redirect_to :root
  end

  private

  def redirect_to_sign_in
    store_location # we want to come back after login.
    redirect_to(sign_in_url)
  end

end
