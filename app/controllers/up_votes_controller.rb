class UpVotesController < ApplicationController

  def create
    @link = Link.find(params[:link_id])
    @vote = @link.up_votes.new(:user_id => session[:user_id])
  
    @vote.save
    # redirect_to link_path(@link)
  end

  def destroy
    @link = Link.find(params[:link_id])
    @vote = @link.up_votes.find_by :user_id => session[:user_id]
    @vote.destroy
    # redirect_to link_path(@link)
  end


end
