import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ProblemAxios, SubmissionAxios } from '../../config/AxiosInstance';
import Editor from '@monaco-editor/react';
import ChatBot from '../../utils/chatBot/ChatBot';
import {
  fetchSubmission,
  submitProblem,
} from '../../redux/actions/SubmissionAction';
import { AppDispatch } from '../../redux/Store';
import SuccessModal from '../../utils/modal/SuccessModal';
import RunningModal from '../../utils/modal/RunModal';

interface TestCase {
  description: string;
  input: string;
  output: string;
}



const CodeEditor: React.FC = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string>('');
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
          console.log('Submission fetched:', data);
          setSolved(data);
          console.log('Solved', solved);
        } else {
          console.log('No submission found for this email');
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

        console.log('ressss.....', response);

        if (response.success) {
          console.log(typeof response?.submited);

          setSolved(response?.submited);
          setIsModalOpen(true);
          setOutput('Code submitted successfully!');
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
    fetchTestCases();
  };

  const handleTestCaseClick = (index: number) => {
    setSelectedTestCase(index);
  };

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
                          <h3 className='font-bold mb-2'>
                            Case {selectedTestCase + 1}
                          </h3>
                          <p className='text-sm'>
                            <strong>Input:</strong>{' '}
                            {testCases[selectedTestCase].input}
                          </p>
                          <p className='text-sm'>
                            <strong>Expected Output:</strong>{' '}
                            {testCases[selectedTestCase].output}
                          </p>
                          <p className='text-sm'>
                            <strong>Actual Output:</strong>
                            {testCaseOutputs[selectedTestCase]
                              ? JSON.stringify(
                                  testCaseOutputs[selectedTestCase],
                                )
                              : 'No output'}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
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
        </div>
        <RunningModal isOpen={loading} />
      </div>
    </div>
  );
};

export default CodeEditor;
