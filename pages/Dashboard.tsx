

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import { FullPageSpinner } from '../components/ui/Spinner';
import { Empleado, IncidenciaNomina, Sancion, Contrato, EmpleadoDetails } from '../types';
import { UsersIcon, BoxIcon, DollarIcon, ExclamationIcon } from '../components/Icons';
import { useAuth } from './hooks/useAuth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    
    // Admin/Manager Dashboard
    const { data: employees, isLoading: loadingEmployees } = useQuery<Empleado[]>({ 
        queryKey: ['employees'], 
        queryFn: api.getEmployees,
        enabled: user?.role === 'admin' || user?.role === 'manager'
    });
     const { data: contracts, isLoading: loadingContracts } = useQuery<Contrato[]>({ 
        queryKey: ['contracts'], 
        queryFn: api.getContratos,
        enabled: user?.role === 'admin' || user?.role === 'manager'
    });

    // Employee Dashboard
    const employeeId = user?.EMPLEADO_ID;
    const { data: employeeDetails, isLoading: loadingDetails } = useQuery<EmpleadoDetails>({
        queryKey: ['employeeDetails', employeeId],
        queryFn: () => api.getEmployeeById(employeeId!),
        enabled: !!employeeId && user?.role === 'employee'
    });
    
    const isLoading = loadingEmployees || loadingContracts || loadingDetails;

    if (isLoading) {
        return <FullPageSpinner />;
    }
    
    // RENDER EMPLOYEE DASHBOARD
    if(user?.role === 'employee' && employeeDetails) {
        const latestIncidencias = [...employeeDetails.incidenciasNomina].sort((a, b) => new Date(b.PERIODO).getTime() - new Date(a.PERIODO).getTime()).slice(0, 5);
        const latestSanciones = [...employeeDetails.sanciones].sort((a, b) => new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime()).slice(0, 5);

        return (
            <div>
                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Hola, {employeeDetails.NOMBRE_CORTO}</h1>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Próximos Turnos (Ejemplo)</h2>
                             <p className="text-gray-600 dark:text-gray-400">Aquí se mostrarán tus próximos turnos asignados.</p>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Incidencias de Nómina Recientes</h2>
                            {latestIncidencias.length > 0 ? (
                                <ul className="space-y-2">
                                {latestIncidencias.map(inc => (
                                    <li key={inc.INCIDENCIA_ID} className="text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                        <span className="font-semibold">{format(new Date(inc.PERIODO), "d MMM yyyy", { locale: es })}:</span>
                                        {inc.FALTAS_DIAS > 0 && <span className="ml-2 text-red-500">Faltas: {inc.FALTAS_DIAS}</span>}
                                        {inc.PAGO_EXTRA > 0 && <span className="ml-2 text-green-500">Extra: {inc.PAGO_EXTRA.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>}
                                        {inc.DESCUENTO_PRESTAMO > 0 && <span className="ml-2 text-yellow-500">Préstamo: {inc.DESCUENTO_PRESTAMO.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>}
                                    </li>
                                ))}
                                </ul>
                            ) : <p className="text-gray-600 dark:text-gray-400">No tienes incidencias recientes.</p>}
                        </div>
                    </Card>
                     <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Sanciones Recientes</h2>
                            {latestSanciones.length > 0 ? (
                                <ul className="space-y-2">
                                {latestSanciones.map(sanc => (
                                    <li key={sanc.SANCION_ID} className="text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                        <span className="font-semibold">{format(new Date(sanc.FECHA), "d MMM yyyy", { locale: es })}:</span>
                                        <span className="ml-2">{sanc.MOTIVO}</span>
                                        <span className="ml-2 font-bold text-red-500">(-{sanc.MONTO_APLICADO.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })})</span>
                                    </li>
                                ))}
                                </ul>
                            ) : <p className="text-gray-600 dark:text-gray-400">No tienes sanciones recientes.</p>}
                        </div>
                    </Card>
                 </div>
            </div>
        );
    }
    
    const activeEmployees = employees?.filter(e => e.ACTIVO).length || 0;
    const contractsToExpire = contracts?.filter((c: Contrato) => {
        if (!c.FECHA_VENCIMIENTO) return false;
        const diff = new Date(c.FECHA_VENCIMIENTO).getTime() - new Date().getTime();
        return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
    }).length || 0;


    // RENDER ADMIN/MANAGER DASHBOARD
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <FullPageSpinner />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <Card className="p-6 flex items-center">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-4">
                            <UsersIcon />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Empleados Activos</p>
                            <p className="text-2xl font-bold">{activeEmployees}</p>
                        </div>
                    </Card>
                        <Card className="p-6 flex items-center">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-full mr-4">
                            <ExclamationIcon />
                            </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Contratos por Vencer</p>
                            <p className="text-2xl font-bold">{contractsToExpire}</p>
                        </div>
                    </Card>
                        <Card className="p-6 flex items-center">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mr-4">
                            <DollarIcon />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Monto Base de Nómina</p>
                            <p className="text-2xl font-bold">
                                {(employees || []).reduce((acc, e) => e.ACTIVO ? acc + e.BASE_MENSUAL : acc, 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                            </p>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Dashboard;