import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/Store';
import { problemlist } from '../../redux/actions/ProblemActions';
import { fetchSolved } from '../../redux/actions/SubmissionAction';
import { useNavigate } from 'react-router-dom';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  status: 'Solved' | 'Attempted' | 'Todo';
  isBlocked: boolean;
}

const ProblemList: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<Map<string, 'Solved' | 'Attempted'>>(
    new Map()
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<
    Problem['difficulty'] | 'All'
  >('All');
  const [statusFilter, setStatusFilter] = useState<Problem['status'] | 'All'>(
    'All',
  );
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 5;
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const navigate = useNavigate();


  const fetchProblemList = async () => {
    try {
      const response = await dispatch(problemlist()).unwrap();
      setProblems(response as Problem[]);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };
  useLayoutEffect(() => {
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
            response.map((item: { title: string; submited: 'Solved' | 'Attempted' }) => [item.title, item.submited])
          );
          setSolvedProblems(solvedMap);
        } else {
          console.log('No submission found for this email');
        }
      } catch (error) {
        console.error('Error fetching submission:', error);
      }
    };
  
    fetchSubmissionProblem();
  }, [dispatch, user.email]);
  

  // Filter and paginate problems
  const filteredProblems = useMemo(() => {
    return problems
      .filter(problem => !problem.isBlocked)
      .filter(
        problem =>
          problem.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (difficultyFilter === 'All' ||
            problem.difficulty === difficultyFilter) &&
          (statusFilter === 'All' || problem.status === statusFilter),
      );
  }, [problems, searchTerm, difficultyFilter, statusFilter]);

  const pageCount = Math.ceil(filteredProblems.length / problemsPerPage);
  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * problemsPerPage,
    currentPage * problemsPerPage,
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
  console.log("solved",solvedProblems)

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='mb-4 flex flex-col sm:flex-row gap-4'>
        <input
          type='text'
          placeholder='Search problems...'
          className='p-2 border rounded'
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className='p-2 border rounded'
          onChange={e =>
            setDifficultyFilter(e.target.value as Problem['difficulty'] | 'All')
          }
        >
          <option value='All'>All Difficulties</option>
          <option value='Easy'>Easy</option>
          <option value='Medium'>Medium</option>
          <option value='Hard'>Hard</option>
        </select>
        <select
          className='p-2 border rounded'
          onChange={e =>
            setStatusFilter(e.target.value as Problem['status'] | 'All')
          }
        >
          <option value='All'>All Statuses</option>
          <option value='Solved'>Solved</option>
          <option value='Attempted'>Attempted</option>
          <option value='Todo'>Todo</option>
        </select>
      </div>

      <div className='overflow-x-auto bg-white shadow-md rounded-lg'>
        <table className='min-w-full table-auto'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Title
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Difficulty
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Tags
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {paginatedProblems.map((problem, index) => (
              <tr
                key={problem.id}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className='px-6 py-4 whitespace-nowrap'>
                  {solvedProblems.has(problem.title) && (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${solvedProblems.get(problem.title) === 'Solved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {solvedProblems.get(problem.title)}
                    </span>
                  )}
                </td>
                <td
                  className='px-6 py-4 whitespace-nowrap'
                  onClick={() => navigate(`/code/${problem.id}`)}
                >
                  <div className='text-sm font-medium text-gray-900 hover:text-indigo-600 cursor-pointer'>
                    {problem.title}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`text-sm font-medium ${getDifficultyColor(
                      problem.difficulty,
                    )}`}
                  >
                    {problem.difficulty}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex flex-wrap gap-2'>
                    {problem.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className='px-2 py-1 text-xs font-medium bg-gray-100 rounded-full text-gray-700'
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

      <div className='mt-4 flex justify-between items-center'>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className='px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300'
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {pageCount}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
          disabled={currentPage === pageCount}
          className='px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProblemList;
