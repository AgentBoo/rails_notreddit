class CommentsController < ApplicationController
  before_action :find_reply

  def new
    @comment = Comment.new
  end

  def create
    @comment = @reply.comments.new(comment_params)
    @comment.user_id = session[:user_id]

    if @comment.save
      redirect_back(fallback_location: root_path)
    else
      redirect_back(fallback_location: root_path)
    end
  end

  private
  def comment_params
    params.require(:comment).permit(:body)
  end

  def find_reply
    @reply = Comment.find_by_id(params[:comment_id]) if params[:comment_id]
    @reply = Link.find_by_id(params[:link_id]) if params[:link_id]
  end

end
