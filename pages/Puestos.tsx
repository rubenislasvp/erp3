

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Puesto, NewPuesto } from '../types';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { FullPageSpinner } from '../components/ui/Spinner';
import PuestoForm from '../components/PuestoForm';
import { useAuth } from './hooks/useAuth';

const Puestos: React.FC = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPuesto, setSelectedPuesto] = useState<Puesto | null>(null);

    const { data: puestos, isLoading, error } = useQuery<Puesto[]>({
        queryKey: ['puestos'],
        queryFn: api.getPuestos,
    });

    const addMutation = useMutation({
        mutationFn: (puesto: NewPuesto) => api.addPuesto(puesto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['puestos'] });
            handleCloseModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (puesto: Puesto) => api.updatePuesto(puesto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['puestos'] });
            handleCloseModal();
        },
    });

     const deleteMutation = useMutation({
        mutationFn: (puestoId: string) => api.deletePuesto(puestoId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['puestos'] });
        },
    });

    const handleOpenModal = (puesto: Puesto | null = null) => {
        setSelectedPuesto(puesto);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPuesto(null);
    };

    const handleSavePuesto = (puestoData: Puesto | NewPuesto) => {
        if ('id' in puestoData && puestoData.id) {
            updateMutation.mutate(puestoData as Puesto);
        } else {
            addMutation.mutate(puestoData as NewPuesto);
        }
    };

    const handleDelete = (puestoId: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar este puesto?')) {
            deleteMutation.mutate(puestoId);
        }
    }
    
    const canManage = user?.role === 'admin' || user?.role === 'manager';

    if (isLoading) return <FullPageSpinner />;
    if (error) return <div>Error al cargar los puestos: {(error as Error).message}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Puestos y Salarios</h1>
                {canManage && <Button onClick={() => handleOpenModal()}>Agregar Puesto</Button>}
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Nombre del Puesto</th>
                                <th className="p-4 font-semibold">Salario Base Mensual</th>
                                {canManage && <th className="p-4 font-semibold">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {puestos?.map((puesto) => (
                                <tr key={puesto.id} className="border-b dark:border-gray-700">
                                    <td className="p-4 font-medium">{puesto.name}</td>
                                    <td className="p-4">{puesto.baseSalary.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                                    {canManage && (
                                        <td className="p-4 space-x-2 whitespace-nowrap">
                                            <Button variant="secondary" size="sm" onClick={() => handleOpenModal(puesto)}>Editar</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(puesto.id)}>Eliminar</Button>
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
                title={selectedPuesto ? 'Editar Puesto' : 'Agregar Puesto'}
            >
                <PuestoForm
                    puesto={selectedPuesto}
                    onSave={handleSavePuesto}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default Puestos;