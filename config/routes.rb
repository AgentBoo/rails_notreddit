Rails.application.routes.draw do
  resource  :session, only: [:new, :create, :destroy]
  resources :users
  resources :links do
    resources :comments
    resources :link_upvotes, only: [:create]
    resources :link_downvotes, only: [:create]
  end

  resources :comments do
    resources :comments
  end





  root to: 'links#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
