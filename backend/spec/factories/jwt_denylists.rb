FactoryBot.define do
  factory :jwt_denylist do
    jti { "MyString" }
    exp { "2026-01-07 20:49:27" }
  end
end
