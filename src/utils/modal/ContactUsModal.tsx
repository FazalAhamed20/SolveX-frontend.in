import React from 'react';
import { X, Mail, Github, Linkedin, ExternalLink, Phone, MapPin, Calendar, Coffee, Code, Briefcase, Clock, Globe, Star } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  color: string;
  icon: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ children, color, icon }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color} space-x-1`}>
    {icon}
    <span>{children}</span>
  </span>
);

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full relative overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6">
          <h2 className="text-3xl font-bold text-white mb-2">Contact Me</h2>
          <p className="text-white text-opacity-90">Let's connect and collaborate!</p>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-200"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <Mail className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Email</h3>
              <a href="mailto:Fazalahamed628@gmail.com" className="text-green-600 hover:underline">
                Fazalahamed628@gmail.com
              </a>
            </div>
            <Badge color="bg-green-100 text-green-800" icon={<Coffee className="w-3 h-3" />}>
              Preferred
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Github className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">GitHub</h3>
              <a href="https://github.com/FazalAhamed20" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline flex items-center">
                github.com/FazalAhamed20
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
            <Badge color="bg-teal-100 text-teal-800" icon={<Code className="w-3 h-3" />}>
              Open Source
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Linkedin className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">LinkedIn</h3>
              <a href="www.linkedin.com/in/fazal-ahamed-a-g-860314276" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline flex items-center">
                linkedin.com/in/fazal-ahamed-a-g-860314276
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
            <Badge color="bg-blue-100 text-blue-800" icon={<Briefcase className="w-3 h-3" />}>
              Professional
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <Phone className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Phone</h3>
              <a href="tel:+1234567890" className="text-green-600 hover:underline">
                +91 9360854754
              </a>
            </div>
            <Badge color="bg-yellow-100 text-yellow-800" icon={<Clock className="w-3 h-3" />}>
              9AM - 5PM EST
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <MapPin className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Location</h3>
              <p className="text-gray-600">Kerala, India</p>
            </div>
            <Badge color="bg-purple-100 text-purple-800" icon={<Globe className="w-3 h-3" />}>
              Remote Friendly
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Availability</h3>
              <p className="text-gray-600">Open for opportunities</p>
            </div>
            <Badge color="bg-red-100 text-red-800" icon={<Star className="w-3 h-3" />}>
              Actively Seeking
            </Badge>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;