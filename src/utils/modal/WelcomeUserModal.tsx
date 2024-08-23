import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  generateWelcomeUserSpeech } from '../chatBot/geminiApi';


interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  username:string
}

const WelcomeUserModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose ,username}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userSpeech, setUserSpeech] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSpeech();
    }
  }, [isOpen]);

  const loadSpeech = async () => {
    setIsLoading(true);
    try {
      const speech = await generateWelcomeUserSpeech();
      setUserSpeech(speech);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load speech:', error);
      setIsLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-green-100 flex items-center justify-center p-6">
  <video 
    className="w-full h-auto max-w-full" 
    autoPlay 
    loop 
    muted 
    playsInline
  >
    <source src="../../../src/assets/images/boy.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <motion.div variants={container} initial="hidden" animate="show">
                  <motion.h2 variants={item} className="text-3xl font-bold mb-4 text-green-700">
                    {`Welcome ${username}`.split('').map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.h2>
                  <motion.p variants={item} className="mb-6 text-gray-700 leading-relaxed">
                    {isLoading ? 'Loading...' : userSpeech.split(' ').map((word, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="inline-block mr-1"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.p>
                  <motion.div variants={item} className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="w-full bg-green-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-800 transition-colors duration-300"
                    >
                      Welcome 
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeUserModal;