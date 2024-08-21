import { FiCode, FiBook, FiTrendingUp } from 'react-icons/fi';

import WelcomeUserModal from '../../../utils/modal/WelcomeUserModal';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/Store';

function LandingHome() {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  const handleOpenWelcomeModal = () => {
    setIsWelcomeModalOpen(true);
  };

  const handleCloseWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
  };
  const user = useSelector((state: RootState) => state.user.user);
  
  return (
    <div className='bg-white-100 min-h-screen'>
      <WelcomeUserModal isOpen={isWelcomeModalOpen} onClose={handleCloseWelcomeModal} username={user.username} />
      
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <section className='text-center mb-12'>
          <h1 className='text-5xl font-bold mb-4 text-green-600'>
            Welcome to SolveX
          </h1>
          <p className='text-xl text-gray-700 mb-8'>
            The platform to sharpen your coding skills.
          </p>
        
          <button
            className='bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg shadow-lg transition duration-300 inline-block'
            onClick={handleOpenWelcomeModal}
          >
            Get Started
          </button>
          
        </section>

        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          <div className='bg-white rounded-lg shadow-lg p-6 text-center'>
            <FiCode className='text-5xl text-green-600 mb-4 mx-auto' />
            <h2 className='text-2xl font-semibold mb-4'>Practice Coding</h2>
            <p className='text-gray-700'>
              Access a wide range of coding problems to practice and improve
              your skills.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6 text-center'>
            <FiBook className='text-5xl text-green-600 mb-4 mx-auto' />
            <h2 className='text-2xl font-semibold mb-4'>
              Learn from Tutorials
            </h2>
            <p className='text-gray-700'>
              Explore tutorials and guides covering various programming topics.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6 text-center'>
            <FiTrendingUp className='text-5xl text-green-600 mb-4 mx-auto' />
            <h2 className='text-2xl font-semibold mb-4'>
              Compete in Challenges
            </h2>
            <p className='text-gray-700'>
              Join coding challenges and competitions to test your skills
              against others.
            </p>
          </div>
        </section>

        <section className='bg-green-500 text-white py-12 px-6 rounded-lg shadow-lg mb-12 text-center'>
          <h2 className='text-4xl font-bold mb-4'>What Our Users Say</h2>
          <p className='text-lg mb-8'>
            See how SolveX has helped others improve their coding abilities.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='p-4 bg-white rounded-lg shadow-md'>
              <p className='text-gray-800 mb-4'>
                "SolveX made learning to code fun and interactive. Highly
                recommend!"
              </p>
              <p className='font-semibold'>John Doe</p>
            </div>
            <div className='p-4 bg-white rounded-lg shadow-md'>
              <p className='text-gray-800 mb-4'>
                "The tutorials on SolveX helped me grasp complex concepts
                easily."
              </p>
              <p className='font-semibold'>Jane Smith</p>
            </div>
            <div className='p-4 bg-white rounded-lg shadow-md'>
              <p className='text-gray-800 mb-4'>
                "Competing in challenges boosted my confidence in coding."
              </p>
              <p className='font-semibold'>Alex Johnson</p>
            </div>
          </div>
        </section>

        <section className='text-center mb-12'>
          <h2 className='text-4xl font-bold mb-4'>Why Choose SolveX?</h2>
          <p className='text-lg text-gray-700 mb-8'>
            Discover the benefits of using SolveX to improve your coding skills.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='bg-white rounded-lg shadow-lg p-6 text-center'>
              <h3 className='text-2xl font-semibold mb-4'>
                Structured Learning Paths
              </h3>
              <p className='text-gray-700'>
                Follow structured paths to learn programming languages and
                concepts.
              </p>
            </div>
            <div className='bg-white rounded-lg shadow-lg p-6 text-center'>
              <h3 className='text-2xl font-semibold mb-4'>
                Real-world Projects
              </h3>
              <p className='text-gray-700'>
                Work on real-world projects to apply your coding knowledge.
              </p>
            </div>
            <div className='bg-white rounded-lg shadow-lg p-6 text-center'>
              <h3 className='text-2xl font-semibold mb-4'>Community Support</h3>
              <p className='text-gray-700'>
                Engage with a supportive community of learners and mentors.
              </p>
            </div>
          </div>
        </section>

        <section className='text-center'>
          <h2 className='text-4xl font-bold mb-4'>
            Ready to Improve Your Coding Skills?
          </h2>
          <p className='text-lg text-gray-700 mb-8'>
            Join thousands of users on SolveX and take your coding skills to the
            next level.
          </p>
          <button
            className='bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg shadow-lg transition duration-300 inline-block'
            onClick={handleOpenWelcomeModal}
          >
            Get Started
          </button>
        </section>
      </div>
    </div>
  );
}

export default LandingHome;
