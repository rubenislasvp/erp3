import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError("Por favor, ingrese correo y contraseña.");
        return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError('Correo o contraseña incorrectos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickLogin = (role: 'admin' | 'manager' | 'employee') => {
      const email = `${role}@genisa.com`;
      const password = 'password';
      setEmail(email);
      setPassword(password);
      login(email, password).catch(() => {
          setError('Error en el inicio de sesión rápido.');
      });
  }


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400">
            Genisa Admin
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Inicia sesión para continuar
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Correo Electrónico"
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@genisa.com"
            />
            <Input
              label="Contraseña"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner /> : 'Iniciar Sesión'}
            </Button>
          </div>
        </form>
         <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-2">
            <p className="text-center text-sm text-gray-500">O inicia sesión como:</p>
            <div className="flex justify-center space-x-2">
                <Button variant="secondary" size="sm" onClick={() => handleQuickLogin('admin')}>Admin</Button>
                <Button variant="secondary" size="sm" onClick={() => handleQuickLogin('manager')}>Manager</Button>
                <Button variant="secondary" size="sm" onClick={() => handleQuickLogin('employee')}>Employee</Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;