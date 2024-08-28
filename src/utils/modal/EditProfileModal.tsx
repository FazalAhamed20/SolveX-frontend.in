import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

interface EditProfileModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  profile: {
    username: string;
    role: string;
    bio: string;
    github: string;
    linkedin: string;
    twitter: string;
    profileImage: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  handleRemoveImage: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  modalIsOpen,
  closeModal,
  profile,
  handleInputChange,
  handleImageChange,
  handleSubmit,
  isLoading,
  handleRemoveImage,
}) => {
  const [errors, setErrors] = useState({
    username: '',
    github: '',
    linkedin: '',
    twitter: '',
  });

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { username: '', github: '', linkedin: '', twitter: '' };

    if (!profile.username.trim()) {
      newErrors.username = 'Username is required.';
      isValid = false;
    }

    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    if (profile.github && !urlPattern.test(profile.github)) {
      newErrors.github = 'Invalid GitHub URL.';
      isValid = false;
    }

    if (profile.linkedin && !urlPattern.test(profile.linkedin)) {
      newErrors.linkedin = 'Invalid LinkedIn URL.';
      isValid = false;
    }

    if (profile.twitter && !urlPattern.test(profile.twitter)) {
      newErrors.twitter = 'Invalid Twitter URL.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateInputs()) {
      handleSubmit(e);
    }
  };

 
  console.log('profile', profile);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className='modal'
      overlayClassName='overlay'
    >
      <form onSubmit={handleFormSubmit} className='space-y-4'>
        <h2 className='text-2xl font-bold mb-4'>Edit Profile</h2>

        {/* Profile Image */}
        {isLoading ? (
          <div className='flex justify-center items-center h-32'>
            <h1>Loading...</h1>
          </div>
        ) : (
          <div className='flex justify-center'>
            {!profile.profileImage ? (
              <div className='flex items-center justify-center w-32 h-32 rounded-full bg-green-500 text-white mb-4 text-4xl'>
                {profile.username.charAt(0).toUpperCase()}
              </div>
            ) : (
              <img
                src={profile.profileImage}
                alt='Profile'
                className='w-32 h-32 rounded-full object-cover mb-4'
              />
            )}
          </div>
        )}

        {/* Remove Profile Image Button */}
        {profile.profileImage && (
          <div className='flex justify-center mb-4'>
            <button
              type='button'
              onClick={handleRemoveImage}
              className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300'
            >
              Remove Image
            </button>
          </div>
        )}

        {/* Update Profile Image */}
        <div>
          <label className='block text-gray-700 mb-2'>
            Update Profile Image
          </label>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='w-full px-3 py-2 border rounded'
          />
        </div>

        {/* Input Fields */}
        <div>
          <label className='block text-gray-700'>Name</label>
          <input
            type='text'
            name='username'
            value={profile.username}
            placeholder='Username'
            onChange={handleInputChange}
            className='w-full px-3 py-2 border rounded'
          />
          {errors.username && (
            <p className='text-red-500 text-sm'>{errors.username}</p>
          )}
        </div>
        <div>
          <label className='block text-gray-700'>Role</label>
          <input
            type='text'
            name='role'
            placeholder='Role'
            value={profile.role}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border rounded'
          />
        </div>
        <div>
          <label className='block text-gray-700'>Bio</label>
          <textarea
            name='bio'
            placeholder='Bio'
            value={profile.bio}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border rounded'
          />
        </div>
        <div>
          <label className='block text-gray-700 mb-2'>GitHub</label>
          <div className='flex items-center space-x-2'>
            <FaGithub className='text-gray-600' />
            <input
              type='text'
              name='github'
              value={profile.github}
              placeholder='GitHub Link'
              onChange={handleInputChange}
              className='w-full px-3 py-2 border rounded'
            />
            {errors.github && (
              <p className='text-red-500 text-sm'>{errors.github}</p>
            )}
          </div>
        </div>
        <div>
          <label className='block text-gray-700 mb-2'>LinkedIn</label>
          <div className='flex items-center space-x-2'>
            <FaLinkedin className='text-gray-600' />
            <input
              type='text'
              name='linkedin'
              placeholder='LinkedIn Link'
              value={profile.linkedin}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border rounded'
            />
            {errors.linkedin && (
              <p className='text-red-500 text-sm'>{errors.linkedin}</p>
            )}
          </div>
        </div>
        <div>
          <label className='block text-gray-700 mb-2'>Twitter</label>
          <div className='flex items-center space-x-2'>
            <FaTwitter className='text-gray-600' />
            <input
              type='text'
              name='twitter'
              value={profile.twitter}
              placeholder='Twitter Link'
              onChange={handleInputChange}
              className='w-full px-3 py-2 border rounded'
            />
            {errors.twitter && (
              <p className='text-red-500 text-sm'>{errors.twitter}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className='flex justify-end space-x-4'>
           <button
    type='submit'
    className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 flex items-center'
    disabled={isLoading}
  >
    {isLoading ? (
      <>
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Saving...
      </>
    ) : (
      'Save Changes'
    )}
  </button>
          <button
            type='button'
            onClick={closeModal}
            className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors duration-300'
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
