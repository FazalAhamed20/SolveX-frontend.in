import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface PublicRouteProps {
  element: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
  const isLoggedIn = useSelector((state: any) => state.user.isUser);
  const isAdmin = useSelector((state: any) => state.user.isAdmin);

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return element;
};

export default PublicRoute;