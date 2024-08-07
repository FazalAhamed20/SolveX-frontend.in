import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/Store';
import { blockClan } from '../../../redux/actions/ClanAction';
import LogoutModal from '../../../utils/modal/LogoutModal';

interface Clan {
  _id: string;
  name: string;
  description: string;
  isBlocked: boolean;
}

interface Props {
  clans: Clan[];
}

const ClanTable: React.FC<Props> = ({ clans }) => {
  const [filteredClans, setFilteredClans] = useState<Clan[]>(clans);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [clanIdToBlock, setClanIdToBlock] = useState<string | null>(null);
  const [clanToBlock, setClanToBlock] = useState<Clan | null>(null);
  const itemsPerPage = 5;

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setFilteredClans(clans);
  }, [clans]);

  const handleButtonClick = (clan: Clan) => {
    console.log('clan', clan);
    setClanIdToBlock(clan._id);
    setClanToBlock(clan);
    setShowModal(true);
  };

  const toggleBlockClan = async (clanId: string | null) => {
    console.log('calnID', clanId, filteredClans);
    if (clanId) {
      const clanToToggle = filteredClans.find(clan => clan._id === clanId);

      if (clanToToggle) {
        try {
          const newBlockedStatus = !clanToToggle.isBlocked;
          const response = await dispatch(
            blockClan({
              id: clanToToggle._id,
              isBlocked: newBlockedStatus,
            }),
          );

          if (blockClan.fulfilled.match(response)) {
            const updatedClan = response.payload.data as unknown as Clan;

            setFilteredClans(prevClans =>
              prevClans.map(clan =>
                clan._id === updatedClan._id
                  ? { ...clan, isBlocked: updatedClan.isBlocked }
                  : clan,
              ),
            );
          } else {
            console.error('Failed to block/unblock clan:', response.payload);
          }
        } catch (error) {
          console.error('Failed to block/unblock clan:', error);
        } finally {
          setShowModal(false);
          setClanIdToBlock(null);
          setClanToBlock(null);
        }
      } else {
        console.error('Clan not found');
      }
    }
  };

  const handleSearch = (query: string) => {
    const filtered = clans.filter(
      clan =>
        clan.name.toLowerCase().includes(query.toLowerCase()) ||
        clan.description.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredClans(filtered);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const handleLogout = () => {
    toggleBlockClan(clanIdToBlock);
  };

  const paginatedClans = filteredClans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredClans.length / itemsPerPage);

  return (
    <div className='bg-white shadow-md rounded-lg p-6'>
      <h2 className='text-xl font-bold mb-4'>Clans</h2>
      <div className='mb-4 flex items-center'>
        <input
          type='text'
          placeholder='Search by name or description'
          className='px-3 py-2 border rounded-md'
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border-collapse border border-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Description
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {paginatedClans.map(clan => (
              <tr key={clan._id}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>{clan.name}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900 truncate max-w-xs'>
                    {clan.description}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {clan.isBlocked ? 'Blocked' : 'Active'}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <button
                    onClick={() => handleButtonClick(clan)}
                    className={`px-2 py-1 text-xs rounded ${
                      clan.isBlocked
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {clan.isBlocked ? 'Unblock' : 'Block'}
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
        data={clanToBlock?.isBlocked ? 'Unblock' : 'Block'}
      />
    </div>
  );
};

export default ClanTable;
