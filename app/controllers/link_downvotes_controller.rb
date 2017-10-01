class LinkDownvotesController < ApplicationController
  def create
    @link = Link.find(params[:link_id])

    if !@link.link_downvotes.find_by(:user_id => session[:user_id])
        @downvote = @link.link_downvotes.new(:user_id => session[:user_id])
        @downvote.save
    end
    if  @link.link_upvotes.find_by(:user_id => session[:user_id])
        @link.link_upvotes.find_by(:user_id => session[:user_id]).destroy
    end
    redirect_to links_path
  end

  # def destroy
  #   @link = Link.find(params[:link_id])
  #   @downvote = @link.link_downvotes.find_by :user_id => session[:user_id]
  #   if @downvote
  #     @downvote.destroy
  #   end
  #   redirect_to links_path
  # end

end
