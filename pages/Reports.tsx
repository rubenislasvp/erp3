

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';
import { Empleado, IncidenciaNomina, Sancion } from '../types';

type ReportType = '' | 'resumen_empleados' | 'resumen_nomina';

const Reports: React.FC = () => {
    const [reportType, setReportType] = useState<ReportType>('');
    const [generatedReport, setGeneratedReport] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { data: empleados } = useQuery<Empleado[]>({ queryKey: ['employees'], queryFn: api.getEmployees });
    const { data: sanciones } = useQuery<Sancion[]>({ queryKey: ['sanciones'], queryFn: api.getSanciones });
    const { data: incidenciasNomina } = useQuery<IncidenciaNomina[]>({ queryKey: ['incidenciasNomina'], queryFn: api.getIncidenciasNomina });

    const reportData = useMemo(() => {
        if (!empleados || !sanciones || !incidenciasNomina) return {};
        
        const resumenEmpleados = {
            title: 'Resumen de Empleados',
            columns: ['Nombre', 'Puesto', 'Total Sanciones', 'Total Incidencias Nómina'],
            rows: empleados.map(emp => [
                emp.NOMBRE_COMPLETO,
                emp.PUESTO,
                sanciones.filter(s => s.EMPLEADO_ID === emp.EMPLEADO_ID).length,
                incidenciasNomina.filter(i => i.EMPLEADO_ID === emp.EMPLEADO_ID).length,
            ]),
        };

        const resumenNomina = {
            title: 'Resumen de Incidencias de Nómina',
            columns: ['Empleado', 'Periodo', 'Faltas', 'Pago Extra', 'Descuento Total'],
            rows: incidenciasNomina.map(inc => {
                const emp = empleados.find(e => e.EMPLEADO_ID === inc.EMPLEADO_ID);
                const totalDescuento = inc.DESCUENTO_INVENTARIO + inc.DESCUENTO_PRESTAMO + inc.DESCUENTO_SANCIONES;
                return [
                    emp?.NOMBRE_COMPLETO || `ID ${inc.EMPLEADO_ID}`,
                    new Date(inc.PERIODO).toLocaleDateString(),
                    inc.FALTAS_DIAS,
                    inc.PAGO_EXTRA.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
                    totalDescuento.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
                ];
            }),
        };

        return {
            resumen_empleados: resumenEmpleados,
            resumen_nomina: resumenNomina,
        }
    }, [empleados, sanciones, incidenciasNomina]);

    const handleGenerateReport = () => {
        if (!reportType) {
            alert('Por favor, seleccione un tipo de reporte.');
            return;
        }
        setIsLoading(true);
        setGeneratedReport(null);

        setTimeout(() => {
            setGeneratedReport(reportData[reportType]);
            setIsLoading(false);
        }, 500);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Generador de Reportes</h1>
            
            <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-3">
                        <Select label="Tipo de Reporte" value={reportType} onChange={e => setReportType(e.target.value as ReportType)}>
                            <option value="">Seleccione...</option>
                            <option value="resumen_empleados">Resumen de Empleados</option>
                            <option value="resumen_nomina">Resumen de Incidencias de Nómina</option>
                        </Select>
                    </div>
                    <Button onClick={handleGenerateReport} disabled={isLoading}>
                        {isLoading ? <Spinner /> : 'Generar Reporte'}
                    </Button>
                </div>
            </Card>

            {generatedReport && (
                 <Card className="mt-6">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">{generatedReport.title}</h2>
                        <div className="overflow-x-auto">
                             <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        {generatedReport.columns.map((col: string) => <th key={col} className="p-4 font-semibold">{col}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {generatedReport.rows.map((row: any[], rowIndex: number) => (
                                        <tr key={rowIndex} className="border-b dark:border-gray-700">
                                            {row.map((cell: any, cellIndex: number) => <td key={cellIndex} className="p-4">{cell}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Reports;
