// src/routes/PrivateRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface PrivateRouteProps {
  element: React.ReactElement;
  adminOnly?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element,
  adminOnly = false,
}) => {
  const isLoggedIn = useSelector((state: any) => state.user.isUser);
  const isAdmin = useSelector((state: any) => state.user.isAdmin);



  if (!isLoggedIn && !isAdmin) {
    return <Navigate to='/login' />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to='/home' />;
  }

  return element;
};

export default PrivateRoute;
