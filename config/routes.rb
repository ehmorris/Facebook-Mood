FbhappinessApp::Application.routes.draw do

  # Update routes for extended User controllers.
  resource :users, :controller => 'users', :only => :create

  # Sign up and sign in are the same action.
  match '/sign_up' => 'clearance/sessions#new'

  resources :moods, :only => [:index, :new, :create]

  constraints Clearance::Constraints::SignedOut.new do
    root to: 'application#index'
  end

  constraints Clearance::Constraints::SignedIn.new do
    root to: 'moods#index'
  end

end
