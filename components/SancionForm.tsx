

import React, { useState, useEffect } from 'react';
import { Sancion, NewSancion, Empleado } from '../types';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface SancionFormProps {
  sancion?: Sancion | null;
  onSave: (sancion: Sancion | NewSancion) => void;
  onCancel: () => void;
}

const SancionForm: React.FC<SancionFormProps> = ({ sancion, onSave, onCancel }) => {
  const { data: employees } = useQuery<Empleado[]>({
    queryKey: ['employees'],
    queryFn: api.getEmployees,
  });

  const [formData, setFormData] = useState<NewSancion>({
    FECHA: new Date().toISOString().split('T')[0],
    EMPLEADO_ID: '',
    MOTIVO: '',
    NUMERO_SANCION: 1,
    MONTO_APLICADO: 0,
  });

  useEffect(() => {
    if (sancion) {
        const { SANCION_ID, ...rest } = sancion;
        setFormData(rest);
    }
  }, [sancion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.EMPLEADO_ID || !formData.MOTIVO) {
        alert("Por favor complete todos los campos obligatorios.");
        return;
    }
    
    if (sancion) {
      onSave({ ...formData, SANCION_ID: sancion.SANCION_ID });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Select label="Empleado" name="EMPLEADO_ID" value={formData.EMPLEADO_ID} onChange={handleChange} required>
                    <option value="">Seleccione un empleado</option>
                    {employees?.map(emp => <option key={emp.EMPLEADO_ID} value={emp.EMPLEADO_ID}>{emp.NOMBRE_COMPLETO}</option>)}
                </Select>
            </div>
             <div>
                <Input label="Fecha" name="FECHA" type="date" value={formData.FECHA} onChange={handleChange} required />
            </div>
        </div>
        <div>
            <Input label="Motivo" name="MOTIVO" value={formData.MOTIVO || ''} onChange={handleChange} required />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Número de Sanción" name="NUMERO_SANCION" type="number" min="1" value={formData.NUMERO_SANCION} onChange={handleChange} required />
            <Input label="Monto Aplicado" name="MONTO_APLICADO" type="number" min="0" step="0.01" value={formData.MONTO_APLICADO} onChange={handleChange} required />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
        </div>
    </form>
  );
};

export default SancionForm;
