import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from './utils/modal/LoadingSpinnerModal';
import { AppDispatch } from './redux/Store';
import { setGlobalDispatch } from './redux/dispatchStore';

const LandingPage = lazy(() => import('./pages/HomePage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const LandingHomePage = lazy(() => import('./pages/LandingHomePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const AdminDashboard = lazy(() => import('./pages/AdminHomePage'));
const ProblemPage = lazy(() => import('./pages/ProblemPage'));
const EditorPage = lazy(() => import('./pages/EditorPage'));
const ContextPage = lazy(() => import('./pages/ContextPage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const LeaderBoardPage=lazy(()=>import('./pages/LeaderBoardPage'))

const App: React.FC = () => {
  const isLoggedIn = useSelector((state: any) => state.user.isUser);
  const isAdmin = useSelector((state: any) => state.user.isAdmin);

  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    setGlobalDispatch(dispatch);
  }, [dispatch]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path='/admin'
          element={isAdmin ? <AdminDashboard /> : <Navigate to='/login' />}
        />

        <Route
          path='/home'
          element={isLoggedIn ? <LandingHomePage /> : <Navigate to='/login' />}
        />
        <Route
          path='/'
          element={isLoggedIn ? <Navigate to='/home' /> : <LandingPage />}
        />
        <Route
          path='/signup'
          element={isLoggedIn ? <Navigate to='/home' /> : <SignupPage />}
        />
        <Route
          path='/login'
          element={
            isAdmin ? (
              <Navigate to='/admin' />
            ) : isLoggedIn ? (
              <Navigate to='/home' />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path='/profile'
          element={isLoggedIn ? <ProfilePage /> : <Navigate to='/login' />}
        />
        <Route
          path='/problem'
          element={isLoggedIn ? <ProblemPage /> : <Navigate to='/login' />}
        />
        <Route path='/forgot' element={<ForgotPasswordPage />} />
        <Route
          path='/code/:id'
          element={isLoggedIn ? <EditorPage /> : <Navigate to='/login' />}
        />
        <Route path='/practice/:id' element={<PracticePage />} />
        <Route path='/context' element={<ContextPage />} />
        <Route path='/leaderboard' element={<LeaderBoardPage />} />

        <Route
          path='*'
          element={<Navigate to={isLoggedIn ? '/home' : '/login'} />}
        />
      </Routes>
    </Suspense>
  );
};

export default App;
