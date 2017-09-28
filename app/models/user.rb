class User < ApplicationRecord
  has_secure_password

  validates            :user, presence: true, uniqueness: true
  validates            :email, presence: true, uniqueness: true, format: { with: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/ }
  before_validation    :downcase_email
  validates            :password, presence: true
  before_save          :password_confirmed?

  has_many :links
  has_many :comments
  has_many :up_votes

  private
  def downcase_email
    email.downcase if email
  end

  def password_confirmed?
    puts 'hi :D'
  end

end
