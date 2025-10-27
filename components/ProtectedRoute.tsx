

import React, { ReactNode } from 'react';
import { useAuth } from '../pages/hooks/useAuth';
import Login from '../pages/Login';
import { User, Role } from '../types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  // If roles are specified, check if the user has one of the allowed roles.
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      return (
          <div className="flex items-center justify-center h-full text-center p-8">
              <div>
                <h1 className="text-3xl font-bold text-red-500">Acceso Denegado</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">No tienes permiso para ver esta página.</p>
              </div>
          </div>
      );
  }


  return <>{children}</>;
};

export default ProtectedRoute;