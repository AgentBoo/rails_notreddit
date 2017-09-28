//terminal
rails new notreddit

//terminal
rails generate controller frontPage index     // creates frontPage_controller.rb and corresponding index.html.erb

//config/routes.rb
Rails.application.routes.draw do
  *get 'frontPage/index'                       // map requests to /welcome/index to frontPage_controller#index action
  *root 'frontPage#index'                      // map requests to root to frontPage_controller#index action
  end

//decide where the new instances of the resource will live
// aka localhost:3000/links
Rails.application.routes.draw do
  get 'frontPage/index'
  *resources :links                             // wow, adding just that one line will return a whole bunch of routes that start from that subdir like /articles/new, /articles/shite, /articles/haha, upon doing <rails routes> in cli
  root 'frontPage#index'
end

//make a controller for that set of routes
//terminal
rails generate controller Links                 // this will create a CLASS that is defined to inherit from ApplicationController; here you will define controller actions/actions for the controller
  # checkout app/controllers/links_controller.rb
  # contains
  # class LinksController < ApplicationController
  # end
  # fun fact: only public methods can be actions for controllers

//form building
// form_with is a form builder helper method
<%= form_with scope: :article, url : articles_path, local: true do |form| %>     // this form is for :article -- this is the first time seeing this variable; do not confuse with resources :articles (scope :article); also the articles_path is a helper (see prefix in rails routes) that points to the URI pattern associated with that prefix/helper
  <p>
    <%= form.label :title %><br>                            // form = FormBuilder object
    <%= form.text_field :title %>
  </p>

  <p>
    <%= form.label :text %><br>
    <%= form.text_area :text %>
  </p>

  <p>
    <%= form.submit %>                                      // forms by default use POST method
  </p>
<% end %>

// in controller
def create
  render plain: params[:link].inspect                       // render is taking a hash key == :plain, value == params[:article].inspect; params method is an object that represents the parameters/fields coming from the form
end                                                         // params method returns an ActionController::Parameters object, which allows you to access the keys of the hash using strings/symbols

                                                            // this is the output in client:
                                                            // <ActionController::Parameters {"title"=>"First Article!", "text"=>"This is my first article."} permitted: false>
// create a new model
// in terminal
rails generate model Link url:text media:text title:string text:text subdir:strings
rails db:migrate                                            // for production, you want rails db:migrate RAILS_ENV=production

// back to controllers dir
def create
  @article = Link.new(params[:link])                  // use Link model (but we are referring to the class Link that is defined in app/models/link.rb because class names in rb start with a capital letter), and use :link from <form_with scope :link>
  @article.save                                       // will return a boolean
  redirect_to @article                                // redirects to SHOW action, which will be defined later
end

// welp after all of this, we should get an error about strong parameters because of @article = Article.new(params[:article])
// we have to whitelist the params to prevent wrongful mass assignment
@article = Article.new(params.require(:article).permit(:title, :text))

// this is often refactored into a private method so it can be reused within the controller, but not used outside its intended context
def create
  @article = Article.new(article_params)
  @article.save
  redirect_to @article
end

private
def article_params
  params.require(:article).permit(:title, :text)
end


// to show the result of the general search for index
// controllers SHOW
def show
  @article = Article.find(params[:id])                // @article == instance var to hold a reference to the article object returned from the search
end


// now make a SHOW view for that
<p>
  <strong>Title:</strong>
  <%= @article.title %>
</p>

<p>
  <strong>Text:</strong>
  <%= @article.text %>
</p>
<%= link_to 'Back', articles_path %>                  // allow people to go back to index with a button and not the browser back

// listing articles for homepage
// controllers
def index
  @articles = Article.all                 // man, good old times with french, where you constantly have to pay if shit is plural or singular
end

// add a corresponding view
// index.html.erb
<h1>Listing articles</h1>

<table>
  <tr>
    <th>Title</th>
    <th>Text</th>
  </tr>

  <% @articles.each do |article| %>        // instance variable from controller under index action
    <tr>
      <td><%= article.title %></td>
      <td><%= article.text %></td>
      <td><%= link_to 'Show', article_path(article) %></td>   // I already made the SHOW action in the controller and the route kind of exists, you just need to assign it to this hyperlink
    </tr>
  <% end %>
</table>


// add links to navigate to the routes
// some index.html.erb file
<% link_to 'My Blog', controller: 'articles' %>              // articles is plural -- my resources :articles is plural and the controllers are always pluralized
                                                             // link_to is a view helper that creates hyperlinks based on where to go == path for articles [route helper/prefix in rails routes] or hash controller : action
<% link_to 'New article', new_article_path %>                // if you want to link to an action in the same controller where instance variables come from, you don't need to specify :controller option (Rails uses the current controller by default)

// for this new hyperlink 'New article', you need a new view for a create action
// new.html.erb
<%= form_with scope: :article, url: articles_path, local: true do |form| %>
  ...                                                         // check back with what has been written earlier in this doc
<% end %>

<%= link_to 'Back', articles_path %>

// as for validation in model (validating the data that you send to models)
// class Article (model) inherits from ApplicationRecord inherits from ActiveRecord::Base
// in a link.rb MODEL
class Article < ApplicationRecord
  validates :title, presence: true, length: { minimum: 5 }    // titles are at least 5 chrs long
end                                                           // if I try to SAVE an @article.save on an invalid title of the article, it will return false

// awesome, but we don't check the result of this validation in the create action
// controller#create
def create
  @article = Article.new(article_params)

  if @article.save                                            // so technically, what I just did here was an instance method + validation in one .save, so if the validation fails .save expression evaluation fails to FALSE, 'new' happens ... mind you, even if it is in the if statement only, it triggers and does its job because it is ...evaluated; holy s
    redirect_to @article
  else
    render 'new'                                              // this is a view, but the view needs to be associated with an action ...#new, which is why it is defined below in the controller as well
  end                                                         // render is used so that the @article object is passed back to the 'new' template when it is rendered -- this rendering is done with the SAME request as the form submission ... redirect_to would have told the browser to issue another request
end

def new
  @article = Article.new                                      // we had to do that otherwise @article would be nil in our view, so calling a method on it would be unfortunate
end

// so you did all the controlling and you are not informing anyone of the failed creation attempt
// primary takeaway: if you want to take care of error messages, do it in views including the logic
// go to views and new.html.erb (I am rendering 'new' because of the #create action)
<%= form_with scope: :article, url: articles_path, local: true do |form| %>

  *<% if @article.errors.any? %>                                      // checks if there are any errors, if it returns true, then we do that:
  *  <div id="error_explanation">
    *  <h2>
    *    <%= pluralize(@article.errors.count, "error") %> prohibited  // pluralize is a rails helper that takes a number and a string as its arguments -- if the number > 1, the string will be pluralized
    *    this article from being saved:                               // 'blablablaerrors' prohibited something from happening -- is what you display to the user
    *  </h2>
  *    <ul>
        *<% @article.errors.full_messages.each do |msg| %>
        *  <li><%= msg %></li>
        *<% end %>
      </ul>
    </div>
  <% end %>

  <p>
    <%= form.label :title %><br>
    <%= form.text_field :title %>
  </p>

  <p>
    <%= form.label :text %><br>
    <%= form.text_area :text %>
  </p>

  <p>
    <%= form.submit %>
  </p>

<% end %>

<%= link_to 'Back', articles_path %>


// ok, now to edit
// controller
def edit
  @article = Article.find(params[:id])                 // basically, you have this @variable and you assign and reassign it a value based on the action, but it is basically your carrier of 'values' resulting from actions throughout the entire rails app -- it carries shit over to /views and such
end

// fix the corresponding view
<h1>Edit article</h1>
// form_with(model: @article) tells form_with helper to fill in the form with the fields of the object vs passing in scope :variable only creates the fields                          // btw, where is my form path -- fine ...
<%= form_with(model: @article) do |form| %>             // passing the @article to a method AUTOMAGICALLY (wtf) create a url for submitting the edited article form
                                                        // this option tells Rails that we want this form to be submitted via the PATCH HTTP method
  <% if @article.errors.any? %>
    <div id="error_explanation">
      <h2>
        <%= pluralize(@article.errors.count, "error") %> prohibited
        this article from being saved:
      </h2>
      <ul>
        <% @article.errors.full_messages.each do |msg| %>
          <li><%= msg %></li>
        <% end %>
      </ul>
    </div>
  <% end %>

  <p>
    <%= form.label :title %><br>
    <%= form.text_field :title %>
  </p>

  <p>
    <%= form.label :text %><br>
    <%= form.text_area :text %>
  </p>

  <p>
    <%= form.submit %>
  </p>

<% end %>

<%= link_to 'Back', articles_path %>                        // basically get the find, take the contents, repopulate the old fields, and add an EDIT instead of CREATE button

// create a update action in controllers
def update
  @article = Article.find(params[:id])

  if @article.update(article_params)                      // article_params are privatized below
     redirect_to @article
  else
     render 'edit'
  end
end                                                       // if only @article.update(title: 'A new title') was called, Rails would only update title:

// add edit hyperlink to views
<%= link_to 'Edit', edit_article_path(@article) %>
<%= link_to 'Back', articles_path %>

// deleting articles
// haha it's possible to panipulate things like this
<a href="http://example.com/articles/1/destroy"> look at this cat </a>
// delete route mapped to delete action
// controllers
def destroy
  @article = Article.find(params[:id])
  @article.destroy

  redirect_to articles_path                                // redirect to index
end

// views
<%= link_to 'Destroy', article_path(article), method::delete, data: {confirm: 'Are you sure'} %> // method and confirm are used as html attributes -- confirm happens via rails-ujs, which is automatically included in layouts/application.html.erb

// add a second model user
rails generate model Comment commenter:string body:text article:references

// rub migration
rails db:migrate

// check app/models/comment.rb
class Comment < ApplicationRecord
  belongs_to :article
end

// check out migration
class CreateComments < ActiveRecord::Migration[5.0]
  def change
    create_table :comments do |t|
      t.string :commenter
      t.text :body
      t.references :article, foreign_key: true              // this is an INTEGER automatically

      t.timestamps
    end
  end
end


// also add has_many to make a reciprocal relationship
class Link < ApplicationRecord
  has_many :comments
  validates :title, presence: true, length: {minimum: 5}
end


// add route to comments
// config/routes.rb
resources :articles do
  resources :comments                         // comments are a nested resource within articles
end

// generate a controller
rails generate controller Comments             // plural?

// do a template
// article show form
<p>
  <strong>Title:</strong>
  <%= @article.title %>
</p>

<p>
  <strong>Text:</strong>
  <%= @article.text %>
</p>

*<h2>Add a comment:</h2>
*<%= form_with(model: [ @article, @article.comments.build ], local: true) do |form| %>       // new comment by calling CommentsController create action
*  <p>
*    <%= form.label :commenter %><br>
*    <%= form.text_field :commenter %>
*  </p>
*  <p>
*    <%= form.label :body %><br>
*    <%= form.text_area :body %>
*  </p>
*  <p>
*    <%= form.submit %>
*  </p>
* <% end %>

<%= link_to 'Edit', edit_article_path(@article) %> |
<%= link_to 'Back', articles_path %>

// go back to controller
// controller/comments_controller.rb
class CommentsController < ApplicationController
def create
  @article = Article.find(params[:id])
  @comment = @article.comments.create(comment_params)                           // method available for an association
  redirect_to article_path(@article)                                            // article_path helper == this calls the SHOW action of the ArticlesController which renders the show.html.erb
end

private
  def comment_params                                                            // the strongest of params
  params.require(:comment).permit(:commenter, :body)
  end
end

// go back to SHOW view

<p>
  <strong>Title:</strong>
  <%= @article.title %>
</p>

<p>
  <strong>Text:</strong>
  <%= @article.text %>
</p>

*<h2>Comments</h2>
*<% @article.comments.each do |comment| %>
*  <p>
*    <strong>Commenter:</strong>
*    <%= comment.commenter %>
*  </p>

*  <p>
*    <strong>Comment:</strong>
*    <%= comment.body %>
*  </p>

*<p>
*  <%= link_to 'Destroy Comment', [comment.article, comment],   // fires off DELETE route TO CommentsController TO action
*               method: :delete,
*               data: { confirm: 'Are you sure?' } %>
* </p>

*<% end %>

<h2>Add a comment:</h2>
<%= form_with(model: [ @article, @article.comments.build ]) do |form| %>
  <p>
    <%= form.label :commenter %><br>
    <%= form.text_field :commenter %>
  </p>
  <p>
    <%= form.label :body %><br>
    <%= form.text_area :body %>
  </p>
  <p>
    <%= form.submit %>
  </p>
<% end %>

<%= link_to 'Edit', edit_article_path(@article) %> |
<%= link_to 'Back', articles_path %>


// destroy comments
// controller
class CommentsController < ApplicationController
  def create
    @article = Article.find(params[:article_id])
    @comment = @article.comments.create(comment_params)
    redirect_to article_path(@article)
  end

  def destroy
    @article = Article.find(params[:article_id])
    @comment = @article.comments.find(params[:id])
    @comment.destroy
    redirect_to article_path(@article)
  end

  private
    def comment_params
      params.require(:comment).permit(:commenter, :body)
    end
end

// do cascade
// models/article.rb
class Article < ApplicationRecord
  has_many :comments, dependent: :destroy
  validates :title, presence: true,
                    length: { minimum: 5 }
end


// BASIC AUTHENTICATION
// rails provides a simple HTTP authentication system
// we want a way to block access from some ACTIONS if the person is not authenticated
// we can use http_basic_authenticate_with helper method
// specify it in the controllers
// Articles controller
class ArticlesController < ApplicationController

  *http_basic_authenticate_with name: "dhh", password: "secret", except: [:index, :show]

  def index
    @articles = Article.all
  end

end

// only allow authenticated users to delete comments
// in Comments controller
class CommentsController < ApplicationController

  *http_basic_authenticate_with name: "dhh", password: "secret", only: :destroy
end
