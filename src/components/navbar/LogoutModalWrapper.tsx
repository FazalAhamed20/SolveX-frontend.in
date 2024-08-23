import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/Store';
import { Logout } from '../../redux/actions/AuthActions';
import { googleLogout } from '@react-oauth/google';
import LogoutModal from '../../utils/modal/LogoutModal';
import ClipLoader from 'react-spinners/ClipLoader';

interface LogoutModalWrapperProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const LogoutModalWrapper: React.FC<LogoutModalWrapperProps> = ({ showModal, setShowModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await dispatch(Logout());
      await googleLogout();
      setShowModal(false);
      navigate('/login', { replace: false });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LogoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogout={handleLogout}
        data={'Logout'}
        isLoading={false}
      />
      {loading && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
          <ClipLoader color='#ffffff' loading={loading} size={50} />
        </div>
      )}
    </>
  );
};

export default LogoutModalWrapper;