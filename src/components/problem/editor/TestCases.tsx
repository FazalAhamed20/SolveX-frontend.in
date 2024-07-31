import React from 'react';
import { TestCase } from '../../../types/CodeEditor';

interface TestCasesProps {
  testCases: TestCase[];
  testResults: (boolean | null)[];
  testCaseOutputs: any[][];
  loadingTestCases: boolean;
  handleTestCaseClick: (index: number) => void;
  selectedTestCase: number | null;
}

const TestCases: React.FC<TestCasesProps> = ({
  testCases,
  testResults,
  testCaseOutputs,
  loadingTestCases,
  handleTestCaseClick,
  selectedTestCase,
}) => {
  return (
    <div className='h-48 md:h-64'>
      <div className='bg-white p-4 border border-gray-300 rounded-lg shadow-md'>
        <h2 className='text-xl font-bold mb-2'>Test Cases</h2>
        {loadingTestCases ? (
          <div className='text-center'>Loading test cases...</div>
        ) : (
          <>
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2'>
              {testCases.map((testCase, index) => (
                <button
                  key={index}
                  onClick={() => handleTestCaseClick(index)}
                  className={`p-1 rounded-md text-xs font-bold ${
                    testResults[index] === null
                      ? 'bg-gray-300 text-[#4B5563]'
                      : testResults[index]
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  Case {index + 1}
                </button>
              ))}
            </div>

            {selectedTestCase !== null && (
              <div className='mt-4 p-4 bg-gray-100 rounded-md'>
                <h3 className='font-bold mb-2'>Case {selectedTestCase + 1}</h3>
                <p className='text-sm'>
                  <strong>Input:</strong> {testCases[selectedTestCase].input}
                </p>
                <p className='text-sm'>
                  <strong>Expected Output:</strong>{' '}
                  {testCases[selectedTestCase].output}
                </p>
                <p className='text-sm'>
                  <strong>Actual Output:</strong>
                  {testCaseOutputs[selectedTestCase]
                    ? JSON.stringify(testCaseOutputs[selectedTestCase])
                    : 'No output'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TestCases;
