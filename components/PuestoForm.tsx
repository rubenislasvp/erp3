

import React, { useState, useEffect } from 'react';
import { Puesto, NewPuesto } from '../types';
import Input from './ui/Input';
import Button from './ui/Button';

interface PuestoFormProps {
  puesto?: Puesto | null;
  onSave: (puesto: Puesto | NewPuesto) => void;
  onCancel: () => void;
}

const PuestoForm: React.FC<PuestoFormProps> = ({ puesto, onSave, onCancel }) => {
  const [formData, setFormData] = useState<NewPuesto>({
    name: '',
    baseSalary: 0,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof NewPuesto, string>>>({});

  useEffect(() => {
    if (puesto) {
      setFormData({
        name: puesto.name,
        baseSalary: puesto.baseSalary,
      });
    } else {
      setFormData({
        name: '',
        baseSalary: 0,
      });
    }
  }, [puesto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NewPuesto, string>> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del puesto es obligatorio.';
    }
    if (formData.baseSalary < 0) {
      newErrors.baseSalary = 'El salario base no puede ser negativo.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (puesto) {
      onSave({ ...formData, id: puesto.id });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input label="Nombre del Puesto" name="name" value={formData.name} onChange={handleChange} required />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <Input label="Salario Base Mensual" name="baseSalary" type="number" min="0" step="0.01" value={formData.baseSalary} onChange={handleChange} required />
        {errors.baseSalary && <p className="text-red-500 text-xs mt-1">{errors.baseSalary}</p>}
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default PuestoForm;
