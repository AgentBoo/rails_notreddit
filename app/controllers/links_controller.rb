class LinksController < ApplicationController


  def index
    @links = Link.all
  end

  def new
    @link = Link.new
  end

  def create
    @link = Link.new(link_params)
    @link.user_id = session[:user_id]
    @link.save
    redirect_to link_path(@link)
  end

  def show
    @link = Link.find(params[:id])
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private
  def link_params
    params.require(:link).permit(:title, :url, :subforum)
  end

end
