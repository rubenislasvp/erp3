

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cuenta } from '../types';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import { FullPageSpinner } from '../components/ui/Spinner';

const Finanzas: React.FC = () => {
    const { data: cuentas, isLoading, error } = useQuery<Cuenta[]>({
        queryKey: ['cuentas'],
        queryFn: api.getCuentas,
    });
    
    if (isLoading) return <FullPageSpinner />;
    if (error) return <div>Error al cargar datos financieros: {(error as Error).message}</div>;

    const getRowColor = (tipo: string) => {
        switch (tipo) {
            case 'EGRESO':
                return 'text-red-500';
            case 'INGRESO':
            case 'CUENTA CORRIENTE':
                return 'text-green-500';
            default:
                return 'dark:text-white';
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Finanzas</h1>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Nombre de la Cuenta</th>
                                <th className="p-4 font-semibold">Tipo</th>
                                <th className="p-4 font-semibold text-right">Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cuentas?.map((cuenta) => (
                                <tr key={cuenta.id} className="border-b dark:border-gray-700">
                                    <td className="p-4 font-medium">{cuenta.nombre}</td>
                                    <td className="p-4">{cuenta.tipo}</td>
                                    <td className={`p-4 font-bold text-right ${getRowColor(cuenta.tipo)}`}>{cuenta.saldo.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Finanzas;
