import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/Store';
import { fetchSolvedPracticals } from '../../../redux/actions/SubmissionAction';

interface PracticalCoding {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  students: number;
  isBlocked: boolean;
}

interface PracticalCodingCardProps {
  practicalCoding: PracticalCoding;
}

const PracticalCodingCard: React.FC<PracticalCodingCardProps> = ({
  practicalCoding,
}) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const [solvedPractical, setSolvedPractical] = useState<boolean>(false);

  useEffect(() => {
    const fetchSubmissionPracticals = async () => {
      try {
        const response = await dispatch(
          fetchSolvedPracticals({
            email: user.email,
          })
        ).unwrap();

        console.log('response', response);

        if (Array.isArray(response)) {
          const completedStatus = response.map(practical => practical.isCompleted);
          console.log("....", completedStatus)
          const allCompleted = completedStatus.every(status => status === true);
          setSolvedPractical(allCompleted);
        } else {
          console.error('Expected an array of objects, but got:', typeof response);
        }
      } catch (error) {
        console.error('Error fetching solved practicals:', error);
      }
    };

    fetchSubmissionPracticals();
  }, [dispatch, user.email]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.03, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)' }}
      whileTap={{ scale: 0.95 }}
      className='bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 max-w-xs mx-auto relative'
    >
      {solvedPractical && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          className="absolute top-0 right-0 z-10"
        >
          <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-md flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            COMPLETED
          </div>
        </motion.div>
      )}
      <div className='relative w-full h-32 flex items-center justify-center bg-gray-100'>
        <div className='text-5xl text-green-500'>{practicalCoding.icon}</div>
      </div>
      <div className='p-4'>
        <h3 className='text-xl font-semibold mb-2 text-green-700 hover:text-green-800 transition-colors duration-300'>
          {practicalCoding.title}
        </h3>
        <p className='text-gray-700 mb-4 text-sm'>
          {practicalCoding.description}
        </p>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: '#38a169' }}
          whileTap={{ scale: 0.95 }}
          className='bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-lg shadow-md transition-transform duration-300'
          onClick={() => navigate(`/practice/${practicalCoding.id}`)}
        >
          Practice Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PracticalCodingCard;