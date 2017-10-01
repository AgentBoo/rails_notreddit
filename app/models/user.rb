class User < ApplicationRecord
  has_secure_password

  validates            :username, presence: true, uniqueness: true
  validates            :email, presence: true, uniqueness: true, format: { with: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/ }
  before_validation    :downcase_email
  validates            :password, presence: true

  has_many  :links
  has_many  :comments
  has_many  :link_upvotes
  has_many  :link_downvotes

  private
  def downcase_email
    email.downcase if email
  end


end
