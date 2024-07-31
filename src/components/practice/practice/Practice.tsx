import React, { useEffect, useLayoutEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { FaPlay, FaLightbulb, FaCode, FaCheckCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PracticeAxios, SubmissionAxios } from '../../../config/AxiosInstance';
import RunningModal from '../../../utils/modal/RunModal';
import { AppDispatch } from '../../../redux/Store';
import { fetchPracticalSubmit } from '../../../redux/actions/SubmissionAction';

const CodePlatform: React.FC = () => {
  const practicals = useSelector((state: any) => state.practical.practical);
  const user = useSelector((state: any) => state.user.user);
  console.log('parctical', practicals);
  const { id } = useParams<{ id: string }>();
  const practical = practicals.find((p: any) => p.id === id);
  const [code, setCode] = useState<string>('// Start coding here');
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [output, setOutput] = useState([]);
  const [input, setInput] = useState([]);
  const [raw, setRaw] = useState([]);
  const [isCorrect, setIsCorrect] = useState<Boolean>(false);
  const [message, setMessage] = useState<String>('');
  const [loading, setLoading] = useState<boolean>(false);
  console.log("practical....",practical);

  const dispatch: AppDispatch = useDispatch();

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const fetchPractice = async () => {
    try {
      const response = await PracticeAxios.get(
        `/fetchPractice/?language=${practical.language}`,
      );
      const data = await response.data;

      console.log('..........', response.data);
      setCode(data.solutionTemplate || '');

      setInput(data.input);
      setRaw(data.output);
    } catch (error) {
      console.error('Error fetching practice problems:', error);
    }
  };

  useLayoutEffect(() => {
    fetchPractice();
    fetchPracticalSubmission()
  }, []);
 
    const fetchPracticalSubmission = async () => {
      try {
        const response = await dispatch(
          fetchPracticalSubmit({
            email: user.email,
            id: id,
          }),
        );
        const submissionStatus = response.payload?.data;
        if (typeof submissionStatus === 'boolean') {
          setIsCorrect(submissionStatus);
          console.log('Submission fetched:', submissionStatus);
        } else {
          console.log('No submission found for this email or submission status is not boolean');
        }
      } catch (error) {
        console.error('Error fetching submission:', error);
      }
    };

  

 

  const handleRunCode = async () => {
    setLoading(true);
    try {
      console.log('....', code);

      const response = await SubmissionAxios.post('/practicalrun', {
        code: code,
        input: input,
        output: raw[0],
        id: practical.id,
        language: practical.language,
        title: practical.title,
        email: user.email
      });

      console.log('./......', response);
      setIsCorrect(response.data?.isCorrect);
      setMessage(response.data?.message);

      setOutput(response.data?.output);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const popUpVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className='min-h-screen bg-white text-gray-800 p-6'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-7xl mx-auto space-y-6'
      >
        {/* First row: Video and Editor */}
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
          {/* Video Section */}
          <motion.div
            variants={popUpVariants}
            initial='hidden'
            animate='visible'
            className='lg:col-span-3 bg-white rounded-xl overflow-hidden shadow-lg border border-green-200'
          >
            <div className='bg-green-500 px-4 py-2 flex items-center'>
              <FaPlay className='mr-2 text-white' />
              <h2 className='text-lg font-semibold text-white'>
                Video Tutorial
              </h2>
            </div>
            <div className='relative w-80%' style={{ paddingTop: '46.25%' }}>
              <iframe
                src={`${practical.videoUrl}`}
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                className='absolute top-0 left-0 w-full h-full'
              ></iframe>
            </div>
          </motion.div>

          <motion.div
            layout
            variants={popUpVariants}
            initial='hidden'
            animate='visible'
            className='lg:col-span-2 bg-white rounded-xl overflow-hidden shadow-lg border border-green-200'
          >
            <div className='bg-green-500 px-4 py-2 flex justify-between items-center'>
              <div className='flex items-center'>
                <FaCode className='mr-2 text-white' />
                <h2 className='text-lg font-semibold text-white'>
                  Code Editor
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='bg-white text-green-500 px-3 py-1 rounded-full font-semibold transition duration-300'
                onClick={() => setIsEditorExpanded(!isEditorExpanded)}
              >
                {isEditorExpanded ? 'Collapse' : 'Expand'}
              </motion.button>
            </div>
            <motion.div layout>
              <Editor
                height={isEditorExpanded ? '50vh' : '30vh'}
                defaultLanguage={practical.language}
                theme='vs-light'
                value={code}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
            </motion.div>
            <div className='px-4 py-2 flex justify-end'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='bg-green-500 text-white px-4 py-2 rounded-full font-semibold transition duration-300'
                onClick={handleRunCode}
              >
                Run Code
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <motion.div
            variants={popUpVariants}
            initial='hidden'
            animate='visible'
            whileHover={{ scale: 1.02 }}
            className='bg-white rounded-xl overflow-hidden shadow-lg border border-green-200'
          >
            <div className='bg-green-500 px-4 py-2 flex items-center'>
              <FaLightbulb className='mr-2 text-white' />
              <h2 className='text-lg font-semibold text-white'>Description</h2>
            </div>
            <div className='p-4 h-60 overflow-auto'>
              <p className='text-gray-700 mb-4'>{practical.description}</p>

              <h3 className='font-semibold text-green-600 mt-4 mb-2'>Input:</h3>
              <pre className='bg-gray-100 p-2 rounded-lg text-gray-700'>
                {`arr: ${JSON.stringify(input[0])}
index: ${input[1]}
value: ${input[2]}`}
              </pre>

              <h3 className='font-semibold text-green-600 mt-4 mb-2'>
                Expected Output:
              </h3>
              <pre className='bg-gray-100 p-2 rounded-lg text-gray-700'>
                {JSON.stringify(raw[0])}
              </pre>
            </div>
          </motion.div>

          {/* Output Section */}
          <motion.div
            variants={popUpVariants}
            initial='hidden'
            animate='visible'
            whileHover={{ scale: 1.02 }}
            className='bg-white rounded-xl overflow-hidden shadow-lg border border-green-200'
          >
            <div className='bg-green-500 px-4 py-2 flex items-center'>
              <FaCode className='mr-2 text-white' />
              <h2 className='text-lg font-semibold text-white'>Output</h2>
            </div>
            <div className='p-4 h-40 overflow-auto'>
              {message && (
                <div
                  className={`mb-2 font-semibold ${
                    isCorrect ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {message}
                </div>
              )}
              {isCorrect && (
                <div className='flex items-center justify-end text-green-500'>
                  <FaCheckCircle className='mr-2' />
                  <span className='font-semibold'>Completed</span>
                </div>
              )}
              <pre className='bg-gray-100 p-4 rounded-lg text-gray-700 h-full overflow-auto'>
                {output}
              </pre>
            </div>
          </motion.div>

          {/* Quick Tips Section */}
          <motion.div
            variants={popUpVariants}
            initial='hidden'
            animate='visible'
            whileHover={{ scale: 1.02 }}
            className='bg-white rounded-xl overflow-hidden shadow-lg border border-green-200'
          >
            <div className='bg-green-500 px-4 py-2 flex items-center'>
              <FaLightbulb className='mr-2 text-white' />
              <h2 className='text-lg font-semibold text-white'>Quick Tips</h2>
            </div>
            <ul className='p-4 space-y-2 h-40 overflow-auto'>
              {practical.quickTips.map((tip: string, index: number) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className='flex items-center text-gray-700'
                >
                  <span className='text-green-500 mr-2'>✓</span>
                  {tip}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {loading && <RunningModal isOpen={false} />}
    </div>
  );
};

export default CodePlatform;


