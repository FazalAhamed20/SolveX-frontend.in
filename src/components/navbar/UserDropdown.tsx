import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutModalWrapper from './LogoutModalWrapper';

interface UserDropdownProps {
  user: any;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className='relative z-30'>
      <button
        onClick={toggleDropdown}
        className='bg-green-500 text-white h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium focus:outline-none'
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt='Profile'
            className='w-full h-full rounded-full object-cover'
          />
        ) : (
          user.username.charAt(0).toUpperCase()
        )}
      </button>
      {isDropdownOpen && (
                  <div className='mt-2 w-48 bg-white rounded-md shadow-lg py-2 mx-auto'>
                    <Link
                      to='/profile'
                      className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                      onClick={() => {
                        setIsDropdownOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                    <a
                      className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                      onClick={() => setShowModal(true)}
                    >
                      Logout
                    </a>
                  </div>
      )}
      <LogoutModalWrapper showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default UserDropdown;