import React, { useState, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Logout } from '../../../redux/actions/AuthActions';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../redux/Store';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import AuthAxios, {
  ClanAxios,
  PaymentAxios,
  SubmissionAxios,
} from '../../../config/AxiosInstance';
import { PracticeAxios, ProblemAxios } from '../../../config/AxiosInstance';
import UserTable from '../userTable/UserTable';
import ProblemTable from '../problemTable/ProblemTable';
import LogoutModal from '../../../utils/modal/LogoutModal';
import { motion } from 'framer-motion';
import { menuItems } from '../../../utils';
import PracticalTable from '../practicalTable/PracticalTable';
import ClanTable from '../clanTable/ClanTable';
import SubscriptionTable from '../subscriptionTable/SubscriptionTable';
import LeaderBoardTable from '../leaderboardTable/LeaderBoardTable';
import WelcomeModal from '../../../utils/modal/WelcomeModal';

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any[]>([]);
  const [problems, setProblemData] = useState<any[]>([]);
  const [practice, setPracticeData] = useState<any[]>([]);
  const [clans, setClanData] = useState<any[]>([]);
  const [submission, setSubmissionData] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useLayoutEffect(() => {
    fetchUserData();
    fetchProblemData();
    fetchPracticalData();
    fetchClanData();
    fetchSubscriptionData();
    fetchAllSubmission()
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

  const fetchSubscriptionData = async () => {
    try {
      const response = await PaymentAxios.get('/subscription');
      const data = response.data.data;
      setSubscription(data);
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
  const fetchClanData = async () => {
    try {
      const response = await ClanAxios.get('/fetch-all-clans');
      const data = response.data;
      
      setClanData(data);
    } catch (error) {
      console.error('Error fetching practicals data:', error);
    }
  };

  const fetchAllSubmission = async () => {
    try {
      const response = await SubmissionAxios.get('/submissionlist');
      const data = response.data;
      
      setSubmissionData(data);
    } catch (error) {
      console.error('Error fetching practicals data:', error);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await dispatch(Logout());
    setIsLoading(false);
    navigate('/login', { replace: true });
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  

  const problemDifficultyData = [
    { name: 'Easy', value: problems.filter((p) => p.difficulty === 'Easy').length },
    { name: 'Medium', value: problems.filter((p) => p.difficulty === 'Medium').length },
    { name: 'Hard', value: problems.filter((p) => p.difficulty === 'Hard').length },
  
  ];

  

  const userData = submission.map((user) => ({
    name: user.username,
    totalProblems:user.totalProblems,
    totalPoints:user.totalPoints
  
  }));



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
       <WelcomeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <motion.nav
        className='bg-gray-800 text-white p-6 hidden md:block w-64'
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className='text-2xl font-bold mb-8'>Admin Panel</h2>
        <ul>
          {menuItems.map((item:any, index:any) => (
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
                <h3 className='text-lg font-bold mb-4 text-gray-700'>
                  Problem Difficulty
                </h3>
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
                      label={(entry) => `${entry.name} (${entry.value})`}
                    >
                       {problemDifficultyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === 'Easy'
                              ? '#3498db'
                              : entry.name === 'Medium'
                              ? '#f1c40f'
                              : '#e74c3c'
                          }
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
                  <h3 className='text-lg font-bold mb-4 text-gray-700'>
                    User Activity
                  </h3>
                  <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={userData}>
                    <XAxis dataKey='name' />
                    <YAxis />
                    <CartesianGrid strokeDasharray='3 3' />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='totalProblems' fill='#3498db' />
                    <Bar dataKey='totalPoints' fill='#2ecc71' />
                  </BarChart>
                </ResponsiveContainer>
                </motion.div>
                
              </div>
            </motion.div>
          )}

          {activeSection === 'users' && (
            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>
                User Management
              </h2>
              <UserTable users={users} />
            </motion.div>
          )}

          {activeSection === 'problems' && (
            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>
                Problem Management
              </h2>
              <ProblemTable problems={problems} />
            </motion.div>
          )}

          {activeSection === 'practice' && (
            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>
                Practice
              </h2>
              <PracticalTable practicals={practice} />
            </motion.div>
          )}
          {activeSection === 'clans' && (
            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>Clans</h2>

              <ClanTable clans={clans} />
            </motion.div>
          )}

          {activeSection === 'leaderboard' && (
            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>
                Leaderboard
              </h2>
              <LeaderBoardTable/>
            </motion.div>
          )}

          {activeSection === 'subscription' && (
            <motion.div variants={itemVariants}>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>
                Subscription
              </h2>

              <SubscriptionTable subscriptions={subscription} />
            </motion.div>
          )}
        </motion.div>
      </div>

      <LogoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogout={handleLogout}
        data={'Logout'}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminDashboard;
