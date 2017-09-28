class UpVotesController < ApplicationController

  def create
    @link = Link.find(params[:link_id])
    if !@link.up_votes.find_by :user_id => session[:user_id]
      @vote = @link.up_votes.new(:user_id => session[:user_id])
      @vote.save
    end
    redirect_to links_path
  end

  def destroy
    @link = Link.find(params[:link_id])
    @vote = @link.up_votes.find_by :user_id => session[:user_id]
    @vote.destroy
    redirect_to links_path
  end


end
