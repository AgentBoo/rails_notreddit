class Comment < ApplicationRecord

  validates   :body, presence: true

  belongs_to  :user
  belongs_to  :reply, polymorphic: true
  has_many    :comments, as: :reply
end
