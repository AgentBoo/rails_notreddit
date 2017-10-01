class SessionsController < ApplicationController

  # GET /login -- no special action, just display new.html.erb
  def new
  end

  # POST /login -- look up if user exists, authenticate, add to session, redirect to root or back to login after failed authentication
  def create
    user = User.find_by_email(params[:email])

    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to root_path
    else
      redirect_to new_session_path                                              # 'sessions#new'
    end
  end

  # DESTROY THE USER !!!
  def destroy
    session[:user_id] = nil
    redirect_to root_path
  end
end
