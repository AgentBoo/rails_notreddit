class SessionsController < ApplicationController

# no special action, display new.html.erb
# GET /login
def new
end

# login a user: look up if exists, authenticate, add to session, redirect to back where they came from or redirect back to login after failed attempt
def create
  user = User.find_by_email(params[:email])

  if user && user.authenticate(params[:password])
    session[:user_id] = user.id
    redirect_to root_path        # aka sessions#new subject to change?
  else
    redirect_to new_session_path # back to login at sessions#new
  end
end


# logout a user: destroy a user! :D
def destroy
  session[:user_id] = nil
  redirect_to links_path    # back to login sessions#new
end




end
# last end, end, end, the end.
