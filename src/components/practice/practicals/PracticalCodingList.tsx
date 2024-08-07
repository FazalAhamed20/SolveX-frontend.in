import React, { useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaCode,
  FaDatabase,
  FaServer,
  FaLaptopCode,
  FaLightbulb,
  FaBookmark,
} from 'react-icons/fa';
import { MdCode, MdDeveloperBoard, MdLaptopMac, MdWeb } from 'react-icons/md';
import {
  GiArtificialIntelligence,
  GiRobotGolem,
  GiCircuitry,
} from 'react-icons/gi';
import { AppDispatch } from '../../../redux/Store';
import { practicallist } from '../../../redux/actions/PracticalAction';
import { useDispatch } from 'react-redux';
import PracticalCodingCard from './PracticalCodingCard';

const codingIcons = [
  <FaCode />,
  <FaDatabase />,
  <FaServer />,
  <FaLaptopCode />,
  <FaLightbulb />,
  <FaBookmark />,
  <MdCode />,
  <MdDeveloperBoard />,
  <MdLaptopMac />,
  <MdWeb />,
  <GiArtificialIntelligence />,
  <GiRobotGolem />,
  <GiCircuitry />,
];

interface PracticalCoding {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  students: number;
  isBlocked: boolean;
  isPremium: boolean;
}

const PracticalCodingList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [practicalCodings, setPracticalCodings] = useState<PracticalCoding[]>(
    [],
  );

  const fetchPracticeList = async () => {
    try {
      const response = await dispatch(practicallist()).unwrap();
      console.log('res,.,.', response);

      const filteredCodings = (response as unknown as PracticalCoding[])
        .filter(coding => !coding.isBlocked)
        .map((coding, index) => ({
          ...coding,
          icon: codingIcons[index % codingIcons.length],
        }));
      setPracticalCodings(filteredCodings);
    } catch (error) {
      console.error('Error fetching practical codings:', error);
    }
  };

  useLayoutEffect(() => {
    fetchPracticeList();
  }, []);

  return (
    <div className='container mx-auto py-12'>
      <div className='banner mb-12'>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          className='bg-green-500 rounded-lg shadow-lg p-8 flex items-center justify-between'
        >
          <div>
            <h2 className='text-3xl font-bold text-white mb-4'>
              Unlock Your Potential
            </h2>
            <p className='text-white mb-6'>
              Explore our wide range of practical coding sessions and start your
              learning journey today.
            </p>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#38a169' }}
              whileTap={{ scale: 0.95 }}
              className='bg-white hover:bg-gray-200 text-green-500 font-bold py-2 px-4 rounded-lg shadow-md transition-transform duration-300'
            >
              Browse Sessions
            </motion.button>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            className='hidden md:block'
          >
            <FaLightbulb className='text-white text-6xl' />
          </motion.div>
        </motion.div>
      </div>
      <div className='text-center mb-8'>
        {practicalCodings.length === 0 ? (
          <p className='text-gray-700 text-lg'>
            No practical coding sessions available at the moment.
          </p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
            {practicalCodings.map(practicalCoding => (
              <PracticalCodingCard
                key={practicalCoding.id}
                practicalCoding={practicalCoding}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticalCodingList;
