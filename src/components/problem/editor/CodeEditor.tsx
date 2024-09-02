import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ProblemAxios, SubmissionAxios } from '../../../config/AxiosInstance';
import Editor from '@monaco-editor/react';
import {
  fetchSubmission,
  submitProblem,
} from '../../../redux/actions/SubmissionAction';
import { AppDispatch } from '../../../redux/Store';
import SuccessModal from '../../../utils/modal/SuccessModal';
import RunningModal from '../../../utils/modal/RunModal';
import TestCases from './TestCases';
import ProblemDescription from './ProblemDescription';

interface TestCase {
  description: string;
  input: string;
  output: string;
}

const CodeEditorMain: React.FC = () => {
  const [code, setCode] = useState('')
  const [testCaseOutputs, setTestCaseOutputs] = useState<any[][]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [raw, setRaw] = useState([]);
  const [display, setDisplay] = useState('');
  const [testResults, setTestResults] = useState<(boolean | null)[]>([]);
  const [language, setLanguage] = useState<string>('javascript');
  const [selectedTestCase, setSelectedTestCase] = useState<number | null>(null);
  const [functionName, setFunctionName] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);
  const [loadingTestCases, setLoadingTestCases] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>();

  const problems = useSelector((state: any) => state.problem.problem);
  const user = useSelector((state: any) => state.user.user);
  const problem = problems.find((p: any) => p.id === id);
  const supportedLanguages = problem?.language || [];
  const dispatch: AppDispatch = useDispatch();

  const availableLanguages = supportedLanguages
    .filter((langObj: { [x: string]: any }) => {
      const langName = Object.keys(langObj)[0];
      return langObj[langName];
    })
    .map((langObj: {}) => Object.keys(langObj)[0]);

  useEffect(() => {
    const fetchSubmissionProblem = async () => {
      try {
        const response = await dispatch(
          fetchSubmission({
            email: user.email,
            id: id,
          }),
        );
        let data = response.payload?.data;
        if (data) {
          
          setSolved(data);
          
        } else {
          
        }
      } catch (error) {
        console.error('Error fetching submission:', error);
      }
    };

    fetchSubmissionProblem();
  }, [dispatch, user.email, id]);

  const fetchTestCases = async () => {
    setLoadingTestCases(true);

    try {
      if (!problem) return;

      const response = await ProblemAxios.get(
        `/fetchProblem/${id}-${problem.title}?language=${language}`,
      );
      const data = await response.data;

      setCode(data.solutionTemplate || '');
      setFunctionName(data.driver);
      setDisplay(data.display);
      setRaw(data.input);
      

      if (
        !Array.isArray(data.input) ||
        !Array.isArray(data.output) ||
        data.input.length !== data.output.length
      ) {
        throw new Error('Invalid input or output data format');
      }

      const variableNames = 'fghijklmnopqrstuvwxyz'.split('');

      const fetchedTestCases = data.input.map(
        (inputItem: any, index: number) => {
          let formattedInput;
          if (Array.isArray(inputItem)) {
            formattedInput = inputItem
              .map(
                (item, i) =>
                  `${
                    variableNames[i % variableNames.length]
                  } = ${JSON.stringify(item)}`,
              )
              .join(', ');
          } else if (typeof inputItem === 'object') {
            formattedInput = Object.entries(inputItem)
              .map(
                ([value], i) =>
                  `${
                    variableNames[i % variableNames.length]
                  } = ${JSON.stringify(value)}`,
              )
              .join(', ');
          } else {
            formattedInput = `x = ${JSON.stringify(inputItem)}`;
          }

          return {
            description: `Example ${index + 1}`,
            input: formattedInput,
            output: JSON.stringify(data.output[index]),
          };
        },
      );

      setTestCases(fetchedTestCases);
      setTestResults(new Array(fetchedTestCases.length).fill(null));
      if (fetchedTestCases.length > 0) {
        setSelectedTestCase(0);
      }
    } catch (error) {
      console.error('Error fetching test cases:', error);
    } finally {
      setLoadingTestCases(false);
    }
  };
  

  useEffect(() => {
    const savedCode = localStorage.getItem('code');
    if (savedCode) {
      setCode(savedCode);
    }
    fetchTestCases();
    
    
  }, [id, problem, language]);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const submitResponse = await SubmissionAxios.post(`/run`, {
        source: code,
        lang: language,
        testCases: raw,
        functionName: functionName,
        display: display,
        id: problem.id,
        code: problem.code,
        email: user.email,
        _id: user._id,
        title: problem.title,
        difficulty: problem.difficulty,
        language: language,
        submited: 'Attempted',
        
      });

      const results = submitResponse.data.results;
      

      const hasError = results.some((result: any) => result.error);
      if (hasError) {
        const errorMessages = results
          .filter((result: any) => result.error)
          .map((result: any) => result.error)
          .join(', ');

        setError(`Errors encountered: ${errorMessages}`);
        setTestResults(new Array(testCases.length).fill(false));
        setTestCaseOutputs([]);
        return;
      }

      const updatedTestResults = testCases.map((testCase, index) => {
        const result = results[index];

        if (result) {
          const expectedOutput = JSON.parse(testCase.output);
          const actualOutput = result.output;
          ,(actualOutput))

          return (
            JSON.stringify(expectedOutput) === JSON.stringify(actualOutput)
          );
        }
        return false;
      });

      setTestResults(updatedTestResults);

      setTestCaseOutputs(
        results.map((result: { output: any }) => result?.output || ''),
      );
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmit(true);
    try {
      if (testResults.every(result => result)) {
        const response = await dispatch(
          submitProblem({
            id: problem.id,
            code: problem.code,
            email: user.email,
            title: problem.title,
            difficuly: problem.difficulty,
            language: language,
            submited: 'Solved',
          }),
        ).unwrap();

        

        if (response.success) {
          

          setSolved(response?.submited);
          setIsModalOpen(true);
          setError(null);
        } else {
          setError('Submission was not successful. Please try again.');
        }
      } else {
        setError('Not all test cases passed. Please fix your code.');
      }
    } catch (error) {
      console.error('Error submitting problem:', error);
      setError('An error occurred while submitting. Please try again.');
    } finally {
      setSubmit(false);
    }
  };

  const handleLanguageChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLanguage(event.target.value);
    setCode('');
 
  };

  const handleTestCaseClick = (index: number) => {
    setSelectedTestCase(index);
  };

  return (
    <div className='flex flex-col h-screen bg-gray-50 p-4'>
      {/* Message for small and medium screens */}
      <div className='md:hidden'>
        <div
          className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4'
          role='alert'
        >
          <p className='font-bold'>Please open on a desktop</p>
          <p>
            This code editor is optimized for larger screens. For the best
            experience, please use a desktop or laptop computer.
          </p>
        </div>
      </div>

      {/* Content for desktop screens */}
      <div className='hidden md:block'>
        <div className='flex justify-between items-center mb-4'>
          <select
            value={language}
            onChange={handleLanguageChange}
            className='p-1 border border-gray-300 rounded-md'
          >
            {availableLanguages.map((lang: string, index: number) => (
              <option key={index} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <div className='space-x-2'>
            <button
              className='bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded-md'
              onClick={handleRun}
              disabled={loading}
            >
              {loading ? 'Running...' : 'Run'}
            </button>
            <button
              className='bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-md'
              onClick={handleSubmit}
              disabled={submit}
            >
              {submit ? 'Submitting...' : 'Submit'}
            </button>
            <SuccessModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
        {error && (
          <div className='bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded relative'>
            <strong className='font-bold'>Error:</strong>
            <span className='block sm:inline'>{error}</span>
          </div>
        )}
        <div className='flex-1 flex flex-col md:flex-row gap-4 mt-2'>
          <div className='md:w-1/2 bg-white p-4 border border-gray-300 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-2'>Code Editor</h2>
            <div className='flex flex-col gap-4'>
              <div className='h-60 md:h-80'>
                <div
                  id='code-editor'
                  className='h-full border border-gray-300 rounded-md'
                >
                  <Editor
                    height='45vh'
                    language={language}
                    value={code}
                    onChange={value => setCode(value || '')}
                    theme='vs-dark'
                  />
                </div>
              </div>
              <TestCases
                testCases={testCases}
                testResults={testResults}
                testCaseOutputs={testCaseOutputs}
                loadingTestCases={loadingTestCases}
                handleTestCaseClick={handleTestCaseClick}
                selectedTestCase={selectedTestCase}
              />
            </div>
          </div>
          <ProblemDescription
            problem={problem}
            solved={solved}
            testCases={testCases}
          />
        </div>
        <RunningModal isOpen={loading} />
      </div>
    </div>
  );
};

export default CodeEditorMain;
