import React, { useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaDatabase, FaServer, FaLaptopCode, FaLightbulb, FaBookmark } from 'react-icons/fa';
import { MdCode, MdDeveloperBoard, MdLaptopMac, MdWeb } from 'react-icons/md';
import { GiArtificialIntelligence, GiRobotGolem, GiCircuitry } from 'react-icons/gi';
import { AppDispatch } from '../../redux/Store';
import { practicallist } from '../../redux/actions/PracticalAction';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Array of coding-related icons
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

  isBlocked: boolean;  // Added isBlocked property
}

interface PracticalCodingCardProps {
  practicalCoding: PracticalCoding;
}

const PracticalCodingCard: React.FC<PracticalCodingCardProps> = ({ practicalCoding }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.03, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)' }}
      whileTap={{ scale: 0.95 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 max-w-xs mx-auto"
    >
      <div className="relative w-full h-32 flex items-center justify-center bg-gray-100">
        <div className="text-5xl text-green-500">
          {practicalCoding.icon}
        </div>
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300"
          whileHover={{ opacity: 1 }}
        >
          <motion.span
            className="text-white text-lg font-bold"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            View Video
          </motion.span>
        </motion.div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-green-700 hover:text-green-800 transition-colors duration-300">{practicalCoding.title}</h3>
        <p className="text-gray-700 mb-4 text-sm">{practicalCoding.description}</p>
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center">
            <FaCode className="text-green-500 mr-2" />
            <span className="text-gray-700">{practicalCoding.duration} hrs</span>
          </div>
          <div className="flex items-center">
            <FaLaptopCode className="text-green-500 mr-2" />
            <span className="text-gray-700">{practicalCoding.students} students</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: '#38a169' }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-lg shadow-md transition-transform duration-300"
          onClick={() =>
            navigate(`/practice/${practicalCoding.title}`)
          }
        >
          Watch Now
        </motion.button>
      </div>
    </motion.div>
  );
};

const PracticalCodingList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [practicalCodings, setPracticalCodings] = useState<PracticalCoding[]>([]);

  const fetchPracticeList = async () => {
    try {
      const response = await dispatch(practicallist()).unwrap();
      console.log("res,.,.",response);
      
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
    <div className="container mx-auto py-12">
      <div className="banner mb-12">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          className="bg-green-500 rounded-lg shadow-lg p-8 flex items-center justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Unlock Your Potential</h2>
            <p className="text-white mb-6">Explore our wide range of practical coding sessions and start your learning journey today.</p>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#38a169' }}
              whileTap={{ scale: 0.95 }}
              className="bg-white hover:bg-gray-200 text-green-500 font-bold py-2 px-4 rounded-lg shadow-md transition-transform duration-300"
            >
              Browse Sessions
            </motion.button>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            className="hidden md:block"
          >
            <FaLightbulb className="text-white text-6xl" />
          </motion.div>
        </motion.div>
      </div>
      <div className="text-center mb-8">
        {practicalCodings.length === 0 ? (
          <p className="text-gray-700 text-lg">No practical coding sessions available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {practicalCodings.map((practicalCoding) => (
              <PracticalCodingCard key={practicalCoding.id} practicalCoding={practicalCoding} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticalCodingList;
