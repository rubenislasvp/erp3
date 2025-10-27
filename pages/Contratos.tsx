

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Contrato, Empleado } from '../types';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import { FullPageSpinner } from '../components/ui/Spinner';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale/es';

const Contratos: React.FC = () => {
    const { data: contratos, isLoading: loadingContratos } = useQuery<Contrato[]>({
        queryKey: ['contratos'],
        queryFn: api.getContratos,
    });
    const { data: employees, isLoading: loadingEmployees } = useQuery<Empleado[]>({
        queryKey: ['employees'],
        queryFn: api.getEmployees,
    });

    const contractsWithDetails = useMemo(() => {
        if (!contratos || !employees) return [];
        const employeeMap = new Map(employees.map(e => [e.EMPLEADO_ID, e]));
        
        return contratos.map(c => {
            const employee = employeeMap.get(c.EMPLEADO_ID);
            let status: 'valid' | 'expiring' | 'expired' | 'indeterminate' = 'indeterminate';
            let statusText = 'Indeterminado';
            
            if (c.FECHA_VENCIMIENTO) {
                 const daysDiff = differenceInDays(new Date(c.FECHA_VENCIMIENTO), new Date());
                 if (daysDiff < 0) {
                     status = 'expired';
                     statusText = 'Expirado';
                 } else if (daysDiff <= 30) {
                     status = 'expiring';
                     statusText = `Expira en ${daysDiff} días`;
                 } else {
                     status = 'valid';
                     statusText = 'Vigente';
                 }
            }

            return {
                ...c,
                employeeName: employee?.NOMBRE_COMPLETO || 'N/A',
                company: employee?.EMPRESA || 'N/A',
                status,
                statusText,
            };
        });
    }, [contratos, employees]);
    
    const getStatusBadgeColor = (status: string) => {
        switch(status) {
            case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'expiring': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'valid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };
     const getRowClass = (status: string) => {
        if (status === 'expired' || status === 'expiring') {
            return 'bg-yellow-50 dark:bg-yellow-900/10';
        }
        return '';
    };

    const isLoading = loadingContratos || loadingEmployees;
    if (isLoading) return <FullPageSpinner />;
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Gestión de Contratos</h1>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Empleado</th>
                                <th className="p-4 font-semibold">Empresa</th>
                                <th className="p-4 font-semibold">Tipo de Contrato</th>
                                <th className="p-4 font-semibold">Fecha de Vencimiento</th>
                                <th className="p-4 font-semibold">Estatus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contractsWithDetails.map((contract) => (
                                <tr key={contract.CONTRATO_ID} className={`border-b dark:border-gray-700 ${getRowClass(contract.status)}`}>
                                    <td className="p-4 font-medium">{contract.employeeName}</td>
                                    <td className="p-4">{contract.company}</td>
                                    <td className="p-4">{contract.TIPO_CONTRATO}</td>
                                    <td className="p-4">{contract.FECHA_VENCIMIENTO ? format(new Date(contract.FECHA_VENCIMIENTO), 'dd MMMM, yyyy', {locale: es}) : 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(contract.status)}`}>
                                            {contract.statusText}
                                        </span>
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

export default Contratos;
