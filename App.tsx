
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Login from './pages/Login';
import { useAuth } from './pages/hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeDetails from './pages/EmployeeDetails';
import Payroll from './pages/Payroll';
import Reports from './pages/Reports';
import Inventory from './pages/Inventory';
import Schedule from './pages/Schedule';
import Asistencia from './pages/Asistencia';
import Finanzas from './pages/Finanzas';
import Incidencias from './pages/Incidencias';
import Menu from './pages/Menu';
import Puestos from './pages/Puestos';
import Contratos from './pages/Contratos';
import Prestamos from './pages/Prestamos';
import Sanciones from './pages/Sanciones';

export type Page =
  | 'dashboard'
  | 'employees'
  | 'employeeDetails'
  | 'payroll'
  | 'reports'
  | 'inventory'
  | 'horarios'
  | 'asistencia'
  | 'finanzas'
  | 'incidencias'
  | 'menu'
  | 'puestos'
  | 'contratos'
  | 'prestamos'
  | 'sanciones';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const handleSetCurrentPage = (page: Page) => {
    setSelectedEmployeeId(null); // Reset detail view when changing main page
    setCurrentPage(page);
  };

  const viewEmployeeDetails = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setCurrentPage('employeeDetails');
  };

  const renderPage = () => {
    if (currentPage === 'employeeDetails' && selectedEmployeeId) {
      return <EmployeeDetails employeeId={selectedEmployeeId} onBack={() => handleSetCurrentPage('employees')} />;
    }
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <Employees onViewDetails={viewEmployeeDetails} />;
      case 'payroll':
        return <Payroll />;
      case 'reports':
        return <Reports />;
      case 'inventory':
        return <Inventory />;
      case 'horarios':
        return <Schedule />;
      case 'asistencia':
        return <Asistencia />;
      case 'finanzas':
        return <Finanzas />;
      case 'incidencias':
        return <Incidencias />;
      case 'menu':
        return <Menu />;
      case 'puestos':
        return <Puestos />;
      case 'contratos':
        return <Contratos />;
      case 'prestamos':
        return <Prestamos />;
      case 'sanciones':
        return <Sanciones />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <ProtectedRoute>
      <Layout currentPage={currentPage} setCurrentPage={handleSetCurrentPage}>
        {renderPage()}
      </Layout>
    </ProtectedRoute>
  );
};

export default App;