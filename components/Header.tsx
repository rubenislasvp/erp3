

import React from 'react';
import { useAuth } from '../pages/hooks/useAuth';
import { LogoutIcon } from './Icons';
import Button from './ui/Button';

const Header: React.FC = () => {
  const { logout, user } = useAuth();
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div>
        <h2 className="text-xl font-semibold">Administración de Restaurantes</h2>
      </div>
      <div className="flex items-center space-x-4">
        {user && (
          <div className="text-right">
            <p className="font-semibold text-sm">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
          </div>
        )}
        <Button onClick={logout} variant="secondary" size="sm">
          <LogoutIcon />
          Cerrar Sesión
        </Button>
      </div>
    </header>
  );
};

export default Header;