import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { LockClosedIcon, CodeIcon, ChipIcon, SupportIcon } from '@heroicons/react/solid';
import { useParams } from 'react-router-dom';
import { PaymentAxios } from '../../../config/AxiosInstance';



const stripePromise = loadStripe('pk_test_51Pknjl00u5cGnC9nG0VJtpHPYIEgvXb7PC34c1BOA0jOQ02oWWy9UJvxoJRIoHtyf9zOOVUCjilAj9g3NevmgC9j004QaaYwPt');

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { amount, subscriptionId, interval } = useParams<{
    amount: string;
    subscriptionId: string;
    interval: string;
  }>();
  console.log(amount,subscriptionId,interval)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
  
    setLoading(true);
    setErrorMessage('');

    // const cardElement = elements.getElement(CardElement);
    // if (!cardElement) {
    //   setErrorMessage('Card element not found');
    //   setLoading(false);
    //   return;
    // }

    // const { error } = await stripe.createToken(cardElement);
    // if (error) {
    //   setErrorMessage("encounters a error"); 
    //   setLoading(false);
    //   return;
    // }

  
   
      
        try {
            const response = await PaymentAxios.post('/create-payment-intent', {
              amount: amount,
               interval:interval,
               subscriptionId:subscriptionId
            }, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
          
            
            const data = response.data;

            console.log("response data",data)
  
    
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });
  
      if (result.error) {
        console.error(result.error.message);
        
      } else {
        if (result.paymentIntent?.status === 'succeeded') {
          console.log('Payment succeeded!');
          
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  
    setLoading(false);
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <motion.h2 
            className="text-3xl font-bold mb-6 text-green-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Upgrade to Pro
          </motion.h2>
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img src="https://via.placeholder.com/400x200?text=Coding+Platform+Pro" alt="Coding Platform Pro" className="rounded-lg shadow-md" />
          </motion.div>
          <motion.ul 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <li className="flex items-center">
              <CodeIcon className="h-6 w-6 text-green-500 mr-2" />
              <span>Advanced code editor</span>
            </li>
            <li className="flex items-center">
              <ChipIcon className="h-6 w-6 text-green-500 mr-2" />
              <span>Unlimited projects</span>
            </li>
            <li className="flex items-center">
              <SupportIcon className="h-6 w-6 text-green-500 mr-2" />
              <span>Priority support</span>
            </li>
          </motion.ul>
        </div>
        <div>
          <motion.div 
            className="bg-gray-50 p-6 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
                  Card Information
                </label>
                <div className="border border-gray-300 rounded-md p-4 bg-white">
                  <CardElement id="card-element" />
                </div>
              </div>
              <div className="mb-6">
                <p className="text-2xl font-bold text-green-600">${amount} <span className="text-sm font-normal text-gray-500">/{interval}</span></p>
              </div>
              <button
                type="submit"
                disabled={!stripe || loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="h-5 w-5 mr-2" />
                    Pay Now
                  </>
                )}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">
              <LockClosedIcon className="inline-block h-4 w-4 mr-1" />
              Secure payment powered by Stripe
            </p>
          </motion.div>
          <motion.div 
            className="mt-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p className="text-sm text-green-700">
              <strong>Money-back guarantee:</strong> Try Pro risk-free for 30 days. If you're not satisfied, we'll refund your payment.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const PaymentPage: React.FC = () => (
  <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  </div>
);

export default PaymentPage;