

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InventarioItem, NewInventarioItem } from '../types';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import InventoryForm from '../components/InventoryForm';
import { FullPageSpinner } from '../components/ui/Spinner';
import Input from '../components/ui/Input';
import { format } from 'date-fns';
import { useAuth } from './hooks/useAuth';

const Inventory: React.FC = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventarioItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const canModify = user?.role === 'admin';

    const { data: inventory, isLoading, error } = useQuery<InventarioItem[]>({
        queryKey: ['inventory'],
        queryFn: () => api.getInventory(),
    });

     const filteredInventory = useMemo(() => {
        if (!inventory) return [];
        if (!searchTerm) return inventory;
        return inventory.filter(item =>
            item.producto?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [inventory, searchTerm]);
    
    const addMutation = useMutation({
        mutationFn: (item: NewInventarioItem) => api.addInventoryItem(item),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            handleCloseModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (item: InventarioItem) => api.updateInventoryItem(item),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            handleCloseModal();
        },
    });

     const deleteMutation = useMutation({
        mutationFn: (itemId: number) => api.deleteInventoryItem(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
        },
    });

    const handleOpenModal = (item: InventarioItem | null = null) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleSaveItem = (itemData: InventarioItem | NewInventarioItem) => {
        if ('id' in itemData && itemData.id) {
            updateMutation.mutate(itemData as InventarioItem);
        } else {
            addMutation.mutate(itemData as NewInventarioItem);
        }
    };

    const handleDelete = (itemId: number) => {
        if (window.confirm('¿Está seguro de que desea eliminar este artículo?')) {
            deleteMutation.mutate(itemId);
        }
    }

    if (isLoading) {
        return <FullPageSpinner />;
    }

    if (error) {
        return <div>Error al cargar el inventario: {(error as Error).message}</div>
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Inventario</h1>
                {canModify && <Button onClick={() => handleOpenModal()}>Agregar Artículo</Button>}
            </div>
             <div className="mb-4">
                 <Input 
                    label=""
                    placeholder="Buscar por nombre de producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Producto</th>
                                <th className="p-4 font-semibold">Categoría</th>
                                <th className="p-4 font-semibold">Cantidad</th>
                                <th className="p-4 font-semibold">Unidad</th>
                                <th className="p-4 font-semibold">Fecha Ingreso</th>
                                {canModify && <th className="p-4 font-semibold">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory?.map((item) => (
                                <tr key={item.id} className="border-b dark:border-gray-700">
                                    <td className="p-4 font-medium">{item.producto}</td>
                                    <td className="p-4">{item.categoria}</td>
                                    <td className="p-4">{item.cantidad}</td>
                                    <td className="p-4">{item.unidad}</td>
                                    <td className="p-4">{format(new Date(item.fecha_ingreso), 'dd/MM/yyyy')}</td>
                                    {canModify && (
                                        <td className="p-4 space-x-2 whitespace-nowrap">
                                            <Button variant="secondary" size="sm" onClick={() => handleOpenModal(item)}>Editar</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>Eliminar</Button>
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
                title={selectedItem ? 'Editar Artículo' : 'Agregar Artículo'}
            >
                <InventoryForm
                    item={selectedItem}
                    onSave={handleSaveItem}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default Inventory;