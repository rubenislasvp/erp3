import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isToday, parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale/es';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FullPageSpinner, Spinner } from '../components/ui/Spinner';
import { api } from '../services/api';
import { useAuth } from './hooks/useAuth';
import { Asistencia as AsistenciaType, Empleado } from '../types';
import { CheckCircleIcon, ExclamationIcon } from '../components/Icons';

const Asistencia: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: attendanceRecords, isLoading: loadingAttendance } = useQuery<AsistenciaType[]>({
    queryKey: ['attendance'],
    queryFn: api.getAttendanceRecords,
  });
  
  const { data: employees, isLoading: loadingEmployees } = useQuery<Empleado[]>({
      queryKey: ['employees'],
      queryFn: api.getEmployees
  });

  const addRecordMutation = useMutation({
    mutationFn: ({ employeeId, type }: { employeeId: string, type: 'check-in' | 'check-out' }) => 
      api.addAttendanceRecord(employeeId, type),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      const message = data.type === 'check-in' ? 'Entrada registrada exitosamente.' : 'Salida registrada exitosamente.';
      setNotification({ type: 'success', message });
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (error) => {
      setNotification({ type: 'error', message: `Error al registrar: ${(error as Error).message}` });
      setTimeout(() => setNotification(null), 3000);
    },
  });

  const lastUserRecord = useMemo(() => {
    if (!attendanceRecords || !user?.EMPLEADO_ID) return null;
    return attendanceRecords
      .filter(r => r.EMPLEADO_ID === user.EMPLEADO_ID)
      .sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime())[0] || null;
  }, [attendanceRecords, user]);
  
  const todaysRecords = useMemo(() => {
      if (!attendanceRecords || !employees) return [];
      const employeeMap = new Map(employees.map(e => [e.EMPLEADO_ID, e.NOMBRE_COMPLETO]));
      return attendanceRecords
          .filter(r => isToday(parseISO(r.timestamp)))
          .map(r => ({
              ...r,
              employeeName: employeeMap.get(r.EMPLEADO_ID) || r.EMPLEADO_ID,
          }))
          .sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
  }, [attendanceRecords, employees]);

  const canCheckIn = !lastUserRecord || lastUserRecord.type === 'check-out';
  const canCheckOut = lastUserRecord && lastUserRecord.type === 'check-in';

  const handleRecord = (type: 'check-in' | 'check-out') => {
    if (!user?.EMPLEADO_ID) return;
    addRecordMutation.mutate({ employeeId: user.EMPLEADO_ID, type });
  };
  
  const isLoading = loadingAttendance || loadingEmployees;

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Registro de Asistencia</h1>
      </div>

      {notification && (
        <div className={`p-4 mb-4 rounded-md flex items-center ${notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
          {notification.type === 'success' ? <CheckCircleIcon /> : <ExclamationIcon />}
          <span className="ml-2">{notification.message}</span>
        </div>
      )}

      <Card className="mb-6 p-6 text-center">
        <div className="clock mb-4">
          <p className="text-5xl font-bold">{format(currentTime, 'HH:mm:ss')}</p>
          <p className="text-lg text-gray-500 capitalize">{format(currentTime, 'eeee, d \'de\' MMMM \'de\' yyyy', { locale: es })}</p>
        </div>
        <div className="actions space-x-4">
          <Button size="lg" onClick={() => handleRecord('check-in')} disabled={!canCheckIn || addRecordMutation.isPending}>
            {addRecordMutation.isPending && addRecordMutation.variables?.type === 'check-in' ? <Spinner /> : 'Registrar Entrada'}
          </Button>
          <Button size="lg" variant="secondary" onClick={() => handleRecord('check-out')} disabled={!canCheckOut || addRecordMutation.isPending}>
            {addRecordMutation.isPending && addRecordMutation.variables?.type === 'check-out' ? <Spinner /> : 'Registrar Salida'}
          </Button>
        </div>
      </Card>
      
      <Card>
        <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold">Registros de Hoy</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="p-4 font-semibold">Empleado</th>
                <th className="p-4 font-semibold">Hora de Registro</th>
                <th className="p-4 font-semibold">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {todaysRecords.length > 0 ? todaysRecords.map(record => (
                <tr key={record.id} className="border-b dark:border-gray-700">
                  <td className="p-4 font-medium">{record.employeeName}</td>
                  <td className="p-4">{format(parseISO(record.timestamp), 'HH:mm:ss')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      record.type === 'check-in' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                    }`}>
                      {record.type === 'check-in' ? 'Entrada' : 'Salida'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={3} className="text-center p-8 text-gray-500">No hay registros de asistencia para hoy.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Asistencia;