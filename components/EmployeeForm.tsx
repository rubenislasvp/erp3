
import React, { useState, useEffect } from 'react';
import { Empleado, NewEmpleado, Company, PaymentType, Role } from '../types';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

interface EmployeeFormProps {
  employee?: Empleado | null;
  onSave: (employee: Empleado | NewEmpleado) => void;
  onCancel: () => void;
}

const paymentTypeLabels: Record<PaymentType, string> = {
    [PaymentType.B]: 'Banco',
    [PaymentType.S]: 'Seguro',
    [PaymentType.E]: 'Efectivo',
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState<NewEmpleado>({
    NOMBRE_COMPLETO: '',
    NOMBRE_CORTO: '',
    PUESTO: '',
    EMPRESA: Company.CafeteriaUPT,
    TIPO_PAGO: PaymentType.B,
    FECHA_INGRESO: new Date().toISOString().split('T')[0],
    FECHA_ALTA_IMSS: null,
    BASE_MENSUAL: 0,
    BONOS_MENSUAL: 0,
    ACTIVO: true,
    role: 'employee'
  });
  const [errors, setErrors] = useState<Partial<Record<keyof NewEmpleado, string>>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        FECHA_INGRESO: employee.FECHA_INGRESO ? new Date(employee.FECHA_INGRESO).toISOString().split('T')[0] : '',
        FECHA_ALTA_IMSS: employee.FECHA_ALTA_IMSS ? new Date(employee.FECHA_ALTA_IMSS).toISOString().split('T')[0] : null,
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
     if (name === 'ACTIVO') {
      setFormData(prev => ({ ...prev, ACTIVO: value === 'true' }));
    } else {
        setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    }
    // Clear error when user starts typing
    if(errors[name as keyof NewEmpleado]) {
        setErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NewEmpleado, string>> = {};
    if (!formData.NOMBRE_COMPLETO.trim()) newErrors.NOMBRE_COMPLETO = 'El nombre completo es obligatorio.';
    if (!formData.PUESTO.trim()) newErrors.PUESTO = 'El puesto es obligatorio.';
    if (formData.BASE_MENSUAL < 5000) newErrors.BASE_MENSUAL = 'El salario base debe ser de al menos $5,000 MXN.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const dataToSave = {
        ...formData,
        FECHA_ALTA_IMSS: formData.FECHA_ALTA_IMSS || null
    };

    if (employee) {
      onSave({ ...dataToSave, EMPLEADO_ID: employee.EMPLEADO_ID });
    } else {
      onSave(dataToSave);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre Completo" name="NOMBRE_COMPLETO" value={formData.NOMBRE_COMPLETO} onChange={handleChange} required />
      {errors.NOMBRE_COMPLETO && <p className="text-red-500 text-xs mt-1">{errors.NOMBRE_COMPLETO}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nombre Corto" name="NOMBRE_CORTO" value={formData.NOMBRE_CORTO} onChange={handleChange} />
        <Input label="Puesto" name="PUESTO" value={formData.PUESTO} onChange={handleChange} required />
        {errors.PUESTO && <p className="text-red-500 text-xs mt-1">{errors.PUESTO}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="Empresa" name="EMPRESA" value={formData.EMPRESA} onChange={handleChange}>
            {Object.values(Company).map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select label="Tipo de Pago" name="TIPO_PAGO" value={formData.TIPO_PAGO} onChange={handleChange}>
            {Object.values(PaymentType).map((value) => <option key={value} value={value}>{paymentTypeLabels[value]}</option>)}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Fecha de Ingreso" name="FECHA_INGRESO" type="date" value={formData.FECHA_INGRESO || ''} onChange={handleChange} required />
        <Input label="Fecha Alta IMSS" name="FECHA_ALTA_IMSS" type="date" value={formData.FECHA_ALTA_IMSS || ''} onChange={handleChange} />
      </div>
      
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Base Mensual" name="BASE_MENSUAL" type="number" min="0" step="100" value={formData.BASE_MENSUAL} onChange={handleChange} required />
        <Input label="Bonos Mensual" name="BONOS_MENSUAL" type="number" min="0" step="100" value={formData.BONOS_MENSUAL} onChange={handleChange} />
        {errors.BASE_MENSUAL && <p className="text-red-500 text-xs mt-1">{errors.BASE_MENSUAL}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="Estatus" name="ACTIVO" value={String(formData.ACTIVO)} onChange={handleChange}>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </Select>
         <Select label="Rol de Sistema" name="role" value={formData.role} onChange={handleChange}>
          <option value="employee">Empleado</option>
          <option value="manager">Gerente</option>
          <option value="admin">Admin</option>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
