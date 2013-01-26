class Clearance::SessionsController < ApplicationController
  unloadable

  skip_before_filter :authorize, :only => [:create, :new, :destroy]
  protect_from_forgery :except => :create

  def create
    @user = authenticate(params)

    if @user.nil?
      @user = User.new
      flash_failure_after_create
      render :action => 'index', :controller => 'application'
    else
      sign_in @user
      redirect_back_or url_after_create
    end
  end

  def destroy
    sign_out
    redirect_to url_after_destroy
  end

  private

  def flash_failure_after_create
    flash.now[:notice] = 'bad email or password'.html_safe
  end

  def url_after_create
    session[:redirect_after_signin_to] || '/'
  end

  def url_after_destroy
    root_path
  end
end
