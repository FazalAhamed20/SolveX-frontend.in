import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-green-100 flex items-center justify-center p-6">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-auto">
    <rect width="200" height="200" fill="#D1FAE5" />
    <rect x="70" y="80" width="60" height="80" rx="10" fill="#10B981" />
    <rect x="75" y="30" width="50" height="45" rx="10" fill="#34D399" />
    <circle cx="90" cy="50" r="5" fill="#D1FAE5" />
    <circle cx="110" cy="50" r="5" fill="#D1FAE5" />
    <line x1="100" y1="30" x2="100" y2="15" stroke="#34D399" strokeWidth="3" />
    <circle cx="100" cy="12" r="4" fill="#34D399" />
    <path d="M70 100 Q 40 100 30 80" stroke="#10B981" strokeWidth="8" fill="none" />
    <path d="M130 100 Q 160 100 170 80" stroke="#10B981" strokeWidth="8" fill="none" />
    <rect x="20" y="140" width="160" height="40" rx="5" fill="#059669" />
    <text x="100" y="165" fontSize="16" fill="#D1FAE5" textAnchor="middle" fontFamily="Arial, sans-serif">Welcome</text>
    <circle cx="30" cy="30" r="10" fill="#A7F3D0" opacity="0.6" />
    <circle cx="170" cy="40" r="15" fill="#A7F3D0" opacity="0.6" />
    <circle cx="40" cy="180" r="12" fill="#A7F3D0" opacity="0.6" />
    <circle cx="160" cy="170" r="8" fill="#A7F3D0" opacity="0.6" />
  </svg>
</div>
          <div className="p-8 md:w-1/2 flex flex-col justify-center">
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.h2 variants={item} className="text-3xl font-bold mb-4 text-green-600">
                {'Welcome to CodeGemini!'.split('').map((char, index) => (
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
  {'Embark on an exciting coding journey powered by Gemini AI. Unlock your potential, collaborate with AI, and bring your ideas to life like never before!'.split(' ').map((word, index) => (
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
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors duration-300"
                >
                  Start Coding Now
                </motion.button>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  href="#" 
                  className="block text-center text-green-600 hover:text-green-800 transition-colors duration-300"
                >
                  Take a Quick Tour
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeModal;