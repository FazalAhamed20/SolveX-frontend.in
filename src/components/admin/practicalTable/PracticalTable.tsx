import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/Store';
import { blockPractical } from '../../../redux/actions/PracticalAction';
import LogoutModal from '../../../utils/modal/LogoutModal';

interface Practical {
  _id: string;
  title: string;
  description: string;
  subtitle: string;
  isBlocked: boolean;
}

interface Props {
  practicals: Practical[];
}

const PracticalTable: React.FC<Props> = ({ practicals }) => {
  const [filteredPracticals, setFilteredPracticals] =
    useState<Practical[]>(practicals);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [practicalIdToBlock, setPracticalIdToBlock] = useState<string | null>(
    null,
  );
  const [practicalToBlock, setPracticalToBlock] = useState<Practical | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setFilteredPracticals(practicals);
  }, [practicals]);

  const handleButtonClick = (practical: Practical) => {
   

    setPracticalIdToBlock(practical._id);
    setPracticalToBlock(practical);
    setShowModal(true);
  };

  const toggleBlockPractical = async (practicalId: string | null) => {
    setIsLoading(true);
    if (practicalId) {
      const practicalToBlock = filteredPracticals.find(
        practical => practical._id === practicalId,
      );

      if (practicalToBlock) {
        try {
          const newBlockedStatus = !practicalToBlock.isBlocked;
          const response = await dispatch(
            blockPractical({
              ...practicalToBlock,
              isBlocked: newBlockedStatus,
              id: '',
              subTitle: '',
              videoUrl: '',
              quickTips: [],
              language: '',
            }),
          );

          if (blockPractical.fulfilled.match(response)) {
            const updatedPractical = response.payload
              .data as unknown as Practical;

            setFilteredPracticals(prevPracticals =>
              prevPracticals.map(practical =>
                practical._id === updatedPractical._id
                  ? { ...practical, isBlocked: updatedPractical.isBlocked }
                  : practical,
              ),
            );

            
          } else {
            console.error(
              'Failed to block/unblock practical:',
              response.payload,
            );
          }
        } catch (error) {
          console.error('Failed to block/unblock practical:', error);
        } finally {
          setShowModal(false);
          setPracticalIdToBlock(null);
          setPracticalToBlock(null);
          setIsLoading(false);
        }
      } else {
        console.error('Practical not found');
      }
    }
  };

  const handleSearch = (query: string) => {
    const filtered = practicals.filter(
      practical =>
        practical.title.toLowerCase().includes(query.toLowerCase()) ||
        practical.description.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredPracticals(filtered);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const handleLogout = () => {
    toggleBlockPractical(practicalIdToBlock);
  };

  const paginatedPracticals = filteredPracticals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredPracticals.length / itemsPerPage);

  return (
    <div className='bg-white shadow-md rounded-lg p-6'>
      <h2 className='text-xl font-bold mb-4'>Practicals</h2>
      <div className='mb-4 flex items-center'>
        <input
          type='text'
          placeholder='Search by title or description'
          className='px-3 py-2 border rounded-md'
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border-collapse border border-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Title
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Description
              </th>

              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {paginatedPracticals.map(practical => (
              <tr key={practical._id}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>{practical.title}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900 truncate max-w-xs'>
                    {practical.description}
                  </div>
                </td>

                <td className='px-6 py-4 whitespace-nowrap'>
                  <button
                    onClick={() => handleButtonClick(practical)}
                    className={`px-2 py-1 text-xs rounded ${
                      practical.isBlocked
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {practical.isBlocked ? 'Unblock' : 'Block'}
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
        onLogout={handleLogout}
        data={practicalToBlock?.isBlocked ? 'Unblock' : 'Block'}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PracticalTable;
