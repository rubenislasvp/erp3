

import React, { useState, useEffect } from 'react';
import { Shift, NewShift, Company, Empleado, TurnoStatus } from '../types';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface ShiftFormProps {
  shift?: Shift | null;
  onSave: (shift: Shift | NewShift) => void;
  onCancel: () => void;
}

const ShiftForm: React.FC<ShiftFormProps> = ({ shift, onSave, onCancel }) => {
  const { data: employees } = useQuery<Empleado[]>({
    queryKey: ['employees'],
    queryFn: api.getEmployees,
  });

  const [formData, setFormData] = useState<Omit<Shift, 'id' | 'employeeName'>>({
    EMPLEADO_ID: '',
    quien_cubre_id: null,
    fecha: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_fin: '',
    EMPRESA: Company.ColonialPachuca,
    status: TurnoStatus.APROBADO,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Shift, 'id' | 'employeeName'>, string>>>({});

  useEffect(() => {
    if (shift) {
      const { id, employeeName, ...rest } = shift;
      setFormData(rest);
    } else {
      setFormData({
        EMPLEADO_ID: '',
        quien_cubre_id: null,
        fecha: new Date().toISOString().split('T')[0],
        hora_inicio: '',
        hora_fin: '',
        EMPRESA: Company.ColonialPachuca,
        status: TurnoStatus.APROBADO,
      });
    }
  }, [shift]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validate = (): boolean => {
      const newErrors: Partial<Record<keyof Omit<Shift, 'id' | 'employeeName'>, string>> = {};
      
      if (!formData.EMPLEADO_ID) newErrors.EMPLEADO_ID = "Debe seleccionar un empleado.";
      if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria.";
      if (!formData.hora_inicio) newErrors.hora_inicio = "La hora de entrada es obligatoria.";
      if (!formData.hora_fin) newErrors.hora_fin = "La hora de salida es obligatoria.";
      
      if (formData.hora_inicio && formData.hora_fin && formData.hora_inicio >= formData.hora_fin) {
          newErrors.hora_fin = "La hora de salida debe ser posterior a la de entrada.";
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!validate()) return;
    
    if (shift) {
      onSave({ ...formData, id: shift.id });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Select label="Empleado" name="EMPLEADO_ID" value={formData.EMPLEADO_ID} onChange={handleChange} required>
            <option value="">Seleccione un empleado</option>
            {employees?.map(emp => <option key={emp.EMPLEADO_ID} value={emp.EMPLEADO_ID}>{emp.NOMBRE_COMPLETO}</option>)}
        </Select>
        {errors.EMPLEADO_ID && <p className="text-red-500 text-xs mt-1">{errors.EMPLEADO_ID}</p>}
      </div>
      <div>
        <Input label="Fecha" name="fecha" type="date" value={formData.fecha} onChange={handleChange} required />
        {/* FIX: Corrected property name from 'date' to 'fecha' to match the state and validation logic. */}
        {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
            <Input label="Hora de Entrada" name="hora_inicio" type="time" value={formData.hora_inicio} onChange={handleChange} required />
            {errors.hora_inicio && <p className="text-red-500 text-xs mt-1">{errors.hora_inicio}</p>}
        </div>
        <div>
            <Input label="Hora de Salida" name="hora_fin" type="time" value={formData.hora_fin} onChange={handleChange} required />
            {errors.hora_fin && <p className="text-red-500 text-xs mt-1">{errors.hora_fin}</p>}
        </div>
      </div>
      <Select label="Empresa" name="EMPRESA" value={formData.EMPRESA} onChange={handleChange} required>
          {Object.values(Company).map(c => <option key={c} value={c}>{c}</option>)}
      </Select>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default ShiftForm;