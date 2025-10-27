
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { PayrollRun } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FullPageSpinner } from '../components/ui/Spinner';

const Payroll: React.FC = () => {
  const { data: payrollRuns, isLoading } = useQuery<PayrollRun[] | null>({
    queryKey: ['payrollRuns'],
    queryFn: async () => {
      const periods = await api.getPayrollPeriods();
      // For this mock, we just fetch one run. A real app might fetch all recent runs.
      if (periods.length > 0) {
        const run = await api.getPayrollRun(periods[0].id);
        return run ? [run] : [];
      }
      return [];
    },
  });

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Nómina</h1>
        <Button>Generar Nueva Nómina</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="p-4 font-semibold">Periodo</th>
                <th className="p-4 font-semibold">Fechas</th>
                <th className="p-4 font-semibold">Empresa</th>
                <th className="p-4 font-semibold">Costo Total</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {payrollRuns?.map(run => (
                <tr key={run.id} className="border-b dark:border-gray-700">
                  <td className="p-4">{run.id}</td>
                  <td className="p-4">{new Date(run.startDate).toLocaleDateString()} - {new Date(run.endDate).toLocaleDateString()}</td>
                  <td className="p-4">{run.EMPRESA}</td>
                  <td className="p-4">{run.totalCost.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                  <td className="p-4"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Completado</span></td>
                  <td className="p-4">
                    <Button variant="secondary" size="sm">Ver Detalles</Button>
                  </td>
                </tr>
              ))}
               {!payrollRuns?.length && (
                <tr>
                    <td colSpan={6} className="text-center p-4">No hay corridas de nómina disponibles.</td>
                </tr>
               )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Payroll;
