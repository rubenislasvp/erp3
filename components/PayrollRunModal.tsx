
import React from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { Company } from '../types';

interface PayrollRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: { startDate: string, endDate: string, company: Company }) => void;
}

const PayrollRunModal: React.FC<PayrollRunModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      company: formData.get('company') as Company,
    };
    onGenerate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generar Corrida de Nómina">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Fecha de Inicio" name="startDate" type="date" required />
        <Input label="Fecha de Fin" name="endDate" type="date" required />
        <Select label="Empresa" name="company" required>
          {Object.values(Company).map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Generar</Button>
        </div>
      </form>
    </Modal>
  );
};

export default PayrollRunModal;
