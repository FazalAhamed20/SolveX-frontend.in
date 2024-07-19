import React, { useState, useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProblemAxios } from '../../config/AxiosInstance';

interface TestCase {
  description: string;
  input: string;
  output: string;
}

interface CodeEditorProps {
  initialCode: string;
  problemDescription: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  problemDescription,
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [output, setOutput] = useState<string>('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testResults, setTestResults] = useState<boolean[]>([]);
  const [language, setLanguage] = useState<string>('javascript');
  const [selectedTestCase, setSelectedTestCase] = useState<number | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const { id } = useParams<{ id: string }>();

  const problems = useSelector((state: any) => state.problem.problem);
  
  const problem = problems.find((p: any) => p.id === id);
  const supportedLanguages = problem?.language || [];
  const availableLanguages = supportedLanguages
    .filter((langObj: { [x: string]: any }) => {
      const langName = Object.keys(langObj)[0]; 
      return langObj[langName];
    })
    .map((langObj: {}) => Object.keys(langObj)[0]);

    useEffect(() => {
        const fetchTestCases = async () => {
          try {
            const response = await ProblemAxios.get(`/fetchProblem/${id}-${problem.title}`); 
            const data = response.data;
            console.log("....data", data);
            
            // Assuming `data.input` and `data.output` are arrays of the same length
            const fetchedTestCases = data.input.map((inputItem: any, index: number) => ({
              description: `Test Case ${index + 1}`,
              input: JSON.stringify(inputItem),
              output: JSON.stringify(data.output[index]),
            }));
            console.log("..", fetchedTestCases);
            
            setTestCases(fetchedTestCases);
            setTestResults(new Array(fetchedTestCases.length).fill(false));
          } catch (error) {
            console.error('Error fetching test cases:', error);
          }
        };
      
        if (problem) {
          fetchTestCases();
        }
      }, [id, problem]);
      
  useEffect(() => {
    const editor = monaco.editor.create(
      document.getElementById('code-editor')!,
      {
        value: initialCode,
        language: language,
        theme: 'vs-dark',
        automaticLayout: true,
      },
    );

    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      setCode(editor.getValue());
    });

    return () => {
      editor.dispose();
    };
  }, [initialCode, language]);

  const handleRun = () => {
    const results = testCases.map(testCase => {
      try {
        const result = eval(code);
        return result === JSON.parse(testCase.output);
      } catch (error) {
        return false;
      }
    });
    setTestResults(results);
    setOutput(JSON.stringify(results, null, 2));
  };

  const handleSubmit = () => {
    setOutput('Code submitted successfully!');
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLanguage(event.target.value);
  };

  const handleTestCaseClick = (index: number) => {
    setSelectedTestCase(index);
  };

  return (
    <div className='flex flex-col h-screen bg-gray-50 p-4'>
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
          >
            Run
          </button>
          <button
            className='bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-md'
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <div className='flex-1 flex flex-col md:flex-row gap-4 mt-2'>
        <div className='md:w-1/2 bg-white p-4 border border-gray-300 rounded-lg shadow-md -mt-2'>
          <h2 className='text-xl font-bold mb-2'>Code Editor</h2>
          <div
            id='code-editor'
            className='h-96 border border-gray-300 rounded-md'
          ></div>
        </div>
        <div className='md:w-1/2 bg-white p-4 border border-gray-300 rounded-lg shadow-md -mt-2'>
          <h2 className='text-xl font-bold mb-2'>Problem Description</h2>
          <p>{problemDescription}</p>
          <h3 className='text-lg font-semibold'>{problem?.title}</h3>
          <p>Difficulty: <span className='font-medium'>{problem?.difficulty}</span></p>
          <p>Status: <span className='font-medium'>{problem?.status}</span></p>
          <p>{problem?.description}</p>
          <p>Tags: <span className='font-medium'>{problem?.tags.join(', ')}</span></p>
        </div>
      </div>
      <div className='flex flex-col md:flex-row gap-4 mt-4'>
        <div className='md:w-1/2 bg-white p-4 border border-gray-300 rounded-lg shadow-md'>
          <h2 className='text-xl font-bold mb-2'>Test Cases</h2>
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2'>
            {testCases.map((testCase, index) => (
              <button
                key={index}
                onClick={() => handleTestCaseClick(index)}
                className={`p-1 rounded-md text-white text-xs font-bold ${
                  testResults[index] ? 'bg-green-500' : 'bg-red-500'
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
                <strong>Expected Output:</strong> {testCases[selectedTestCase].output}
              </p>
            </div>
          )}
        </div>
        <div className='md:w-1/2 bg-white p-4 border border-gray-300 rounded-lg shadow-md'>
          <h2 className='text-xl font-bold mb-2'>Output</h2>
          <pre className='whitespace-pre-wrap'>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
