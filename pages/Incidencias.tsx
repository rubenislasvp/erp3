

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Incidencia, NewIncidencia, Empleado } from '../types';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { FullPageSpinner } from '../components/ui/Spinner';
import IncidenciaForm from '../components/IncidenciaForm';
import { useAuth } from './hooks/useAuth';
import { format } from 'date-fns';

const Incidencias: React.FC = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIncidencia, setSelectedIncidencia] = useState<Incidencia | null>(null);

    const { data: incidencias, isLoading: loadingIncidencias } = useQuery<Incidencia[]>({
        queryKey: ['incidencias'],
        queryFn: api.getIncidencias,
    });
     const { data: employees, isLoading: loadingEmployees } = useQuery<Empleado[]>({
        queryKey: ['employees'],
        queryFn: api.getEmployees,
    });
    
    const incidenciasData = useMemo(() => {
        if (!incidencias || !employees) return [];
        const employeeMap = new Map(employees.map(e => [e.EMPLEADO_ID, e.NOMBRE_COMPLETO]));

        const allData = incidencias.map(i => ({
            ...i,
            empleado_nombre: employeeMap.get(i.EMPLEADO_ID) || `ID: ${i.EMPLEADO_ID}`,
        }));
        
        if (user?.role === 'employee') {
            return allData.filter(item => item.EMPLEADO_ID === user.EMPLEADO_ID);
        }
        return allData;

    }, [incidencias, employees, user]);

    const addMutation = useMutation({
        mutationFn: (incidencia: NewIncidencia) => api.addIncidencia(incidencia),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['incidencias'] });
            handleCloseModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (incidencia: Incidencia) => api.updateIncidencia(incidencia),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['incidencias'] });
            handleCloseModal();
        },
    });

     const deleteMutation = useMutation({
        mutationFn: (incidenciaId: number) => api.deleteIncidencia(incidenciaId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['incidencias'] });
        },
    });
    
    const handleOpenModal = (incidencia: Incidencia | null = null) => {
        setSelectedIncidencia(incidencia);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedIncidencia(null);
    };

    const handleSaveIncidencia = (incidenciaData: Incidencia | NewIncidencia) => {
        if ('id' in incidenciaData && incidenciaData.id) {
            updateMutation.mutate(incidenciaData as Incidencia);
        } else {
            addMutation.mutate(incidenciaData as NewIncidencia);
        }
    };
    
    const handleDelete = (incidenciaId: number) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta incidencia?')) {
            deleteMutation.mutate(incidenciaId);
        }
    }

    const canManage = user?.role === 'admin' || user?.role === 'manager';
    const isLoading = loadingIncidencias || loadingEmployees;

    if (isLoading) return <FullPageSpinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    {user?.role === 'employee' ? 'Mis Incidencias' : 'Gestión de Incidencias'}
                </h1>
                {canManage && <Button onClick={() => handleOpenModal()}>Agregar Incidencia</Button>}
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Fecha</th>
                                {canManage && <th className="p-4 font-semibold">Empleado</th>}
                                <th className="p-4 font-semibold">Descripción</th>
                                <th className="p-4 font-semibold">Observaciones</th>
                                {canManage && <th className="p-4 font-semibold">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {incidenciasData?.map((inc) => (
                                <tr key={inc.id} className="border-b dark:border-gray-700">
                                    <td className="p-4">{format(new Date(inc.fecha), 'dd/MM/yyyy')}</td>
                                    {canManage && <td className="p-4">{inc.empleado_nombre}</td>}
                                    <td className="p-4">{inc.descripcion}</td>
                                    <td className="p-4 truncate max-w-xs">{inc.observacion}</td>
                                    {canManage && (
                                        <td className="p-4 space-x-2 whitespace-nowrap">
                                            <Button variant="secondary" size="sm" onClick={() => handleOpenModal(inc)}>Editar</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(inc.id)}>Eliminar</Button>
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
                title={selectedIncidencia ? 'Editar Incidencia' : 'Agregar Incidencia'}
            >
                <IncidenciaForm
                    incidencia={selectedIncidencia}
                    onSave={handleSaveIncidencia}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default Incidencias;