import React, { lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import MemberTablePage from '../pages/MemberTablePage';

const LandingPage = lazy(() => import('../pages/HomePage'));
const SignupPage = lazy(() => import('../pages/SignupPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const LandingHomePage = lazy(() => import('../pages/LandingHomePage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const AdminDashboard = lazy(() => import('../pages/AdminHomePage'));
const ProblemPage = lazy(() => import('../pages/ProblemPage'));
const EditorPage = lazy(() => import('../pages/EditorPage'));
const ContextPage = lazy(() => import('../pages/ContextPage'));
const PracticePage = lazy(() => import('../pages/PracticePage'));
const LeaderBoardPage = lazy(() => import('../pages/LeaderBoardPage'));
const ClanPage = lazy(() => import('../pages/ClanPage'));
const SubscriptionPage = lazy(() => import('../pages/SubscriptionPage'));
const PaymentPage = lazy(() => import('../pages/PaymentPage'));

const RouteConfig: React.FC = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path='/admin'
        element={<PrivateRoute element={<AdminDashboard />} adminOnly />}
      />

      {/* Private Routes */}
      <Route
        path='/home'
        element={<PrivateRoute element={<LandingHomePage />} />}
      />
      <Route
        path='/profile'
        element={<PrivateRoute element={<ProfilePage />} />}
      />
      <Route
        path='/problem'
        element={<PrivateRoute element={<ProblemPage />} />}
      />
      <Route
        path='/code/:id'
        element={<PrivateRoute element={<EditorPage />} />}
      />
      <Route path='/clan' element={<PrivateRoute element={<ClanPage />} />} />
      <Route
        path='/clans/:clanName/clan/:clanId'
        element={<PrivateRoute element={<MemberTablePage />} />}
      />
      <Route
        path='/subscription'
        element={<PrivateRoute element={<SubscriptionPage />} />}
      />
      <Route
        path='/payment/:amount/:subscriptionId/:interval'
        element={<PrivateRoute element={<PaymentPage />} />}
      />

      {/* Public Routes */}
      <Route path='/' element={<PublicRoute element={<LandingPage />} />} />
      <Route
        path='/signup'
        element={<PublicRoute element={<SignupPage />} />}
      />
      <Route path='/login' element={<PublicRoute element={<LoginPage />} />} />
      <Route path='/forgot' element={<ForgotPasswordPage />} />
      <Route path='/practice/:id' element={<PracticePage />} />
      <Route path='/context' element={<ContextPage />} />
      <Route path='/leaderboard' element={<LeaderBoardPage />} />

      {/* Catch-all route */}
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
};

export default RouteConfig;
