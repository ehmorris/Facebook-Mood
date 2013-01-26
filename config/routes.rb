FbhappinessApp::Application.routes.draw do

  constraints Clearance::Constraints::SignedOut.new do
    root to: 'application#index'
  end

  constraints Clearance::Constraints::SignedIn.new do
    root to: 'moods#index'
    resources :moods
  end

end
