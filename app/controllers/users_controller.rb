class UsersController < Clearance::UsersController

  def create
    @user = user_from_params

    if @user.save
      sign_in @user
      redirect_back_or url_after_create
    else
      flash_failure_after_create
      render 'sessions/new'
    end
  end

  private

  def flash_failure_after_create
    flash.now[:notice] = 'bad email or password'.html_safe
  end

end
