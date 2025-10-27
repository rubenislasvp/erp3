

import React, { useState, useEffect } from 'react';
import { InventarioItem, NewInventarioItem } from '../types';
import Input from './ui/Input';
import Button from './ui/Button';

interface InventoryFormProps {
  item?: InventarioItem | null;
  onSave: (item: InventarioItem | NewInventarioItem) => void;
  onCancel: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState<NewInventarioItem>({
    categoria: '',
    producto: '',
    cantidad: 0,
    unidad: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof NewInventarioItem, string>>>({});

  useEffect(() => {
    if (item) {
      setFormData({
          ...item,
          fecha_ingreso: new Date(item.fecha_ingreso).toISOString().split('T')[0]
      });
    } else {
        setFormData({
            categoria: '',
            producto: '',
            cantidad: 0,
            unidad: '',
            fecha_ingreso: new Date().toISOString().split('T')[0],
        });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };
  
  const validate = (): boolean => {
      const newErrors: Partial<Record<keyof typeof formData, string>> = {};
      
      if (!formData.producto?.trim()) newErrors.producto = "El nombre del producto es obligatorio.";
      if (formData.cantidad < 0) newErrors.cantidad = "La cantidad no puede ser negativa.";
      if (!formData.unidad?.trim()) newErrors.unidad = "La unidad es obligatoria.";
      if (!formData.categoria?.trim()) newErrors.categoria = "La categoría es obligatoria.";
      if (!formData.fecha_ingreso) newErrors.fecha_ingreso = "La fecha es obligatoria.";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!validate()) return;
    
    if (item) {
      onSave({ ...formData, id: item.id });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
            <Input label="Producto" name="producto" value={formData.producto || ''} onChange={handleChange} required />
            {errors.producto && <p className="text-red-500 text-xs mt-1">{errors.producto}</p>}
        </div>
         <div>
            <Input label="Categoría" name="categoria" value={formData.categoria || ''} onChange={handleChange} required />
            {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
            <Input label="Cantidad" name="cantidad" type="number" min="0" step="any" value={formData.cantidad} onChange={handleChange} required />
            {errors.cantidad && <p className="text-red-500 text-xs mt-1">{errors.cantidad}</p>}
        </div>
        <div>
            <Input label="Unidad (kg, pz, lt)" name="unidad" value={formData.unidad || ''} onChange={handleChange} required />
            {errors.unidad && <p className="text-red-500 text-xs mt-1">{errors.unidad}</p>}
        </div>
      </div>
      <div>
        <Input label="Fecha de Ingreso" name="fecha_ingreso" type="date" value={formData.fecha_ingreso} onChange={handleChange} required />
        {errors.fecha_ingreso && <p className="text-red-500 text-xs mt-1">{errors.fecha_ingreso}</p>}
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default InventoryForm;
