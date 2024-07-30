import React from 'react';
import ChatBot from '../../../utils/chatBot/ChatBot';
import { TestCase } from '../../../types/CodeEditor';

interface ProblemDescriptionProps {
  problem: any;
  solved: string | null;
  testCases: TestCase[];
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  problem,
  solved,
  testCases,
}) => {
  const formatDescription = (description: string, tags: string[]) => {
    let formattedDescription = description
      .split('.')
      .map((sentence, index) =>
        index > 0 ? `<br/><br/>${sentence.trim()}` : sentence.trim(),
      )
      .join('. ');

    tags.forEach(tag => {
      const tagRegex = new RegExp(`\\b${tag}\\b`, 'gi');
      formattedDescription = formattedDescription.replace(
        tagRegex,
        `<span class="text-blue-500 font-bold">${tag}</span>`,
      );
    });

    return formattedDescription;
  };

  return (
    <div className='md:w-1/2 bg-white p-4 border border-gray-300 rounded-lg shadow-md'>
      <h2 className='text-xl font-bold mb-2'>Problem Description</h2>
      {solved === 'Attempted' && (
        <div className='flex items-center text-yellow-600'>
          <svg
            className='w-6 h-6 mr-1'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
          <span className='font-semibold'>Attempted</span>
        </div>
      )}

      {solved === 'Solved' && (
        <div className='flex items-center text-green-600'>
          <svg
            className='w-6 h-6 mr-1'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span className='font-semibold'>Solved</span>
        </div>
      )}
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold'>{problem?.title}</h3>
        <p className='text-md'>
          <span
            className={`font-medium px-2 py-1 rounded-md ${
              problem?.difficulty === 'Easy'
                ? 'bg-green-200 text-green-800'
                : problem?.difficulty === 'Medium'
                ? 'bg-yellow-200 text-yellow-800'
                : 'bg-red-200 text-red-800'
            }`}
          >
            {problem?.difficulty}
          </span>
        </p>
      </div>
      <p
        dangerouslySetInnerHTML={{
          __html: formatDescription(
            problem?.description || '',
            problem?.tags || [],
          ),
        }}
      />
      <h3 className='text-lg font-semibold mt-4'>Examples</h3>
      {testCases.slice(0, 3).map((testCase, index) => (
        <div key={index} className='mt-2'>
          <p>
            <strong>Example {index + 1}:</strong>
          </p>
          <p>
            <strong>Input:</strong> {testCase.input}
          </p>
          <p>
            <strong>Output:</strong> {testCase.output}
          </p>
        </div>
      ))}
      <ChatBot />
    </div>
  );
};

export default ProblemDescription;