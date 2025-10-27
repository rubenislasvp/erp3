

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sancion, Empleado } from '../types';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import { FullPageSpinner } from '../components/ui/Spinner';
import { useAuth } from './hooks/useAuth';
import { format } from 'date-fns';

const Sanciones: React.FC = () => {
    const { user } = useAuth();

    const { data: sanciones, isLoading: loadingSanciones } = useQuery<Sancion[]>({
        queryKey: ['sanciones'],
        queryFn: api.getSanciones,
    });
     const { data: employees, isLoading: loadingEmployees } = useQuery<Empleado[]>({
        queryKey: ['employees'],
        queryFn: api.getEmployees,
    });
    
    const sancionesData = useMemo(() => {
        if (!sanciones || !employees) return [];
        const employeeMap = new Map(employees.map(e => [e.EMPLEADO_ID, e.NOMBRE_COMPLETO]));

        const allData = sanciones.map(s => ({
            ...s,
            empleado_nombre: employeeMap.get(s.EMPLEADO_ID) || `ID: ${s.EMPLEADO_ID}`,
        }));
        
        if (user?.role === 'employee') {
            return allData.filter(item => item.EMPLEADO_ID === user.EMPLEADO_ID);
        }
        return allData;

    }, [sanciones, employees, user]);

    const isLoading = loadingSanciones || loadingEmployees;

    if (isLoading) return <FullPageSpinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    {user?.role === 'employee' ? 'Mis Sanciones' : 'Gestión de Sanciones'}
                </h1>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Fecha</th>
                                {user?.role !== 'employee' && <th className="p-4 font-semibold">Empleado</th>}
                                <th className="p-4 font-semibold">Motivo</th>
                                <th className="p-4 font-semibold text-center">N° Sanción</th>
                                <th className="p-4 font-semibold text-right">Monto Aplicado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sancionesData?.map((sanc) => (
                                <tr key={sanc.SANCION_ID} className="border-b dark:border-gray-700">
                                    <td className="p-4">{format(new Date(sanc.FECHA), 'dd/MM/yyyy')}</td>
                                    {user?.role !== 'employee' && <td className="p-4">{sanc.empleado_nombre}</td>}
                                    <td className="p-4">{sanc.MOTIVO}</td>
                                    <td className="p-4 text-center">{sanc.NUMERO_SANCION}</td>
                                    <td className="p-4 text-right text-red-500 font-semibold">
                                        {sanc.MONTO_APLICADO.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Sanciones;