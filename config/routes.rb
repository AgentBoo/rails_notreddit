Rails.application.routes.draw do
  
  # resources :comments
  resources :links do
    resources :comments
    resources :up_votes, only: [:create, :destroy]
  end
  resources :users, only: [:new, :create]

  # one resource ok -- sessions controller only ahs 3 actions
  resource  :session, only: [:new, :create, :destroy]


  root to:  'links#index'
end



# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
