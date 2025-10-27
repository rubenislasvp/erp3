import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

import Modal from './ui/Modal';
import Button from './ui/Button';
import { Prestamo, PrestamoHistorial } from '../types';
import { api } from '../services/api';
import { Spinner } from './ui/Spinner';

interface LoanStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  prestamo: (Prestamo & { employeeName: string; total: number; }) | null;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className = '' }) => (
    <div className={`p-2 rounded-lg ${className}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-lg">{value || 'N/A'}</p>
    </div>
);


const LoanStatementModal: React.FC<LoanStatementModalProps> = ({ isOpen, onClose, prestamo }) => {
    const { data: history, isLoading } = useQuery<PrestamoHistorial[]>({
        queryKey: ['prestamoHistorial', prestamo?.EMPLEADO_ID],
        queryFn: () => api.getPrestamoHistorialByEmployeeId(prestamo!.EMPLEADO_ID),
        enabled: !!prestamo,
    });
  
    if (!prestamo) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Estado de Cuenta: ${prestamo.employeeName}`}>
      <div className="space-y-6">
        {/* Balances Section */}
        <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Saldos Actuales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <DetailItem 
                    label="Deuda Empresa" 
                    value={prestamo.SALDO_EMPRESA.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                    className="bg-blue-50 dark:bg-blue-900/20"
                />
                 <DetailItem 
                    label="Deuda Paulino" 
                    value={prestamo.SALDO_PAULINO.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                    className="bg-yellow-50 dark:bg-yellow-900/20"
                />
                <DetailItem 
                    label="Deuda Total" 
                    value={prestamo.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                    className="bg-green-50 dark:bg-green-900/20 font-bold"
                />
            </div>
        </div>
        
        {/* History Section */}
        <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Historial de Movimientos</h3>
            <div className="max-h-64 overflow-y-auto border rounded-lg dark:border-gray-700">
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <Spinner />
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                            <tr>
                                <th className="p-3 font-semibold text-sm">Fecha</th>
                                <th className="p-3 font-semibold text-sm">Tipo</th>
                                <th className="p-3 font-semibold text-sm">Observaciones</th>
                                <th className="p-3 font-semibold text-sm text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history?.length ? history.map(h => (
                                <tr key={h.MOVIMIENTO_ID} className="border-b dark:border-gray-700 last:border-b-0">
                                    <td className="p-3 text-sm">{format(new Date(h.FECHA), 'dd MMM yyyy', { locale: es })}</td>
                                    <td className="p-3 text-sm">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                            h.TIPO_MOVIMIENTO === 'CARGO' 
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' 
                                            : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                        }`}>
                                            {h.TIPO_MOVIMIENTO}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{h.OBSERVACIONES}</td>
                                    <td className={`p-3 text-sm text-right font-semibold ${h.TIPO_MOVIMIENTO === 'CARGO' ? 'text-red-600' : 'text-green-600'}`}>
                                        {h.MONTO.toLocaleString('es-MX', { style: 'currency', currency: 'MXN'})}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-8 text-gray-500">No hay historial de movimientos.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
      </div>
       <div className="flex justify-end pt-6">
          <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      </div>
    </Modal>
  );
};

export default LoanStatementModal;