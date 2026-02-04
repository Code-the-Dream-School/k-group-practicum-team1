// frontend/src/pages/Profile/Profile
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import PropTypes from 'prop-types';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await apiFetch('/api/v1/me');
        if (setUser) setUser(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    if (!user) fetchUser();
    else setLoading(false);
  }, [user, setUser]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">Loading profile...</div>
      </div>
    );
  }
  if (error)
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center text-red-600">
          {error}
        </div>
      </div>
    );
  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600">Please login to see your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4 ">Your Profile</h1>
        <div className="space-y-3 text-gray-700">
          <ProfileRow label="First Name" value={user.first_name} />
          <ProfileRow label="Last Name" value={user.last_name} />
          <ProfileRow label="Email" value={user.email} />
          <ProfileRow label="Phone" value={user.phone_number} />
          <ProfileRow label="Role" value={user.role} />
        </div>
      </div>
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-100 pb-2">
    <span className="font-medium">{label}</span>
    <span className="text-gray-600">{value || '-'}</span>
  </div>
);

ProfileRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Profile;
