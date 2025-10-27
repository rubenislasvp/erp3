

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Empleado, NewEmpleado } from '../types';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmployeeForm from '../components/EmployeeForm';
import { FullPageSpinner } from '../components/ui/Spinner';
import Input from '../components/ui/Input';
import { useAuth } from './hooks/useAuth';

interface EmployeesProps {
    onViewDetails: (employeeId: string) => void;
}

const Employees: React.FC<EmployeesProps> = ({ onViewDetails }) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Empleado | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: employees, isLoading, error } = useQuery<Empleado[]>({
        queryKey: ['employees'],
        queryFn: () => api.getEmployees(),
    });

    const filteredEmployees = useMemo(() => {
        if (!employees) return [];
        
        let filtered = employees;
        
        if (user?.role === 'manager') {
            const managerData = employees.find(e => e.EMPLEADO_ID === user.EMPLEADO_ID);
            if (managerData) {
                filtered = employees.filter(e => e.EMPRESA === managerData.EMPRESA);
            } else {
                filtered = [];
            }
        }
        
        if (searchTerm) {
             return filtered.filter(emp =>
                emp.NOMBRE_COMPLETO?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered;
    }, [employees, searchTerm, user]);


    const addMutation = useMutation({
        mutationFn: (employee: NewEmpleado) => api.addEmployee(employee),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            handleCloseModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (employee: Empleado) => api.updateEmployee(employee),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            handleCloseModal();
        },
    });

    const handleOpenModal = (employee: Empleado | null = null) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
    };

    const handleSaveEmployee = (employeeData: Empleado | NewEmpleado) => {
        if ('EMPLEADO_ID' in employeeData && employeeData.EMPLEADO_ID) {
            updateMutation.mutate(employeeData as Empleado);
        } else {
            addMutation.mutate(employeeData as NewEmpleado);
        }
    };

    if (isLoading) {
        return <FullPageSpinner />;
    }

    if (error) {
        return <div>Error al cargar empleados: {(error as Error).message}</div>
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestión de Empleados</h1>
                <Button onClick={() => handleOpenModal()}>Agregar Empleado</Button>
            </div>
             <div className="mb-4">
                 <Input 
                    label=""
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Nombre</th>
                                <th className="p-4 font-semibold">Puesto</th>
                                <th className="p-4 font-semibold">Empresa</th>
                                <th className="p-4 font-semibold">Sueldo Base</th>
                                <th className="p-4 font-semibold">Estatus</th>
                                <th className="p-4 font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees?.map((emp) => (
                                <tr key={emp.EMPLEADO_ID} className="border-b dark:border-gray-700">
                                    <td className="p-4 font-medium">{emp.NOMBRE_COMPLETO}</td>
                                    <td className="p-4">{emp.PUESTO}</td>
                                    <td className="p-4">{emp.EMPRESA}</td>
                                    <td className="p-4">{emp.BASE_MENSUAL.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            emp.ACTIVO ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}>
                                            {emp.ACTIVO ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="p-4 space-x-2 whitespace-nowrap">
                                        <Button variant="secondary" size="sm" onClick={() => onViewDetails(emp.EMPLEADO_ID)}>Ver Detalles</Button>
                                        <Button variant="secondary" size="sm" onClick={() => handleOpenModal(emp)}>Editar</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedEmployee ? 'Editar Empleado' : 'Agregar Empleado'}
            >
                <EmployeeForm
                    employee={selectedEmployee}
                    onSave={handleSaveEmployee}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default Employees;