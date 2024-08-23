import {
    FaChartPie,
    FaUsers,
    FaCode,
    FaTrophy,
    FaCrown,
    FaFlask,
    FaFortAwesome,
    FaMedal,
    FaAward,
    FaStar,
    FaShieldAlt,
    FaUser,
  } from 'react-icons/fa';

  interface Member {
    isToday: boolean;
    _id: string | number;
    id: number;
    rank: number;
    name: string;
    role: 'leader' | 'Co-Leader' | 'member';
    score: any;
    clanName: string;
    level: number;
  }

export   const menuItems = [
    { name: 'dashboard', icon: FaChartPie },
    { name: 'problems', icon: FaCode },
    { name: 'users', icon: FaUsers },
    { name: 'practice', icon: FaFlask },
    { name: 'leaderboard', icon: FaTrophy },
    { name: 'subscription', icon: FaCrown },
    { name: 'clans', icon: FaFortAwesome },
  ];

  
  export const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FaTrophy className='text-yellow-500' />;
      case 2:
        return <FaMedal className='text-gray-400' />;
      case 3:
        return <FaAward className='text-orange-500' />;
      default:
        return <FaStar className='text-blue-500' />;
    }
  };


  export  const getRoleIcon = (role: Member['role']) => {
    switch (role) {
      case 'leader':
        return <FaCrown className="text-yellow-500" />;
      case 'Co-Leader':
        return <FaShieldAlt className="text-blue-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };


  
