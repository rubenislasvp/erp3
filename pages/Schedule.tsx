

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shift, NewShift, Empleado } from '../types';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ShiftForm from '../components/ShiftForm';
import { FullPageSpinner } from '../components/ui/Spinner';
import { useAuth } from './hooks/useAuth';

const Schedule: React.FC = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

    const { data: shifts, isLoading, error } = useQuery<Shift[]>({
        queryKey: ['shifts'],
        queryFn: api.getShifts,
    });
    
    const { data: employees } = useQuery<Empleado[]>({
      queryKey: ['employees'],
      queryFn: api.getEmployees
    });

    const filteredShifts = useMemo(() => {
        if (!shifts || !employees) return [];

        const shiftsWithNames = shifts.map(s => {
          const emp = employees.find(e => e.EMPLEADO_ID === s.EMPLEADO_ID);
          return { ...s, employeeName: emp?.NOMBRE_COMPLETO || s.EMPLEADO_ID }
        });

        if (user?.role === 'employee') {
            return shiftsWithNames.filter(s => s.EMPLEADO_ID === user.EMPLEADO_ID);
        }
        return shiftsWithNames;
    }, [shifts, user, employees]);

    const addMutation = useMutation({
        mutationFn: (shift: NewShift) => api.addShift(shift),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shifts'] });
            handleCloseModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (shift: Shift) => api.updateShift(shift),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shifts'] });
            handleCloseModal();
        },
    });

     const deleteMutation = useMutation({
        mutationFn: (shiftId: string) => api.deleteShift(shiftId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shifts'] });
        },
    });

    const handleOpenModal = (shift: Shift | null = null) => {
        setSelectedShift(shift);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedShift(null);
    };

    const handleSaveShift = (shiftData: Shift | NewShift) => {
        if ('id' in shiftData && shiftData.id) {
            updateMutation.mutate(shiftData as Shift);
        } else {
            addMutation.mutate(shiftData as NewShift);
        }
    };

    const handleDelete = (shiftId: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar este turno?')) {
            deleteMutation.mutate(shiftId);
        }
    }
    
    const canManage = user?.role === 'admin' || user?.role === 'manager';

    if (isLoading) return <FullPageSpinner />;
    if (error) return <div>Error al cargar los horarios: {(error as Error).message}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    {user?.role === 'employee' ? 'Mi Horario' : 'Horarios'}
                </h1>
                {canManage && <Button onClick={() => handleOpenModal()}>Agregar Turno</Button>}
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {user?.role !== 'employee' && <th className="p-4 font-semibold">Empleado</th>}
                                <th className="p-4 font-semibold">Fecha</th>
                                <th className="p-4 font-semibold">Entrada</th>
                                <th className="p-4 font-semibold">Salida</th>
                                <th className="p-4 font-semibold">Empresa</th>
                                {canManage && <th className="p-4 font-semibold">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredShifts.map((shift) => (
                                <tr key={shift.id} className="border-b dark:border-gray-700">
                                    {user?.role !== 'employee' && <td className="p-4 font-medium">{shift.employeeName}</td>}
                                    <td className="p-4">{new Date(shift.fecha + 'T00:00:00').toLocaleDateString()}</td>
                                    <td className="p-4">{shift.hora_inicio}</td>
                                    <td className="p-4">{shift.hora_fin}</td>
                                    <td className="p-4">{shift.EMPRESA}</td>
                                    {canManage && (
                                        <td className="p-4 space-x-2 whitespace-nowrap">
                                            <Button variant="secondary" size="sm" onClick={() => handleOpenModal(shift)}>Editar</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(shift.id)}>Eliminar</Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedShift ? 'Editar Turno' : 'Agregar Turno'}
            >
                <ShiftForm
                    shift={selectedShift}
                    onSave={handleSaveShift}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default Schedule;