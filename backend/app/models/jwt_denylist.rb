# frozen_string_literal: true

class JwtDenylist
  def self.jwt_revoked?(_payload, _user)
    false
  end

  def self.revoke_jwt(_payload, _user)
    true
  end
end
