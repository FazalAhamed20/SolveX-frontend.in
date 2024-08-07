import React from 'react';
import { FaTrophy, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { AiOutlineFire } from 'react-icons/ai';

interface SubmissionActivityCardProps {
  todaySubmissions: any[];
  totalSubmissions: number;
  averageSubmissions: number;
  bestStreak: number;
}

const SubmissionActivityCard: React.FC<SubmissionActivityCardProps> = ({
  todaySubmissions,
  totalSubmissions,
  averageSubmissions,
  bestStreak,
}) => {
  return (
    <div className='p-6 bg-white shadow-md rounded-md mb-4'>
      <h3 className='text-xl font-semibold mb-4 flex items-center'>
        <FaTrophy className='mr-2' /> Submission Activity
      </h3>
      <div className='flex mb-4'>
        <div className='w-1/2 pr-2'>
          <div className='text-gray-600 flex items-center'>
            <FaCalendarAlt className='mr-1' /> Submissions Today:
          </div>
          <div className='font-bold'> {todaySubmissions.length}</div>
        </div>
        <div className='w-1/2 pl-2'>
          <div className='text-gray-600 flex items-center'>
            <FaChartLine className='mr-1' /> Total Submissions:
          </div>
          <div className='font-bold'>{totalSubmissions}</div>
        </div>
      </div>
      <div className='flex'>
        <div className='w-1/2 pr-2'>
          <div className='text-gray-600 flex items-center'>
            <FaChartLine className='mr-1' /> Average Submissions:
          </div>
          <div className='font-bold'>{averageSubmissions.toFixed(2)}</div>
        </div>
        <div className='w-1/2 pl-2'>
          <div className='text-gray-600 flex items-center'>
            <AiOutlineFire className='mr-1' /> Best Streak:
          </div>
          <div className='font-bold'>{bestStreak} days</div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionActivityCard;
