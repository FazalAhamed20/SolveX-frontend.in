import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { FaPlay, FaLightbulb, FaTrophy, FaCode } from 'react-icons/fa';

interface CodePlatformProps {
  youtubeVideoId: string;
  description: string;
}

const CodePlatform: React.FC<CodePlatformProps> = ({ youtubeVideoId, description }) => {
  const [code, setCode] = useState<string>('// Start coding here');
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-green-600">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            CodeMaster Platform
          </motion.span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-8"
          >
            {/* YouTube Video Section */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-green-200">
  <div className="bg-green-500 px-6 py-4 flex items-center">
    <FaPlay className="mr-2 text-white" />
    <h2 className="text-xl font-semibold text-white">Video Tutorial</h2>
  </div>
  <div className="aspect-w-16 aspect-h-10">
    <iframe 
      src={`https://www.youtube.com/embed/${youtubeVideoId}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    ></iframe>
  </div>
</div>

            {/* Description Section */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-green-200"
            >
              <div className="bg-green-500 px-6 py-4 flex items-center">
                <FaLightbulb className="mr-2 text-white" />
                <h2 className="text-xl font-semibold text-white">Description</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">{description}</p>
              </div>
            </motion.div>

            {/* Challenge Progress */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-green-200"
            >
              <div className="bg-green-500 px-6 py-4 flex items-center">
                <FaTrophy className="mr-2 text-white" />
                <h2 className="text-xl font-semibold text-white">Challenge Progress</h2>
              </div>
              <div className="p-6">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div 
                    className="bg-green-500 h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ delay: 0.5, duration: 1 }}
                  ></motion.div>
                </div>
                <p className="text-sm text-gray-600 mt-2">45% Completed</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-8"
          >
            {/* Code Editor Section */}
            <motion.div 
              layout
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-green-200"
            >
              <div className="bg-green-500 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <FaCode className="mr-2 text-white" />
                  <h2 className="text-xl font-semibold text-white">Code Editor</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-green-500 px-4 py-2 rounded-full font-semibold transition duration-300"
                  onClick={() => setIsEditorExpanded(!isEditorExpanded)}
                >
                  {isEditorExpanded ? 'Collapse' : 'Expand'}
                </motion.button>
              </div>
              <motion.div layout>
                <Editor
                  height={isEditorExpanded ? "70vh" : "40vh"}
                  defaultLanguage="javascript"
                  theme="vs-light"
                  value={code}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                  }}
                />
              </motion.div>
              <div className="px-6 py-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold transition duration-300"
                >
                  Run Code
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Tips */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-green-200"
            >
              <div className="bg-green-500 px-6 py-4 flex items-center">
                <FaLightbulb className="mr-2 text-white" />
                <h2 className="text-xl font-semibold text-white">Quick Tips</h2>
              </div>
              <ul className="p-6 space-y-4">
                {['Use descriptive variable names', 'Comment your code', 'Test edge cases'].map((tip, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center text-gray-700"
                  >
                    <span className="text-green-500 mr-2">✓</span>
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CodePlatform;