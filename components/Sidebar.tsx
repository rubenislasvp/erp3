
import React from 'react';
import { Page } from '../App';
import {
  DashboardIcon, UsersIcon, CalendarIcon, ClockIcon, PayrollIcon,
  ReportsIcon, BoxIcon, DollarIcon, WarningIcon, BriefcaseIcon,
  ContractIcon, LoanIcon, GavelIcon
} from './Icons';
import { useAuth } from '../pages/hooks/useAuth';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  label: string;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  icon: React.ReactNode;
}> = ({ page, label, currentPage, setCurrentPage, icon }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setCurrentPage(page);
      }}
      className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${
        currentPage === page ? 'bg-gray-200 dark:bg-gray-700' : ''
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { user } = useAuth();
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  return (
    <aside className="w-64" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('dashboard')}} className="flex items-center pl-2.5 mb-5">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Genisa Admin</span>
        </a>
        <ul className="space-y-2">
          <NavItem page="dashboard" label="Dashboard" icon={<DashboardIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {isAdminOrManager && <NavItem page="employees" label="Empleados" icon={<UsersIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          <NavItem page="horarios" label="Horarios" icon={<CalendarIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <NavItem page="asistencia" label="Asistencia" icon={<ClockIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {isAdminOrManager && <NavItem page="payroll" label="Nómina" icon={<PayrollIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          {isAdminOrManager && <NavItem page="reports" label="Reportes" icon={<ReportsIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          {isAdminOrManager && <NavItem page="inventory" label="Inventario" icon={<BoxIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          {isAdminOrManager && <NavItem page="finanzas" label="Finanzas" icon={<DollarIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          <NavItem page="incidencias" label="Incidencias" icon={<WarningIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {isAdminOrManager && <NavItem page="menu" label="Menú" icon={<BriefcaseIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          {isAdminOrManager && <NavItem page="puestos" label="Puestos" icon={<BriefcaseIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          {isAdminOrManager && <NavItem page="contratos" label="Contratos" icon={<ContractIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          {isAdminOrManager && <NavItem page="prestamos" label="Préstamos" icon={<LoanIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          <NavItem page="sanciones" label="Sanciones" icon={<GavelIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;