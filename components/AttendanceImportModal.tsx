

import React, { useState } from 'react';
import { AttendanceImportData } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { Spinner } from './ui/Spinner';

interface AttendanceImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: AttendanceImportData[]) => void;
  isImporting: boolean;
}

const AttendanceImportModal: React.FC<AttendanceImportModalProps> = ({ isOpen, onClose, onImport, isImporting }) => {
  const [csvData, setCsvData] = useState('');
  const [error, setError] = useState<string | null>(null);


  const handleImportClick = () => {
    setError(null);
    const lines = csvData.trim().split('\n');
    const header = lines.shift()?.toLowerCase();
    if (!header || !header.includes('employeeid') || !header.includes('date') || !header.includes('checkin') || !header.includes('checkout')) {
      setError("El encabezado del CSV es inválido. Debe contener 'employeeId,date,checkIn,checkOut'.");
      return;
    }

    const data: AttendanceImportData[] = [];
    const errors: string[] = [];
    
    lines.forEach((line, index) => {
        if (!line.trim()) return;
        const values = line.split(',');
        if (values.length !== 4) {
            errors.push(`Línea ${index + 1}: No tiene 4 columnas.`);
            return;
        }

        const [employeeId, date, checkIn, checkOut] = values.map(v => v.trim());

        if (!employeeId || !date || !checkIn || !checkOut) {
            errors.push(`Línea ${index + 1}: Contiene valores vacíos.`);
            return;
        }
        if (isNaN(Date.parse(date))) {
            errors.push(`Línea ${index + 1}: Formato de fecha inválido ('${date}'). Use YYYY-MM-DD.`);
            return;
        }
         if (!/^\d{2}:\d{2}(:\d{2})?$/.test(checkIn) || !/^\d{2}:\d{2}(:\d{2})?$/.test(checkOut)) {
            errors.push(`Línea ${index + 1}: Formato de hora inválido. Use HH:MM.`);
            return;
        }
        if (checkIn >= checkOut) {
            errors.push(`Línea ${index + 1}: La hora de salida debe ser mayor a la de entrada.`);
            return;
        }

        data.push({ employeeId, date, checkIn, checkOut });
    });
    
    if (errors.length > 0) {
        setError(`Se encontraron errores en el CSV:\n- ${errors.join('\n- ')}`);
        return;
    }
    
    if (data.length === 0) {
        setError("No se encontraron datos válidos para importar.");
        return;
    }

    onImport(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Importar Asistencia desde CSV">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Pega el contenido del archivo CSV aquí. El formato debe ser: <br />
          <code>employeeId,date,checkIn,checkOut</code>
        </p>
        <textarea
          className="w-full h-48 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
          value={csvData}
          onChange={(e) => setCsvData(e.target.value)}
          placeholder={`employeeId,date,checkIn,checkOut
1,2023-10-26,09:00,18:00
2,2023-10-26,09:05,18:02`}
        />
        {error && (
          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded">
            <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">{error}</p>
          </div>
        )}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isImporting}>Cancelar</Button>
          <Button onClick={handleImportClick} disabled={isImporting || !csvData}>
            {isImporting ? <Spinner /> : 'Importar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AttendanceImportModal;
