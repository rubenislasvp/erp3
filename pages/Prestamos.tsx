import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Prestamo, Empleado } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FullPageSpinner } from '../components/ui/Spinner';
import LoanStatementModal from '../components/LoanStatementModal';

const Prestamos: React.FC = () => {
    const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
    const [selectedPrestamo, setSelectedPrestamo] = useState<(Prestamo & { employeeName: string, total: number }) | null>(null);

    const { data: prestamos, isLoading: loadingPrestamos } = useQuery<Prestamo[]>({
        queryKey: ['prestamos'],
        queryFn: api.getPrestamos,
    });

    const { data: employees, isLoading: loadingEmployees } = useQuery<Empleado[]>({
        queryKey: ['employees'],
        queryFn: api.getEmployees,
    });

    const isLoading = loadingPrestamos || loadingEmployees;

    const prestamosWithDetails = useMemo(() => {
        if (!prestamos || !employees) return [];
        const employeeMap = new Map(employees.map(e => [e.EMPLEADO_ID, e.NOMBRE_COMPLETO]));

        return prestamos.map(p => {
            const total = p.SALDO_EMPRESA + p.SALDO_PAULINO;
            return {
                ...p,
                employeeName: employeeMap.get(p.EMPLEADO_ID) || p.EMPLEADO_ID,
                total,
            };
        });
    }, [prestamos, employees]);

    const handleViewStatement = (prestamo: (Prestamo & { employeeName: string, total: number })) => {
        setSelectedPrestamo(prestamo);
        setIsStatementModalOpen(true);
    };

    const handleCloseStatementModal = () => {
        setIsStatementModalOpen(false);
        setSelectedPrestamo(null);
    };

    if (isLoading) return <FullPageSpinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestión de Préstamos</h1>
                <Button>Registrar Préstamo</Button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Empleado</th>
                                <th className="p-4 font-semibold text-right">Saldo Empresa</th>
                                <th className="p-4 font-semibold text-right">Saldo Paulino</th>
                                <th className="p-4 font-semibold text-right">Saldo Total</th>
                                <th className="p-4 font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prestamosWithDetails?.map(p => (
                                <tr key={p.PRESTAMO_ID} className="border-b dark:border-gray-700">
                                    <td className="p-4 font-medium">{p.employeeName}</td>
                                    <td className="p-4 text-right">{p.SALDO_EMPRESA.toLocaleString('es-MX', { style: 'currency', currency: 'MXN'})}</td>
                                    <td className="p-4 text-right">{p.SALDO_PAULINO.toLocaleString('es-MX', { style: 'currency', currency: 'MXN'})}</td>
                                    <td className="p-4 font-bold text-right">{p.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN'})}</td>
                                    <td className="p-4 space-x-2">
                                        <Button size="sm" variant="secondary" onClick={() => handleViewStatement(p)}>Ver Estado</Button>
                                        <Button size="sm" variant="secondary">Registrar Pago</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            <LoanStatementModal
                isOpen={isStatementModalOpen}
                onClose={handleCloseStatementModal}
                prestamo={selectedPrestamo}
            />
        </div>
    );
};

export default Prestamos;