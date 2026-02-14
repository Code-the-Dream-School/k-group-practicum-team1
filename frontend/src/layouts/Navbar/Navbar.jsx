// frontend/src/layout/Navbar/Navbar.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';

const Navbar = () => {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const authButtonText = location.pathname === '/login' ? 'Sign Up' : 'Log In';

  return (
    <nav className="flex justify-between items-center bg-linear-to-r from-blue-600 to-indigo-700 sticky top-0 z-50 h-16 px-4 text-sm text-gray-900 ">
      <div
        className="font-bold text-xl text-white"
        onClick={() => {
          navigate('/');
          setIsDropdownOpen(false);
        }}
      >
        Turbo Loan
      </div>
      <div className="flex align-center">
        {isLoggedIn ? (
          <div className="flex items-center justify-center cursor-pointer text-sm text-white">
            <div
              className="mx-2 text-lg font-semibold"
              onClick={() => {
                navigate('/dashboard');
                setIsDropdownOpen(false);
              }}
            >
              Dashboard
            </div>
            <div
              className="mx-2 text-lg  font-semibold flex items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {`${user?.first_name} ${user?.last_name}${user?.role === 'loan_officer' ? ' (Loan Officer)' : ''} ${user?.role === 'underwriter' ? ' (Underwriter)' : ''}`}{' '}
              {!isDropdownOpen ? <RiArrowDropDownLine className="" /> : <RiArrowDropUpLine className="" />}
            </div>
            {isDropdownOpen && (
              <div className="absolute w-24 mr-5 right-0 top-full z-10 bg-white rounded text-md mt-1 shadow-md text-gray-900">
                <div
                  className="p-2 pointer text-sm border-b border-gray-300 dropdown-item"
                  onClick={() => {
                    navigate('/profile');
                    setIsDropdownOpen(false);
                  }}
                >
                  Profile
                </div>
                <div className="p-2 pointer text-sm dropdown-item" onClick={handleLogout}>
                  Log out
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              className="border border-white text-white px-4 py-2 rounded-md hover:bg-white/10 transition cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {authButtonText}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-28 bg-white rounded shadow-md text-gray-900">
                <div
                  className="block p-2 text-sm border-b cursor-pointer dropdown-item"
                  onClick={() => {
                    navigate('/login');
                    setIsDropdownOpen(false);
                  }}
                >
                  Login
                </div>
                <div
                  className="block p-2 text-sm cursor-pointer dropdown-item"
                  onClick={() => {
                    navigate('/signup');
                    setIsDropdownOpen(false);
                  }}
                >
                  Signup
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
