import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, NewProduct, Company, ProductType } from '../types';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ProductForm from '../components/ProductForm';
import { FullPageSpinner } from '../components/ui/Spinner';
import Input from '../components/ui/Input';
import { useAuth } from './hooks/useAuth';

const Menu: React.FC = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const canManage = user?.role === 'admin' || user?.role === 'manager';

    const { data: products, isLoading, error } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: api.getProducts,
    });
    
    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    const addMutation = useMutation({
        mutationFn: (product: NewProduct) => api.addProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            handleCloseModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (product: Product) => api.updateProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            handleCloseModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (productId: string) => api.deleteProduct(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
    
    const handleOpenModal = (product: Product | null = null) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleSaveProduct = (productData: Product | NewProduct) => {
        if ('id' in productData && productData.id) {
            updateMutation.mutate(productData as Product);
        } else {
            addMutation.mutate(productData as NewProduct);
        }
    };

    const handleDelete = (productId: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar este platillo del menú?')) {
            deleteMutation.mutate(productId);
        }
    };

    if (isLoading) return <FullPageSpinner />;
    if (error) return <div>Error al cargar el menú: {(error as Error).message}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestión de Menú</h1>
                {canManage && <Button onClick={() => handleOpenModal()}>Agregar Platillo</Button>}
            </div>
            <div className="mb-4">
                <Input 
                    label=""
                    placeholder="Buscar platillo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Platillo</th>
                                <th className="p-4 font-semibold">Tipo</th>
                                <th className="p-4 font-semibold">Precio</th>
                                <th className="p-4 font-semibold">Costo</th>
                                <th className="p-4 font-semibold">Margen</th>
                                {canManage && <th className="p-4 font-semibold">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts?.map((product) => {
                                const margin = product.price > 0 ? ((product.price - product.cost) / product.price) * 100 : 0;
                                return (
                                <tr key={product.id} className="border-b dark:border-gray-700">
                                    <td className="p-4 font-medium">{product.name}</td>
                                    <td className="p-4">{product.type}</td>
                                    <td className="p-4">{product.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                                    <td className="p-4">{product.cost.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                                    <td className={`p-4 font-semibold ${margin < 30 ? 'text-red-500' : 'text-green-500'}`}>{margin.toFixed(2)}%</td>
                                    {canManage && (
                                        <td className="p-4 space-x-2 whitespace-nowrap">
                                            <Button variant="secondary" size="sm" onClick={() => handleOpenModal(product)}>Editar</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>Eliminar</Button>
                                        </td>
                                    )}
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedProduct ? 'Editar Platillo' : 'Agregar Platillo'}
            >
                <ProductForm
                    product={selectedProduct}
                    onSave={handleSaveProduct}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default Menu;