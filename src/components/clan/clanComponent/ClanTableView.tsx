import React from 'react';

interface ClanMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface Clan {
  _id: any;
  id: number;
  name: string;
  description: string;
  members: ClanMember[];
  trophies: number;
  userId: string;
  isBlocked: boolean;
  leaderId: string;
}

interface ClanTableViewProps {
  clans: Clan[];
  onClanClick: (clan: Clan) => void;
  isUserMember: (clan: Clan) => boolean;
}

const ClanTableView: React.FC<ClanTableViewProps> = ({
  clans,
  onClanClick,
  isUserMember,
}) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full bg-white'>
        <thead>
          <tr className='bg-green-600 text-white'>
            <th className='py-3 px-4 text-left'>Name</th>
            <th className='py-3 px-4 text-left hidden md:table-cell'>
              Description
            </th>
            <th className='py-3 px-4 text-center'>Members</th>
            <th className='py-3 px-4 text-center'>Trophies</th>
            <th className='py-3 px-4 text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {clans.map(clan => (
            <tr key={clan.id} className='border-b hover:bg-green-50'>
              <td className='py-3 px-4'>{clan.name}</td>
              <td className='py-3 px-4 hidden md:table-cell'>
                {clan.description}
              </td>
              <td className='py-3 px-4 text-center'>{clan.members.length}</td>
              <td className='py-3 px-4 text-center'>{clan.trophies}</td>
              <td className='py-3 px-4 text-center'>
                {clan.isBlocked ? (
                  <button
                    className='px-2 py-2 rounded-lg bg-red-500 text-white cursor-not-allowed'
                    disabled
                  >
                    Suspended
                  </button>
                ) : (
                  <button
                    onClick={() => onClanClick(clan)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                      isUserMember(clan)
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-green-600 border border-green-600'
                    }`}
                  >
                    {isUserMember(clan) ? 'Enter' : 'Join'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClanTableView;
