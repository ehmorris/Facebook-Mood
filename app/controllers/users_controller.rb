class UsersController < ApplicationController
  skip_before_filter :authorize, :only => [:create, :new]
  before_filter :redirect_to_root, :only => [:create, :new], :if => :signed_in?

  def create
    @user = user_from_params

    if @user.save
      sign_in @user
      redirect_back_or url_after_create
    else
      flash_failure_after_create
      render :action => 'index', :controller => 'application'
    end
  end

  def show
    @user = current_user
  end

  private

  def url_after_create
    session[:redirect_after_signin_to] || '/'
  end

  def flash_failure_after_create
    flash.now[:notice] = 'bad email or password'.html_safe
  end

  def user_from_params
    user_params = params[:user] || Hash.new
    email = user_params.delete(:email)
    password = user_params.delete(:password)

    Clearance.configuration.user_model.new(user_params).tap do |user|
      user.email = email
      user.password = password
    end
  end
end
