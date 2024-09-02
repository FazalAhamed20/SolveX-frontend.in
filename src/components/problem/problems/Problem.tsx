import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/Store';
import { problemlist } from '../../../redux/actions/ProblemActions';
import { fetchSolved } from '../../../redux/actions/SubmissionAction';
import { useNavigate } from 'react-router-dom';
import SubscriptionModal from '../../../utils/modal/SubscriptionBannerModel';
import { FaLock } from 'react-icons/fa';
import { checkSubscription } from '../../../redux/actions/PaymentAction';

interface Problem {
  isPremium: any;
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  status: 'Solved' | 'Attempted' | 'Todo';
  isBlocked: boolean;
}

const ProblemList: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<
    Map<string, 'Solved' | 'Attempted'>
  >(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<
    Problem['difficulty'] | 'All'
  >('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 5;
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const navigate = useNavigate();
  const closeModal = () => setIsModalOpen(false);

  const fetchProblemList = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(problemlist()).unwrap();
      setProblems(response as Problem[]);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblemList();
  }, []);

  useEffect(() => {
    const fetchSubmissionProblem = async () => {
      try {
        const response = await dispatch(
          fetchSolved({
            email: user.email,
          })
        ).unwrap();

        if (response) {
          const solvedMap: Map<string, 'Solved' | 'Attempted'> = new Map(
            response.map(
              (item: { title: string; submited: 'Solved' | 'Attempted' }) => [
                item.title,
                item.submited,
              ]
            )
          );
          setSolvedProblems(solvedMap);
        } else {
          ('No submission found for this email');
        }
      } catch (error) {
        console.error('Error fetching submission:', error);
      }
    };

    fetchSubmissionProblem();
  }, [dispatch, user.email]);

  const filteredProblems = useMemo(() => {
    return problems
      .filter((problem) => !problem.isBlocked)
      .filter(
        (problem) =>
          problem.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (difficultyFilter === 'All' ||
            problem.difficulty === difficultyFilter)
      );
  }, [problems, searchTerm, difficultyFilter]);

  const pageCount = Math.ceil(filteredProblems.length / problemsPerPage);
  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * problemsPerPage,
    currentPage * problemsPerPage
  );

  const getDifficultyColor = (difficulty: Problem['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Hard':
        return 'text-red-500';
      default:
        return '';
    }
  };

  const handleProblem = async (problem: Problem) => {
    if (problem.isPremium) {
      try {
        const response = await dispatch(
          checkSubscription({
            userId: user._id,
          })
        ).unwrap();

        if (response.success) {
          navigate(`/code/${problem.id}`);
        } else {
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setIsModalOpen(true);
      }
    } else {
      navigate(`/code/${problem.id}`);
    }
  };

  const ProblemCard: React.FC<{ problem: Problem }> = ({ problem }) => (
    <div
      className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer"
      onClick={() => handleProblem(problem)}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{problem.title}</h3>
        {problem.isPremium && (
          <div className="flex items-center bg-purple-100 px-2 py-1 rounded-full">
            <FaLock className="text-purple-600 mr-1" />
            <span className="text-purple-800 text-xs font-semibold">Premium</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty}
        </span>
        {solvedProblems.has(problem.title) && (
          <span
            className={`px-2 text-xs leading-5 font-semibold rounded-full 
            ${
              solvedProblems.get(problem.title) === 'Solved'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {solvedProblems.get(problem.title)}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {problem.tags.map((tag, tagIndex) => (
          <span
            key={tagIndex}
            className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full text-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search problems..."
          className="p-2 border rounded w-full sm:w-auto"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded w-full sm:w-auto"
          onChange={(e) =>
            setDifficultyFilter(e.target.value as Problem['difficulty'] | 'All')
          }
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div>
          <div className="hidden sm:block overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProblems.map((problem, index) => (
                  <tr
                    key={problem.id}
                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} 
                    cursor-pointer`}
                    onClick={() => handleProblem(problem)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {solvedProblems.has(problem.title) && (
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            solvedProblems.get(problem.title) === 'Solved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {solvedProblems.get(problem.title)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 hover:text-indigo-600 relative">
                        {problem.isPremium ? (
                          <>
                            <div className="absolute inset-0 bg-gray-200 opacity-50 blur-[2px]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex items-center bg-purple-100 px-3 py-1 rounded-full z-10">
                                <FaLock className="text-purple-600 mr-2" />
                                <span className="text-purple-800 font-semibold">
                                  Premium
                                </span>
                              </div>
                            </div>
                          </>
                        ) : null}
                        <span className={problem.isPremium ? 'opacity-20' : ''}>
                          {problem.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden">
            {paginatedProblems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex justify-between w-full sm:w-auto mb-4 sm:mb-0">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {pageCount}
        </span>
      </div>
      <SubscriptionModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default ProblemList;