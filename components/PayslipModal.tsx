
import React from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PayslipModal: React.FC<PayslipModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recibo de Pago">
      <div className="payslip">
        <p>Detalles del recibo de pago...</p>
      </div>
      <div className="flex justify-end pt-4">
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      </div>
    </Modal>
  );
};

export default PayslipModal;
