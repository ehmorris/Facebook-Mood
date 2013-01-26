class MoodsController < ApplicationController
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
end
