import React from 'react';
import { FaCrown } from 'react-icons/fa';

interface SubscriptionType {
  _id: string;
  id: string;
  amount: number;
  paymentMethodId: string;
  startDate: string;
  endDate: string;
  subscriptionAmount: number;
  subscriptionInterval: string;
  subscriptionTier: string;
  subscriptionTile: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isCurrent: boolean; // Changed to boolean
}

interface UserSubscriptionPlanProps {
  plan: SubscriptionType | null;
}

const UserSubscriptionPlan: React.FC<UserSubscriptionPlanProps> = ({ plan }) => {
  const endDate = plan?.endDate ? new Date(plan.endDate).toLocaleDateString() : 'N/A';

  return (
    <div className='flex flex-col p-4 bg-white shadow-md rounded-md mx-4 my-2'>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <FaCrown className='text-yellow-500 text-2xl mr-2' />
          <h2 className='text-xl font-bold'>{plan?.subscriptionTile}</h2>
        </div>
        {plan?.isCurrent && (
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Current Plan
          </span>
        )}
      </div>
      <p className='text-gray-500 mb-2 text-lg font-semibold'>${plan?.amount}/{plan?.subscriptionInterval}</p>
      <p className='text-gray-700 mb-3 text-sm'>
        <span className='font-semibold'>End Date:</span> {endDate}
      </p>
     
        <span className='bg-green-500 text-white font-bold py-2 px-4 rounded text-sm'>
          Active
        </span>
     
    </div>
  );
};

export default UserSubscriptionPlan;
