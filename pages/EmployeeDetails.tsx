

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import { FullPageSpinner } from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { EmpleadoDetails } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';


interface EmployeeDetailsProps {
    employeeId: string;
    onBack: () => void;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold">{value || 'N/A'}</p>
    </div>
);

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employeeId, onBack }) => {
    const { data: employee, isLoading, error } = useQuery<EmpleadoDetails>({
        queryKey: ['employeeDetails', employeeId],
        queryFn: () => api.getEmployeeById(employeeId)
    });

    if (isLoading) return <FullPageSpinner />;
    if (error) return <div>Error al cargar detalles del empleado: {(error as Error).message}</div>;
    if (!employee) return <div>Empleado no encontrado.</div>;
    
    const totalSalary = employee.BASE_MENSUAL + employee.BONOS_MENSUAL;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{employee.NOMBRE_COMPLETO}</h1>
                <Button onClick={onBack} variant="secondary">Volver a la lista</Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna Izquierda */}
                <div className="lg:col-span-1 space-y-6">
                     <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-700">Información General</h2>
                            <div className="space-y-3">
                                <DetailItem label="Puesto" value={employee.PUESTO} />
                                <DetailItem label="Empresa" value={employee.EMPRESA} />
                                <DetailItem label="Fecha de Ingreso" value={employee.FECHA_INGRESO ? format(new Date(employee.FECHA_INGRESO), 'd MMMM, yyyy', { locale: es }) : 'N/A'} />
                                <DetailItem label="Estatus" value={<span className={`px-2 py-1 text-xs font-semibold rounded-full ${employee.ACTIVO ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{employee.ACTIVO ? 'Activo' : 'Inactivo'}</span>} />
                            </div>
                        </div>
                    </Card>
                     <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-700">Información Salarial</h2>
                            <div className="space-y-3">
                                <DetailItem label="Salario Base Mensual" value={employee.BASE_MENSUAL.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} />
                                <DetailItem label="Bonos Mensuales" value={employee.BONOS_MENSUAL.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} />
                                <DetailItem label="Salario Total Mensual" value={<span className="font-bold text-lg text-green-600">{totalSalary.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>} />
                                 <DetailItem label="Tipo de Pago" value={employee.TIPO_PAGO === 'B' ? 'Banco' : employee.TIPO_PAGO === 'S' ? 'Seguro' : 'Efectivo'} />
                            </div>
                        </div>
                    </Card>
                     <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-700">Detalles del Contrato</h2>
                            {employee.contrato ? (
                                <div className="space-y-3">
                                    <DetailItem label="Tipo de Contrato" value={employee.contrato.TIPO_CONTRATO} />
                                    <DetailItem label="Fecha de Vencimiento" value={employee.contrato.FECHA_VENCIMIENTO ? format(new Date(employee.contrato.FECHA_VENCIMIENTO), 'd MMMM, yyyy', { locale: es }) : 'Indefinido'} />
                                </div>
                            ) : <p>No hay datos del contrato.</p>}
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                             <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-700">Saldos de Préstamos</h2>
                             {employee.prestamo ? (
                                <div className="space-y-3">
                                     <DetailItem label="Deuda con Empresa" value={employee.prestamo.SALDO_EMPRESA.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} />
                                     <DetailItem label="Deuda con Paulino" value={employee.prestamo.SALDO_PAULINO.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} />
                                </div>
                             ) : <p>Sin préstamos registrados.</p>}
                        </div>
                    </Card>
                </div>
                {/* Columna Derecha */}
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-700">Historial de Sanciones</h2>
                            <div className="max-h-60 overflow-y-auto">
                               {employee.sanciones && employee.sanciones.length > 0 ? (
                                   <ul className="divide-y dark:divide-gray-700">
                                       {employee.sanciones.map(s => (
                                           <li key={s.SANCION_ID} className="py-2">
                                               <p className="font-semibold">{s.MOTIVO} - <span className="text-red-500">{s.MONTO_APLICADO.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span></p>
                                               <p className="text-sm text-gray-500">{format(new Date(s.FECHA), 'd MMMM, yyyy', { locale: es })} - Sanción #{s.NUMERO_SANCION}</p>
                                           </li>
                                       ))}
                                   </ul>
                               ) : <p>Sin sanciones registradas.</p>}
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-700">Incidencias de Nómina</h2>
                             <div className="max-h-60 overflow-y-auto">
                               {employee.incidenciasNomina && employee.incidenciasNomina.length > 0 ? (
                                   <ul className="divide-y dark:divide-gray-700">
                                       {employee.incidenciasNomina.map(inc => (
                                           <li key={inc.INCIDENCIA_ID} className="py-2 text-sm">
                                               <p className="font-semibold">Periodo: {format(new Date(inc.PERIODO), 'd MMM yyyy', { locale: es })}</p>
                                               {inc.FALTAS_DIAS > 0 && <p>Faltas: <span className="text-red-500">{inc.FALTAS_DIAS}</span></p>}
                                               {inc.PAGO_EXTRA > 0 && <p>Pago Extra: <span className="text-green-500">{inc.PAGO_EXTRA.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span></p>}
                                               {inc.DESCUENTO_PRESTAMO > 0 && <p>Desc. Préstamo: <span className="text-yellow-500">{inc.DESCUENTO_PRESTAMO.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span></p>}
                                               {inc.DESCUENTO_SANCIONES > 0 && <p>Desc. Sanciones: <span className="text-red-500">{inc.DESCUENTO_SANCIONES.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span></p>}
                                           </li>
                                       ))}
                                   </ul>
                               ) : <p>Sin incidencias de nómina registradas.</p>}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;
