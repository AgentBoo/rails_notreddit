class Link < ApplicationRecord

  validates   :title, presence: true
  validates   :url, presence: true

  belongs_to  :user
  has_many    :comments, as: :reply, dependent: :destroy
  has_many    :link_upvotes, dependent: :destroy
  has_many    :link_downvotes, dependent: :destroy
end
