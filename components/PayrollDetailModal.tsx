
import React from 'react';
import { PayrollRun } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface PayrollDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payrollRun: PayrollRun | null;
}

const PayrollDetailModal: React.FC<PayrollDetailModalProps> = ({ isOpen, onClose, payrollRun }) => {
  if (!payrollRun) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalles de Nómina (${payrollRun.id})`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="p-4 font-semibold">Empleado</th>
              <th className="p-4 font-semibold">Neto a Pagar</th>
              <th className="p-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {payrollRun.details.map(detail => (
              <tr key={detail.id} className="border-b dark:border-gray-700">
                <td className="p-4">{detail.NOMBRE_COMPLETO}</td>
                <td className="p-4">{detail.netPay.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                <td className="p-4">
                  <Button size="sm" variant="secondary">Ver Recibo</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <div className="flex justify-end pt-4">
          <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      </div>
    </Modal>
  );
};

export default PayrollDetailModal;
