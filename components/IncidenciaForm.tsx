

import React, { useState, useEffect } from 'react';
import { Incidencia, NewIncidencia, Empleado } from '../types';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface IncidenciaFormProps {
  incidencia?: Incidencia | null;
  onSave: (incidencia: Incidencia | NewIncidencia) => void;
  onCancel: () => void;
}

const IncidenciaForm: React.FC<IncidenciaFormProps> = ({ incidencia, onSave, onCancel }) => {
  const { data: employees } = useQuery<Empleado[]>({
    queryKey: ['employees'],
    queryFn: api.getEmployees,
  });

  const [formData, setFormData] = useState<NewIncidencia>({
    fecha: new Date().toISOString().split('T')[0],
    EMPLEADO_ID: '',
    descripcion: '',
    observacion: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof NewIncidencia, string>>>({});

  useEffect(() => {
    if (incidencia) {
        const { empleado_nombre, id, ...rest } = incidencia;
        setFormData(rest);
    } else {
        setFormData({
            fecha: new Date().toISOString().split('T')[0],
            EMPLEADO_ID: '',
            descripcion: '',
            observacion: '',
        });
    }
  }, [incidencia]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validate = (): boolean => {
      const newErrors: Partial<Record<keyof NewIncidencia, string>> = {};
      
      if (!formData.EMPLEADO_ID) newErrors.EMPLEADO_ID = "Debe seleccionar un empleado.";
      if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria.";
      if (!formData.descripcion?.trim()) newErrors.descripcion = "La descripción es obligatoria.";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    if (incidencia) {
      onSave({ ...formData, id: incidencia.id });
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
                {errors.EMPLEADO_ID && <p className="text-red-500 text-xs mt-1">{errors.EMPLEADO_ID}</p>}
            </div>
             <div>
                <Input label="Fecha" name="fecha" type="date" value={formData.fecha} onChange={handleChange} required />
                {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
            </div>
        </div>
        <div>
            <Input label="Descripción Corta (e.g., RETARDO, PERMISO)" name="descripcion" value={formData.descripcion || ''} onChange={handleChange} required />
            {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
        </div>
      <div>
        <label htmlFor="observacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
        <textarea id="observacion" name="observacion" value={formData.observacion || ''} onChange={handleChange} rows={3} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default IncidenciaForm;
