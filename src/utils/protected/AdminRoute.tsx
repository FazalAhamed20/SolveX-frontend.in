import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const isAdmin = useSelector((state: any) => state.user.isAdmin);

  return isAdmin ? <>{children}</> : <Navigate to="/home" />;
};

export default AdminRoute;