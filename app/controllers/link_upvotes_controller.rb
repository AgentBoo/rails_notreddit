class LinkUpvotesController < ApplicationController
  def create
    @link = Link.find(params[:link_id])
    if !@link.link_upvotes.find_by :user_id => session[:user_id]
        @upvote = @link.link_upvotes.new(:user_id => session[:user_id])
        @upvote.save
    end
    if  @link.link_downvotes.find_by :user_id => session[:user_id]
        @link.link_downvotes.find_by(:user_id => session[:user_id]).destroy
    end
    redirect_to links_path
  end

  # def destroy
  #   @link = Link.find(params[:link_id])
  #   @vote = @link.link_upvotes.find_by :user_id => session[:user_id]
  #   if @vote
  #     @vote.destroy
  #   end
  #   redirect_to links_path
  # end

end
