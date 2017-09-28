class CommentsController < ApplicationController

  def create
    @link = Link.find(params[:link_id])
    @comment = @link.comments.new(comment_params)
    @comment.user_id = session[:user_id]
    @comment.save
    # redirect_to link_path(@link)
  end

  def destroy
  end

  private
    def comment_params
      params.require(:comment).permit(:body)
    end

end
