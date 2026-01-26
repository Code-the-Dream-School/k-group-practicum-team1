# backend/spec/models/jwt_denylist_spec.rb
require 'rails_helper'

RSpec.describe JwtDenylist, type: :model do
  describe '.jwt_revoked?' do
    it 'returns false for any payload and user' do
      expect(described_class.jwt_revoked?({}, nil)).to be false
    end
  end

  describe '.revoke_jwt' do
    it 'returns true for any payload and user' do
      expect(described_class.revoke_jwt({}, nil)).to be true
    end
  end
end
