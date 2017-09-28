class Link < ApplicationRecord

  validates   :title, presence: true
  validates   :url, presence: true

  belongs_to  :user
  has_many    :comments
  has_many    :up_votes


end
