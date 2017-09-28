class LinksController < ApplicationController

# GET /links links_path --homepage
  def index
    @links = Link.all            # Link.find(:all)
  end

# GET /links/new links_path --hyperlink 'new link' from homepage
  def new
    @link = Link.new
  end

# POST /links links_path --submit btn in 'new link'
  def create
    @link = Link.new(link_params)
    @link.user_id = session[:user_id]
    @link.save
    redirect_to links_path
  end

  def show
    @link = Link.find(params[:id])
  end

  def edit
    @link = Link.find(params[:id])
  end

  def update
    @link = Link.find(params[:id])
    @link.update(link_params)
    @link.save
    redirect_to link_path
  end

  private
  def link_params
    params.require(:link).permit(:title, :url, :media, :sub)
  end


end
