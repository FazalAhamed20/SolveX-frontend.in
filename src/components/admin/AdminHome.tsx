import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Logout } from '../../redux/actions/AuthActions';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../redux/Store';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AuthAxios, PracticeAxios, ProblemAxios } from '../../config/AxiosInstance';
import UserTable from './UserTable';
import ProblemTable from './ProblemTable';
import LogoutModal from '../../utils/modal/LogoutModal';
import { motion } from 'framer-motion';
import { FaChartPie, FaUsers, FaCode, FaTrophy, FaCrown ,FaFlask} from 'react-icons/fa';
import PracticalTable from './PracticalTable';


const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [problems, setProblemData] = useState<any[]>([]);
  const [practice, setPracticeData] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);

  useLayoutEffect(() => {
    fetchUserData();
    fetchProblemData();
    fetchPracticalData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await AuthAxios.get('/user');
      const data = response.data.data;
      setUsers(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchProblemData = async () => {
    try {
      const response = await ProblemAxios.get('/problems');
      const data = response.data;
      setProblemData(data);
    } catch (error) {
      console.error('Error fetching problem data:', error);
    }
  };

  const fetchPracticalData = async () => {
    try {
      const response = await PracticeAxios.get('/practice');
      const data = response.data;
      setPracticeData(data);
    } catch (error) {
      console.error('Error fetching practicals data:', error);
    }
  };

  const handleLogout = async () => {
    await dispatch(Logout());
    navigate('/login', { replace: true });
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const problemDifficultyData = [
    { name: 'Easy', value: 40 },
    { name: 'Medium', value: 30 },
    { name: 'Hard', value: 20 },
    { name: 'Expert', value: 10 },
  ];

  const userData = [
    { name: 'Jan', problems: 10, submissions: 50 },
    { name: 'Feb', problems: 15, submissions: 60 },
    { name: 'Mar', problems: 20, submissions: 70 },
    { name: 'Apr', problems: 25, submissions: 80 },
    { name: 'May', problems: 30, submissions: 90 },
    { name: 'Jun', problems: 35, submissions: 100 },
  ];

  const menuItems = [
    { name: 'dashboard', icon: FaChartPie },
    { name: 'problems', icon: FaCode },
    { name: 'users', icon: FaUsers },
    { name: 'practice', icon: FaFlask },
    { name: 'leaderboard', icon: FaTrophy },
    { name: 'subscription', icon: FaCrown },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className='admin-dashboard flex h-screen bg-gray-100'>
      <motion.nav
        className='bg-gray-800 text-white p-6 hidden md:block w-64'
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className='text-2xl font-bold mb-8'>Admin Panel</h2>
        <ul>
          {menuItems.map((item, index) => (
            <motion.li
              key={item.name}
              className={`mb-4 cursor-pointer flex items-center ${
                activeSection === item.name ? 'font-bold text-blue-400' : ''
              }`}
              onClick={() => handleSectionChange(item.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <item.icon className='mr-3' />
              <span className='capitalize'>{item.name}</span>
            </motion.li>
          ))}
        </ul>
      </motion.nav>

      <div className='flex-1 overflow-y-auto'>
        <motion.header
          className='bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10'
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className='text-2xl font-bold text-gray-800'>Admin Dashboard</h1>
          <motion.button
            onClick={() => setShowModal(true)}
            className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </motion.header>

        <motion.div
          className='p-6'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          {activeSection === 'dashboard' && (
            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>Overview</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <motion.div
                  className='bg-white shadow-lg rounded-lg p-6'
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className='text-lg font-bold mb-4 text-gray-700'>Problem Difficulty</h3>
                  <ResponsiveContainer width='100%' height={300}>
                    <PieChart>
                      <Pie
                        data={problemDifficultyData}
                        dataKey='value'
                        nameKey='name'
                        cx='50%'
                        cy='50%'
                        outerRadius={80}
                        fill='#8884d8'
                        label
                      >
                        {problemDifficultyData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={['#3498db', '#2ecc71', '#f1c40f', '#e74c3c'][index % 4]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
                <motion.div
                  className='bg-white shadow-lg rounded-lg p-6'
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className='text-lg font-bold mb-4 text-gray-700'>User Activity</h3>
                  <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={userData}>
                      <XAxis dataKey='name' />
                      <YAxis />
                      <CartesianGrid strokeDasharray='3 3' />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey='problems' fill='#3498db' />
                      <Bar dataKey='submissions' fill='#2ecc71' />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeSection === 'users' && (
            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>User Management</h2>
              <UserTable users={users} />
            </motion.div>
          )}

          {activeSection === 'problems' && (
            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>Problem Management</h2>
              <ProblemTable problems={problems} />
            </motion.div>
          )}

{activeSection === 'practice' && (
            <motion.div variants={itemVariants} className='bg-white shadow-lg rounded-lg p-6'>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>Practice</h2>
              <PracticalTable practicals={practice} />
            </motion.div>
          )}

          {activeSection === 'leaderboard' && (
            <motion.div variants={itemVariants} className='bg-white shadow-lg rounded-lg p-6'>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>Leaderboard</h2>
              {/* Implement leaderboard component here */}
              <p>Leaderboard data goes here</p>
            </motion.div>
          )}

          {activeSection === 'subscription' && (
            <motion.div variants={itemVariants} className='bg-white shadow-lg rounded-lg p-6'>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>Subscription Management</h2>
              {/* Implement subscription management component here */}
              <p>Subscription management data goes here</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <LogoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogout={handleLogout}
        data={'Logout'}
      />
    </div>
  );
};

export default AdminDashboard;