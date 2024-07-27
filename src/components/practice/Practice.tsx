import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { FaPlay, FaLightbulb, FaCode } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PracticeAxios, SubmissionAxios } from '../../config/AxiosInstance';

const CodePlatform: React.FC = () => {
  const practicals = useSelector((state: any) => state.practical.practical);
  const { id } = useParams<{ id: string }>();
  const practical = practicals.find((p: any) => p.id === id);

  const [code, setCode] = useState<string>('// Start coding here');
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [output, setOutput] = useState<string>('');

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleRunCode =async () => {
    console.log('....',code);

    const response=await SubmissionAxios.post('/practicalrun',{
      code:code,
      
    })

    console.log("./......",response)

    
    
    setOutput(response.data?.output );
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

          {/* Code Editor Section */}
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
                defaultLanguage='javascript'
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

        {/* Second row: Description, Output, and Quick Tips */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Description Section */}
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
            <div className='p-4 h-40 overflow-auto'>
              <p className='text-gray-700'>{practical.description}</p>
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
              <pre className='bg-gray-100 p-4 rounded-lg text-gray-700 h-full overflow-auto'>
                {output}
              </pre>
            </div>
          </motion.div>

          {/* Quick Tips */}
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
    </div>
  );
};

export default CodePlatform;
