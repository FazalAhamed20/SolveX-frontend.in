import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate()

  return (
    <div className='bg-slate-100'>
      
      <div className='container mx-auto py-16 px-5 md:px-20'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-10'>
          <div className='flex-1'>
            <h1 className='text-5xl md:text-6xl font-bold text-green-500 leading-tight mb-3'>
              From Problems{' '}
              <span className='text-green-500'>to Solutions.</span>
            </h1>
            <p className='text-neutral-500 mb-6'>
              We help companies develop the strongest tech teams around. We help
              candidates sharpen their tech skills and pursue job opportunities.
            </p>
            <button
              className='bg-green-500 text-white font-medium py-3 px-6 rounded-md hover:bg-green-600 transition-colors'
              onClick={() => navigate('/signup')}
            >
              Register
            </button>
          </div>
          <div className='flex-1 max-w-[400px] w-full'>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/88c85e5b0c70e5f04b528ec8968fe5bd7490263b18b1a134603061123cb2dc82?'
              alt='Hero Image'
              className='w-full'
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='bg-white py-20'>
        <div className='container mx-auto px-5 md:px-20'>
          <h2 className='text-4xl font-bold text-center mb-10'>
            Features that Matter
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
            <div className='bg-slate-100 p-6 rounded-md shadow-md'>
              <h3 className='text-xl font-bold mb-3'>Skill Assessment</h3>
              <p className='text-neutral-500'>
                Assess your skills and identify areas for improvement.
              </p>
            </div>
            <div className='bg-slate-100 p-6 rounded-md shadow-md'>
              <h3 className='text-xl font-bold mb-3'>Interactive Coding</h3>
              <p className='text-neutral-500'>
                Practice coding in a real-time, collaborative environment.
              </p>
            </div>
            <div className='bg-slate-100 p-6 rounded-md shadow-md'>
              <h3 className='text-xl font-bold mb-3'>Coding Skills</h3>
              <p className='text-neutral-500'>
                Learn how to code and improve your coding skills.
              </p>
            </div>
          </div>
        </div>
      </div>

   {/* Key Benefits Section */}
<div className='bg-slate-100 py-20'>
  <div className='container mx-auto px-5 md:px-20'>
    <h2 className='text-4xl font-bold text-center mb-10'>
      Key Benefits
    </h2>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
      <div className='bg-white p-6 rounded-md shadow-md'>
        <h3 className='font-bold text-xl mb-4'>Enhance Your Skills</h3>
        <p className='text-neutral-500'>
          "Practice a wide range of coding challenges to improve your problem-solving abilities and technical skills."
        </p>
      </div>
      <div className='bg-white p-6 rounded-md shadow-md'>
        <h3 className='font-bold text-xl mb-4'>Learn by Doing</h3>
        <p className='text-neutral-500'>
          "Engage with our interactive coding environment to gain hands-on experience with real-world programming scenarios."
        </p>
      </div>
      <div className='bg-white p-6 rounded-md shadow-md'>
        <h3 className='font-bold text-xl mb-4'>Track Your Progress</h3>
        <p className='text-neutral-500'>
          "Monitor your growth with detailed performance analytics and skill assessments to identify areas for improvement."
        </p>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default Home;
