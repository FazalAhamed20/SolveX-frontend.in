import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/Store';
import { updateProfile } from '../../redux/actions/AuthActions';
import { fetchSolved } from '../../redux/actions/SubmissionAction';
import { toast } from 'react-toastify';
import axios from 'axios';
import EditProfileModal from '../../utils/modal/EditProfileModal';
import ProfileCard from './ProfileCard';
import SolvedProblemsCard from './SolvedProblemsCard';
import SubmissionActivityCard from './SubmissionActivityCard';
import CalendarHeatmapCard from './CalenderHeatmapCard';
import UserSubscriptionPlan from './SubscriptionPlanCard';
import './UserProfile.css'
import { checkSubscription } from '../../redux/actions/PaymentAction';
import { problemlist } from '../../redux/actions/ProblemActions';
const UserProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  
  const [submissionData, setSubmissionData] = useState([]);
  const [todaySubmissions, setTodaySubmissions] = useState([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [averageSubmissions, setAverageSubmissions] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isLoading,setIsLoading]=useState(false)
  const [profile, setProfile] = useState({
    username: user.username,
    role: user.role,
    bio: user.bio,
    github: user.github,
    linkedin: user.linkedin,
    twitter: user.twitter,
    profileImage: user.profileImage || '',
    email: user?.email,
  });

  interface SubscriptionType {
    _id: string;
    id: string;
    amount: number;
    paymentMethodId: string;
    startDate: string;
    endDate: string;
    subscriptionAmount: number;
    subscriptionInterval: string;
    subscriptionTier: string;
    subscriptionTile: string;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
    isCurrent:true
  }
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endDate = new Date(
    today.getFullYear(),
    today.getMonth() + 7,
    today.getDate(),
  );
  const formattedToday = today.toISOString().split('T')[0];
  const [subscription, setSubscription] = useState<SubscriptionType | null>(null);
  const [difficultyCount, setDifficultyCount] = useState({
    easy: 0,
    medium: 0,
    hard: 0
  });

  const [solvedProblems, setSolvedProblems] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        toast.error(
          'Invalid image format. Please select a JPEG, PNG, or GIF image.',
        );
        return;
      }

   
        

      const imageUrl = URL.createObjectURL(file);

      setProfile((prevProfile) => ({
        ...prevProfile,
        profileImage: imageUrl,
      }));
      
    }
  };
  useEffect(() => {
    const fetchProblemList = async () => {
      try {
        const response = await dispatch(problemlist()).unwrap();
        
  
        
        if (Array.isArray(response)) {
          const count = response.reduce((acc, problem) => {
            if (problem.difficulty) {
              const difficulty = problem.difficulty.toLowerCase();
              acc[difficulty] = (acc[difficulty] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);
  
          setDifficultyCount({
            easy: count.easy || 0,
            medium: count.medium || 0,
            hard: count.hard || 0
          });
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
  
    fetchProblemList();
  }, []); 
  useEffect(() => {
    const fetchSubmissionProblem = async () => {
      try {
        const response = await dispatch(
          fetchSolved({ email: user.email }),
        ).unwrap();
        

        const problemCount = { easy: 0, medium: 0, hard: 0 };
        const submissionDates = response.map(
          (submission: { createdAt: string | number | Date }) => {
            const date = new Date(submission.createdAt);
            return {
              date: date.toISOString().split('T')[0],
              count: 1,
            };
          },
        );
        response.forEach((submission: { difficulty: string; submited: string }) => {
          if (submission.submited === 'Solved') {
            if (submission.difficulty === 'Easy') {
              problemCount.easy += 1;
            } else if (submission.difficulty === 'Medium') {
              problemCount.medium += 1;
            } else if (submission.difficulty === 'Hard') {
              problemCount.hard += 1;
            }
          }
        });
        
        setSolvedProblems(problemCount);
        setSubmissionData(submissionDates);

        const todaysSubmissions = response.filter(
          (submission: { createdAt: string | number | Date }) => {
            const submissionDate = new Date(submission.createdAt)
              .toISOString()
              .split('T')[0];
            return submissionDate === formattedToday;
          },
        );

        setTodaySubmissions(todaysSubmissions);
        setTotalSubmissions(response.length);

        const uniqueDates = [
          ...new Set(submissionDates.map((sub: { date: any }) => sub.date)),
        ];
        const avgSubmissions = response.length / uniqueDates.length;
        setAverageSubmissions(avgSubmissions);

        let currentStreak = 0;
        let maxStreak = 0;
        submissionDates.sort(
          (
            a: { date: string | number | Date },
            b: { date: string | number | Date },
          ) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        for (let i = 0; i < submissionDates.length; i++) {
          if (
            i === 0 ||
            new Date(submissionDates[i].date).getTime() ===
              new Date(submissionDates[i - 1].date).getTime() +
                24 * 60 * 60 * 1000
          ) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
          if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
          }
        }

        setBestStreak(maxStreak);
      } catch (error) {
        console.error('Error fetching submission:', error);
      }
    };

    fetchSubmissionProblem();
  }, [dispatch, user.email]);
  const uploadImageToCloudinary = async (file: File) => {
    const imageData = new FormData();
    imageData.append('file', file);
    imageData.append('upload_preset', 'upload');

    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dlitqiyia/image/upload',
      imageData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data.url

  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)

    

    let updatedProfile = { ...profile };

    if (profile.profileImage?.startsWith('blob:')) {
        try {
            const file = await fetch(profile.profileImage)
                .then((res) => res.blob())
                .then((blob) => new File([blob], 'profileImage.png', { type: blob.type }));
            const uploadedImageUrl = await uploadImageToCloudinary(file);
            
            updatedProfile.profileImage = uploadedImageUrl || '';
        } catch (error) {
            toast.error('An error occurred while uploading the image. Please try again.');
            console.error('Image upload error:', error);
            return;
        }
    } else if (!profile.profileImage) {
        updatedProfile.profileImage = '';
    }

    

    try {
        const response = await dispatch(updateProfile(updatedProfile));

        

        if (response.payload?.success === true) {
            toast.success('Profile Updated');
            setIsLoading(false)
            closeModal();
        } else {
            toast.error('Failed to update profile. Please try again.');
        }
    } catch (error) {
        toast.error('An error occurred while updating the profile. Please try again.');
        console.error('Profile update error:', error);
    }
}
  useLayoutEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await dispatch(checkSubscription({ userId: user._id }));
        const subscriptionData = response.payload?.data;

        if (subscriptionData) {
          setSubscription(subscriptionData as unknown as SubscriptionType);
        } else {
          setSubscription(null);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    };

    fetchSubscription();
  }, [dispatch, user._id]);
  
  const handleRemoveImage = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      profileImage: '',
    }));
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col md:flex-row'>
       <div className='md:w-1/3 min-h-full flex flex-col'>
        <ProfileCard user={user} openModal={openModal} />
        <UserSubscriptionPlan plan={subscription} />
      </div>
      <div className='md:w-2/3 flex flex-col mx-4 my-4'>
        <div className='flex flex-col md:flex-row mb-4'>
          <div className='flex-1 md:mr-2'>
            <SolvedProblemsCard solvedProblems={solvedProblems} difficultyCount={difficultyCount}/>
          </div>
          <div className='flex-1 md:ml-2'>
            <SubmissionActivityCard
              todaySubmissions={todaySubmissions}
              totalSubmissions={totalSubmissions}
              averageSubmissions={averageSubmissions}
              bestStreak={bestStreak}
            />
          </div>
        </div>
        <CalendarHeatmapCard
          startDate={startDate}
          endDate={endDate}
          submissionData={submissionData}
        />
         
      </div>
      <EditProfileModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        profile={profile}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        handleRemoveImage={handleRemoveImage}
      />
    </div>
  );
};

export default UserProfile;
