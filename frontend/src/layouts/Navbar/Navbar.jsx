import React, { useState } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="flex justify-between items-center bg-linear-to-r from-blue-600 to-indigo-700 sticky top-0 z-50 h-16 px-4 text-sm text-gray-900 ">
      <div className="font-bold text-xl text-white">Turbo Loan</div>
      <div className="flex align-center">
        {isLoggedIn ? (
          <div className="flex items-center justify-center cursor-pointer text-sm text-white">
            <div className="mx-2 text-lg font-semibold" onClick={() => alert('DashBoard')}>
              Dashboard
            </div>
            <div className="mx-2 text-lg  font-semibold" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              Test User ▼
            </div>
            {isDropdownOpen && (
              <div className="absolute w-24 mr-5 right-0 top-full z-10 bg-white rounded text-md mt-1 shadow-md text-gray-900">
                <div className="p-2 pointer text-sm border-b border-gray-300" onClick={() => alert('Profile')}>
                  Profile
                </div>
                <div className="p-2 pointer text-sm" onClick={handleLogout}>
                  Log out
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            className="border border-white text-white px-4 py-2 rounded-md hover:bg-white/10 transition cursor-pointer"
            onClick={() => setIsLoggedIn(true)}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
