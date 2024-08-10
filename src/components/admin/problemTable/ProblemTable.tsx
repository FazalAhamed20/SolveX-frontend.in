import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/Store';
import {
  blockProblem,
  updatePremiumStatus,
} from '../../../redux/actions/ProblemActions';
import LogoutModal from '../../../utils/modal/LogoutModal';

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isBlocked: boolean;
  isPremium: boolean;
}

interface Props {
  problems: Problem[];
}

const ProblemTable: React.FC<Props> = ({ problems }) => {
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>(problems);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [problemIdToUpdate, setProblemIdToUpdate] = useState<string | null>(
    null,
  );
  const [problemToUpdate, setProblemToUpdate] = useState<Problem | null>(null);
  const [modalAction, setModalAction] = useState<'block' | 'premium'>('block');
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setFilteredProblems(problems);
  }, [problems]);

  const handleButtonClick = (problem: Problem, action: 'block' | 'premium') => {
    setProblemIdToUpdate(problem._id);
    setProblemToUpdate(problem);
    setModalAction(action);
    setShowModal(true);
  };

  const toggleBlockProblem = async (problemId: string | null) => {
    setIsLoading(true);
    if (problemId) {
      const problemToBlock = filteredProblems.find(
        problem => problem._id === problemId,
      );

      if (problemToBlock) {
        try {
          const newBlockedStatus = !problemToBlock.isBlocked;
          const response = await dispatch(
            blockProblem({
              ...problemToBlock,
              isBlocked: newBlockedStatus,
              tags: [],
              code: '',
              javascript: true,
              id: '',
              status: 'Solved',
            }),
          );

          if (blockProblem.fulfilled.match(response)) {
            const updatedProblem = response.payload.data as unknown as Problem;

            setFilteredProblems(prevProblems =>
              prevProblems.map(problem =>
                problem._id === updatedProblem._id
                  ? { ...problem, isBlocked: updatedProblem.isBlocked }
                  : problem,
              ),
            );

            console.log('Filtered Problems after update:', filteredProblems);
          } else {
            console.error('Failed to block/unblock problem:', response.payload);
          }
        } catch (error) {
          console.error('Failed to block/unblock problem:', error);
        } finally {
          setShowModal(false);
          setProblemIdToUpdate(null);
          setProblemToUpdate(null);
          setIsLoading(false);
        }
      } else {
        console.error('Problem not found');
      }
    }
  };

  const togglePremiumStatus = async (problemId: string | null) => {
    if (problemId) {
      const problemToToggle = filteredProblems.find(
        problem => problem._id === problemId,
      );

      if (problemToToggle) {
        try {
          const newPremiumStatus = !problemToToggle.isPremium;
          const response = await dispatch(
            updatePremiumStatus({
              ...problemToToggle,
              isPremium: newPremiumStatus,
              id: '',
              tags: [],
              code: '',
              javascript: true,
              status: 'Solved',
            }),
          );

          if (updatePremiumStatus.fulfilled.match(response)) {
            const updatedProblem = response.payload.data as unknown as Problem;

            setFilteredProblems(prevProblems =>
              prevProblems.map(problem =>
                problem._id === updatedProblem._id
                  ? { ...problem, isPremium: updatedProblem.isPremium }
                  : problem,
              ),
            );

            console.log(
              'Filtered Problems after premium update:',
              filteredProblems,
            );
          } else {
            console.error('Failed to update premium status:', response.payload);
          }
        } catch (error) {
          console.error('Failed to update premium status:', error);
        } finally {
          setShowModal(false);
          setProblemIdToUpdate(null);
          setProblemToUpdate(null);
        }
      } else {
        console.error('Problem not found');
      }
    }
  };

  const handleSearch = (query: string) => {
    const filtered = problems.filter(
      problem =>
        problem.title.toLowerCase().includes(query.toLowerCase()) ||
        problem.description.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredProblems(filtered);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const handleConfirmation = () => {
    if (modalAction === 'block') {
      toggleBlockProblem(problemIdToUpdate);
    } else {
      togglePremiumStatus(problemIdToUpdate);
    }
  };

  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  return (
    <div className='bg-white shadow-md rounded-lg p-6'>
      <h2 className='text-xl font-bold mb-4'>Problems</h2>
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
                Difficulty
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Premium
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {paginatedProblems.map(problem => (
              <tr key={problem._id}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>{problem.title}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900 truncate max-w-xs'>
                    {problem.description}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div
                    className={`text-sm ${
                      problem.difficulty === 'Easy'
                        ? 'text-green-500'
                        : problem.difficulty === 'Medium'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }`}
                  >
                    {problem.difficulty}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <button
                    onClick={() => handleButtonClick(problem, 'premium')}
                    className={`px-2 py-1 text-xs rounded ${
                      problem.isPremium
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    {problem.isPremium ? 'Premium' : 'Free'}
                  </button>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <button
                    onClick={() => handleButtonClick(problem, 'block')}
                    className={`px-2 py-1 text-xs rounded ${
                      problem.isBlocked
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {problem.isBlocked ? 'Unblock' : 'Block'}
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
        onLogout={handleConfirmation}
        data={
          modalAction === 'block'
            ? problemToUpdate?.isBlocked
              ? 'Unblock'
              : 'Block'
            : problemToUpdate?.isPremium
            ? 'Make Free'
            : 'Make Premium'
        }
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProblemTable;
