import React from 'react';
import { FaCode } from 'react-icons/fa';

interface SolvedProblemsCardProps {
  solvedProblems: {
    easy: number;
    medium: number;
    hard: number;
  };
  difficultyCount: {
    easy: number;
    medium: number;
    hard: number;
  };
}

const SolvedProblemsCard: React.FC<SolvedProblemsCardProps> = ({
  solvedProblems,
  difficultyCount
}) => {
  return (
    <div className='p-6 bg-white shadow-md rounded-md mb-4'>
      <h3 className='text-xl font-semibold mb-4 flex items-center'>
        <FaCode className='mr-2' /> Solved Problems by Difficulty
      </h3>
      <div className='flex flex-col space-y-4'>
        <div className='flex items-center'>
          <span className='w-20 text-gray-600'>Easy:</span>
          <div className='flex-1 h-4 bg-green-200 rounded-full'>
            <div
              className='h-full rounded-full bg-green-500'
              style={{
                width: `${(solvedProblems.easy / 20) * 100}%`,
              }}
            ></div>
          </div>
          <span className='ml-2'>{solvedProblems.easy}/{difficultyCount.easy}</span>
        </div>
        <div className='flex items-center'>
          <span className='w-20 text-gray-600'>Medium:</span>
          <div className='flex-1 h-4 bg-yellow-200 rounded-full'>
            <div
              className='h-full rounded-full bg-yellow-500'
              style={{
                width: `${(solvedProblems.medium / 15) * 100}%`,
              }}
            ></div>
          </div>
          <span className='ml-2'>{solvedProblems.medium}/{difficultyCount.medium}</span>
        </div>
        <div className='flex items-center'>
          <span className='w-20 text-gray-600'>Hard:</span>
          <div className='flex-1 h-4 bg-red-200 rounded-full'>
            <div
              className='h-full rounded-full bg-red-500'
              style={{
                width: `${(solvedProblems.hard / 10) * 100}%`,
              }}
            ></div>
          </div>
          <span className='ml-2'>{solvedProblems.hard}/{difficultyCount.hard}</span>
        </div>
      </div>
    </div>
  );
};

export default SolvedProblemsCard;
