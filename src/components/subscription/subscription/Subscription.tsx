import React, { useEffect, useState } from 'react';
import { AppDispatch } from '../../../redux/Store';
import { useDispatch } from 'react-redux';
import { getAllSubscription } from '../../../redux/actions/PaymentAction';
import { Subscription } from '../../../types/userData';
import { useNavigate } from 'react-router-dom';

interface PlanProps {
  _id: string;
  name: string;
  price: number;
  features: Array<{ text: string; included: boolean }>;
  icon: string;
  isBestValue?: boolean;
  interval: 'monthly' | 'yearly'; // Add interval prop
}

const Plan: React.FC<PlanProps> = ({
  name,
  price,
  features,
  isBestValue,
  icon,
  interval,
  _id,
}) => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate(`/payment/${price}/${_id}/${interval}`);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full transform transition duration-300 hover:scale-105 ${
        isBestValue ? 'border-4 border-green-500' : ''
      }`}
    >
      {isBestValue && (
        <div className='bg-green-500 text-white text-xs font-bold uppercase py-1 px-3 rounded-full self-start mb-4'>
          Best Value
        </div>
      )}
      <div className='flex items-center mb-4'>
        <img src={icon} alt={name} className='w-12 h-12 mr-4' />
        <h3 className='text-2xl font-bold text-gray-800'>{name}</h3>
      </div>
      <p className='text-4xl font-bold mb-6 text-green-600'>
        ${price}
        <span className='text-sm font-normal text-gray-600'>/{interval}</span>
      </p>
      <ul className='flex-grow mb-6 space-y-3'>
        {(features ?? []).map((feature, index) => (
          <li
            key={index}
            className={`flex items-center ${
              feature.included ? 'text-gray-800' : 'text-gray-400'
            }`}
          >
            {feature.included ? (
              <svg
                className='w-5 h-5 mr-2 text-green-500'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              <svg
                className='w-5 h-5 mr-2 text-gray-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            )}
            {feature.text}
          </li>
        ))}
      </ul>
      <button
        className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl'
        onClick={handleGetStarted}
      >
        Get Started
      </button>
    </div>
  );
};

const tierIconMap: { [key: string]: string } = {
  basic: 'https://img.icons8.com/doodle/48/000000/rocket--v1.png',
  pro: 'https://img.icons8.com/doodle/48/000000/diamond--v1.png',
  premium: 'https://img.icons8.com/doodle/48/000000/medal--v1.png',
};

const SubscriptionComponent: React.FC = () => {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [plans, setPlans] = useState<Subscription[]>([]);
  const dispatch: AppDispatch = useDispatch();

  const fetchAllSubscription = async () => {
    const response = await dispatch(getAllSubscription());
    setPlans(response.payload?.data as unknown as Subscription[]);
  };

  useEffect(() => {
    fetchAllSubscription();
  }, []);

  return (
    <div className='container mx-auto px-4 py-16 bg-gradient-to-br'>
      <h2 className='text-4xl font-bold text-center mb-4 text-gray-800'>
        Choose Your Perfect Plan
      </h2>
      <p className='text-center text-gray-600 mb-12'>
        Unlock your coding potential with our flexible subscription options
      </p>
      <div className='flex justify-center mb-12'>
        <div className='bg-white rounded-full p-1 shadow-md'>
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium transition duration-200 ${
              interval === 'monthly'
                ? 'bg-green-500 text-white'
                : 'text-gray-600'
            }`}
            onClick={() => setInterval('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium transition duration-200 ${
              interval === 'yearly'
                ? 'bg-green-500 text-white'
                : 'text-gray-600'
            }`}
            onClick={() => setInterval('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {plans.map(plan => (
          <Plan
            key={plan._id}
            name={plan.title}
            price={
              interval === 'monthly'
                ? plan.monthlyPrice ?? 0
                : plan.yearlyPrice ?? 0
            }
            features={(plan.features ?? []).map(feature => ({
              text: feature,
              included: true,
            }))}
            icon={tierIconMap[plan.tier] ?? ''}
            isBestValue={plan.tier === 'Pro'}
            interval={interval}
            _id={plan._id}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionComponent;
