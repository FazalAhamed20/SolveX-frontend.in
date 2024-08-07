import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEdit } from 'react-icons/fa';

interface ProfileCardProps {
  user: any;
  openModal: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, openModal }) => {
  return (
    <div className='flex flex-col items-center p-6 bg-white shadow-md rounded-md mx-4 my-4'>
      {user.profileImage ? (
        <img
          src={user.profileImage}
          alt='Profile'
          className='w-32 h-32 rounded-full object-cover mb-4'
        />
      ) : (
        <div className='flex items-center justify-center w-32 h-32 rounded-full bg-green-500 text-white mb-4 text-4xl'>
          {user.username.charAt(0).toUpperCase()}
        </div>
      )}

      <h2 className='text-2xl font-bold mb-2'>{user.username}</h2>
      <p className='text-gray-500 mb-4'>{user.role}</p>
      <p className='text-gray-700 mb-6 text-center'>{user.bio}</p>
      <div className='flex space-x-4 mb-6'>
        <a href={user.github} target='_blank' rel='noopener noreferrer'>
          <FaGithub className='text-gray-600 hover:text-gray-800 transition-colors duration-300' />
        </a>
        <a href={user.linkedin} target='_blank' rel='noopener noreferrer'>
          <FaLinkedin className='text-gray-600 hover:text-gray-800 transition-colors duration-300' />
        </a>
        <a href={user.twitter} target='_blank' rel='noopener noreferrer'>
          <FaTwitter className='text-gray-600 hover:text-gray-800 transition-colors duration-300' />
        </a>
      </div>
      <button
        className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 flex items-center'
        onClick={openModal}
      >
        <FaEdit className='mr-2' /> Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;
