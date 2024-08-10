import React from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  data: string;
  isLoading: boolean;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  data,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50'>
      <div className='bg-white p-8 rounded shadow-md'>
        <h2 className='text-lg font-semibold mb-4'>
          Are you sure you want to {data}?
        </h2>
        <div className='flex justify-end'>
          <button
            className='px-4 py-2 mr-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50'
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50 flex items-center'
            onClick={onLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              data
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;