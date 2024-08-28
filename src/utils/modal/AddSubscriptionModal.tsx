import React, { useState, useEffect } from 'react';
import {
  FaPlus,
  FaDollarSign,
  FaClipboardList,
  FaCrown,
} from 'react-icons/fa';
import { AppDispatch } from '../../redux/Store';
import { useDispatch } from 'react-redux';
import { addSubscriptions } from '../../redux/actions/PaymentAction';

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: (newSubscription: Subscription) => void;
}

interface Subscription {
  title: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string;
  tier: 'basic' | 'pro' | 'premium';
}

interface SubmitSubscription
  extends Omit<Subscription, 'features' | 'monthlyPrice' | 'yearlyPrice'> {
  features: string[];
  monthlyPrice: number;
  yearlyPrice: number;
}

interface Errors {
  title: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string;
  tier: string;
}

const initialSubscription: Subscription = {
  title: '',
  monthlyPrice: '',
  yearlyPrice: '',
  features: '',
  tier: 'basic',
};

const initialErrors: Errors = {
  title: '',
  monthlyPrice: '',
  yearlyPrice: '',
  features: '',
  tier: '',
};

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onAddSuccess,
}) => {
  const [newSubscription, setNewSubscription] =
    useState<Subscription>(initialSubscription);
  const [errors, setErrors] = useState<Errors>(initialErrors);
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const validateField = (name: keyof Subscription, value: string): string => {
    switch (name) {
      case 'title':
        return value.trim() === ''
          ? 'Title is required'
          : value.length < 3
          ? 'Title must be at least 3 characters long'
          : '';
      case 'monthlyPrice':
      case 'yearlyPrice':
        if (value.trim() === '') return 'Price is required';
        const price = parseFloat(value);
        if (isNaN(price)) return 'Price must be a number';
        if (price < 0) return 'Price cannot be negative';
        if (price > 1000000) return 'Price cannot exceed 1,000,000';
        return '';
      case 'features':
        if (value.trim() === '') return 'Features are required';
        const features = value.split(',').filter(f => f.trim() !== '');
        return features.length < 1 ? 'At least one feature is required' : '';
      case 'tier':
        return ['basic', 'pro', 'premium'].includes(value)
          ? ''
          : 'Invalid tier selected';
      default:
        return '';
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setNewSubscription(prev => ({ ...prev, [name]: value }));
    const error = validateField(name as keyof Subscription, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    const formIsValid =
      Object.values(errors).every(error => error === '') &&
      Object.values(newSubscription).every(value => value !== '');
    setIsFormValid(formIsValid);
  }, [newSubscription, errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const submitSubscription: SubmitSubscription = {
        ...newSubscription,
        monthlyPrice: parseFloat(newSubscription.monthlyPrice),
        yearlyPrice: parseFloat(newSubscription.yearlyPrice),
        features: newSubscription.features
          .split(',')
          .map(feature => feature.trim())
          .filter(feature => feature !== ''),
      };

      const response = await dispatch(addSubscriptions(submitSubscription));
      console.log('response', response.payload?.success);
      if (response.payload?.success && response.payload?.data) {
        console.log('response', response.payload?.data);
        const newSubscriptionData: any = response.payload.data;
        setNewSubscription(initialSubscription);
        onAddSuccess(newSubscriptionData);
        setErrors(initialErrors);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto'>
        <div className='p-5 border-b'>
          <h3 className='text-xl font-semibold text-gray-900 flex items-center'>
            <FaPlus className='mr-2 text-blue-500' /> New Subscription
          </h3>
        </div>
        <form onSubmit={handleSubmit} className='p-5 space-y-4'>
          {/* Form fields remain the same */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name*
            </label>
            <input
              type='text'
              name='title'
              value={newSubscription.title}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${
                errors.title
                  ? 'border-red-300 focus:border-red-300 focus:ring-red-200'
                  : 'border-gray-300 focus:border-blue-300 focus:ring-blue-200'
              }`}
              required
            />
            {errors.title && (
              <p className='mt-1 text-xs text-red-500'>{errors.title}</p>
            )}
          </div>
          <div className='flex space-x-4'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Monthly Price*
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FaDollarSign className='text-gray-400' />
                </div>
                <input
                  type='text'
                  name='monthlyPrice'
                  value={newSubscription.monthlyPrice}
                  onChange={handleInputChange}
                  className={`block w-full pl-7 pr-12 rounded-md focus:ring focus:ring-opacity-50 ${
                    errors.monthlyPrice
                      ? 'border-red-300 focus:border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-300 focus:ring-blue-200'
                  }`}
                  placeholder='0.00'
                  required
                />
              </div>
              {errors.monthlyPrice && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.monthlyPrice}
                </p>
              )}
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Yearly Price*
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FaDollarSign className='text-gray-400' />
                </div>
                <input
                  type='text'
                  name='yearlyPrice'
                  value={newSubscription.yearlyPrice}
                  onChange={handleInputChange}
                  className={`block w-full pl-7 pr-12 rounded-md focus:ring focus:ring-opacity-50 ${
                    errors.yearlyPrice
                      ? 'border-red-300 focus:border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-300 focus:ring-blue-200'
                  }`}
                  placeholder='0.00'
                  required
                />
              </div>
              {errors.yearlyPrice && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.yearlyPrice}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Features* (comma-separated)
            </label>
            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaClipboardList className='text-gray-400' />
              </div>
              <textarea
                name='features'
                value={newSubscription.features}
                onChange={handleInputChange}
                rows={3}
                className={`block w-full pl-10 rounded-md focus:ring focus:ring-opacity-50 ${
                  errors.features
                    ? 'border-red-300 focus:border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-300 focus:ring-blue-200'
                }`}
                placeholder='Enter features, separated by commas'
                required
              />
            </div>
            {errors.features && (
              <p className='mt-1 text-xs text-red-500'>{errors.features}</p>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Tier*
            </label>
            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaCrown className='text-gray-400' />
              </div>
              <select
                name='tier'
                value={newSubscription.tier}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-10 py-2 text-base focus:outline-none focus:ring sm:text-sm rounded-md ${
                  errors.tier
                    ? 'border-red-300 focus:border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                required
              >
                <option value='basic'>Basic</option>
                <option value='pro'>Pro</option>
                <option value='premium'>Premium</option>
              </select>
            </div>
            {errors.tier && (
              <p className='mt-1 text-xs text-red-500'>{errors.tier}</p>
            )}
          </div>
        </form>
        <div className='px-5 py-4 bg-gray-50 text-right space-x-3 rounded-b-lg'>
          <button
            onClick={onClose}
            className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Cancel
          </button>
          <button
            type='submit'
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              isFormValid
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-400 cursor-not-allowed'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
