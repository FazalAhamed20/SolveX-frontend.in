import React, { ReactNode } from 'react';
import { X, Users, Award, Globe } from 'lucide-react';

interface BadgeProps {
  children: ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
    {children}
  </span>
);

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">About Us</h2>
          <p className="text-gray-600 mb-4">Learn more about my project</p>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-500" />
              <h3 className="text-lg font-semibold">Our Team</h3>
            </div>
            <p className="text-gray-700">
              This project is belong to Fazal Ahamed and solveX is all about coding and learn coding.
            </p>
            
            <div className="flex items-center">
              <Award className="w-6 h-6 mr-2 text-yellow-500" />
              <h3 className="text-lg font-semibold">Our Achievements</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>SolveX</Badge>
              <Badge>Coding</Badge>
              <Badge>Creativity</Badge>
            </div>
            
            <div className="flex items-center">
              <Globe className="w-6 h-6 mr-2 text-green-500" />
              <h3 className="text-lg font-semibold">Our Mission</h3>
            </div>
            <p className="text-gray-700">
              In future i will add many features to it and i will work on it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsModal;