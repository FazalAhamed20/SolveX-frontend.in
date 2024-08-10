import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/Store';
import { blockSubscription } from '../../../redux/actions/PaymentAction';
import LogoutModal from '../../../utils/modal/LogoutModal';
import AddSubscriptionModal from '../../../utils/modal/AddSubscriptionModal';

interface Subscription {
  _id: string;
  title: string;
  description: string;
  isBlocked: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  tier: string;
}

interface Props {
  subscriptions: Subscription[];
}

const SubscriptionTable: React.FC<Props> = ({ subscriptions }) => {
  const [filteredSubscriptions, setFilteredSubscriptions] =
    useState<Subscription[]>(subscriptions);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [subscriptionIdToBlock, setSubscriptionIdToBlock] = useState<string | null>(null);
  const [subscriptionToBlock, setSubscriptionToBlock] = useState<Subscription | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setFilteredSubscriptions(subscriptions);
  }, [subscriptions]);

  const handleButtonClick = (subscription: Subscription) => {
    setSubscriptionIdToBlock(subscription._id);
    setSubscriptionToBlock(subscription);
    setShowModal(true);
  };

  const toggleBlockSubscription = async (subscriptionId: string | null) => {
    setIsLoading(true);
    if (subscriptionId) {
      const subscriptionToBlock = filteredSubscriptions.find(
        subscription => subscription._id === subscriptionId,
      );

      if (subscriptionToBlock) {
        try {
          const newBlockedStatus = !subscriptionToBlock.isBlocked;
          const response = await dispatch(
            blockSubscription({
              ...subscriptionToBlock,
              isBlocked: newBlockedStatus,
            }),
          );

          if (blockSubscription.fulfilled.match(response)) {
            const updatedSubscription = response.payload
              .data as unknown as Subscription;

            setFilteredSubscriptions(prevSubscriptions =>
              prevSubscriptions.map(subscription =>
                subscription._id === updatedSubscription._id
                  ? { ...subscription, isBlocked: updatedSubscription.isBlocked }
                  : subscription,
              ),
            );
          } else {
            console.error('Failed to block/unblock subscription:', response.payload);
          }
        } catch (error) {
          console.error('Failed to block/unblock subscription:', error);
        } finally {
          setShowModal(false);
          setSubscriptionIdToBlock(null);
          setSubscriptionToBlock(null);
          setIsLoading(false);
        }
      } else {
        console.error('Subscription not found');
      }
    }
  };

  const handleSearch = (query: string) => {
    const filtered = subscriptions.filter(
      subscription =>
        subscription.title.toLowerCase().includes(query.toLowerCase()) ||
        subscription.description.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredSubscriptions(filtered);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const handleConfirm = () => {
    toggleBlockSubscription(subscriptionIdToBlock);
  };

  const handleAddSubscription = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  const handleAddSuccess = (newSubscription: any) => {
    setFilteredSubscriptions(prevSubscriptions => [
      ...prevSubscriptions,
      newSubscription,
    ]);
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-6'>
      <h2 className='text-xl font-bold mb-4'>Subscriptions</h2>
      <div className='mb-4 flex items-center'>
        <input
          type='text'
          placeholder='Search by title or description'
          className='px-3 py-2 border rounded-md'
          onChange={e => handleSearch(e.target.value)}
        />
        <button
          onClick={handleAddSubscription}
          className='ml-4 px-4 py-2 bg-blue-500 text-white rounded'
        >
          Add Subscription
        </button>
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border-collapse border border-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Title
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Tier
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Features
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Monthly Price
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Yearly Price
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {paginatedSubscriptions.map(subscription => (
              <tr key={subscription._id}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {subscription.title}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {subscription.tier}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900 truncate max-w-xs'>
                    {subscription.features.join(', ')}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    ${subscription.monthlyPrice.toFixed(2)}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    ${subscription.yearlyPrice.toFixed(2)}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <button
                    onClick={() => handleButtonClick(subscription)}
                    className={`px-2 py-1 text-xs rounded ${
                      subscription.isBlocked
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {subscription.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-between mt-4'>
        <button
          onClick={handlePreviousPage}
          className='px-3 py-1 border rounded-md bg-gray-200'
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          className='px-3 py-1 border rounded-md bg-gray-200'
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <LogoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogout={handleConfirm}
        data={subscriptionToBlock?.isBlocked ? 'Unblock' : 'Block'}
        isLoading={isLoading}
      />
        <AddSubscriptionModal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        onAddSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default SubscriptionTable;
