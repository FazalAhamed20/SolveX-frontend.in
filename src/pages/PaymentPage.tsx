import { Elements } from '@stripe/react-stripe-js';
import Navbar from '../components/navbar/Navbar';
import PaymentForm from '../components/payment/payment/Payment';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { useSocketNotification } from '../hooks/useSocketNotification';
function PaymentPage() {
  const stripePromise = loadStripe(
    'pk_test_51Pknjl00u5cGnC9nG0VJtpHPYIEgvXb7PC34c1BOA0jOQ02oWWy9UJvxoJRIoHtyf9zOOVUCjilAj9g3NevmgC9j004QaaYwPt',
  );
  const user = useSelector((state: any) => state.user.user);
  const { socket, notifications, clearNotification } = useSocketNotification(user._id);
  return (
    <div>
       <Navbar notifications={notifications} clearNotification={clearNotification} socket={socket} />
      <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center'>
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  </div>
    </div>
  );
}

export default PaymentPage;
