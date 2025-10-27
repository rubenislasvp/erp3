
export type Role = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  EMPLEADO_ID?: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export enum Company {
  CafeteriaUPT = 'CafeteriaUPT',
  ColonialPachuca = 'ColonialPachuca',
  Genisa = 'Genisa',
}

export enum PaymentType {
  B = 'B', // Banco
  S = 'S', // Seguro
  E = 'E', // Efectivo
}

export interface Empleado {
  EMPLEADO_ID: string;
  NOMBRE_COMPLETO: string;
  NOMBRE_CORTO: string;
  PUESTO: string;
  EMPRESA: Company;
  TIPO_PAGO: PaymentType;
  FECHA_INGRESO: string;
  FECHA_ALTA_IMSS: string | null;
  BASE_MENSUAL: number;
  BONOS_MENSUAL: number;
  ACTIVO: boolean;
  role: Role;
}

export type NewEmpleado = Omit<Empleado, 'EMPLEADO_ID'>;

export interface IncidenciaNomina {
  INCIDENCIA_ID: number;
  EMPLEADO_ID: string;
  PERIODO: string;
  FALTAS_DIAS: number;
  PAGO_EXTRA: number;
  DESCUENTO_PRESTAMO: number;
  DESCUENTO_SANCIONES: number;
  DESCUENTO_INVENTARIO: number;
}

export interface Sancion {
  SANCION_ID: number;
  EMPLEADO_ID: string;
  FECHA: string;
  MOTIVO: string;
  NUMERO_SANCION: number;
  MONTO_APLICADO: number;
}

export type NewSancion = Omit<Sancion, 'SANCION_ID'>;

export interface Contrato {
  CONTRATO_ID: number;
  EMPLEADO_ID: string;
  TIPO_CONTRATO: string;
  FECHA_VENCIMIENTO: string | null;
}

export interface Prestamo {
  PRESTAMO_ID: number;
  EMPLEADO_ID: string;
  SALDO_EMPRESA: number;
  SALDO_PAULINO: number;
}

export type NewPrestamo = Omit<Prestamo, 'PRESTAMO_ID'>;

export interface EmpleadoDetails extends Empleado {
  contrato: Contrato | null;
  prestamo: Prestamo | null;
  sanciones: Sancion[];
  incidenciasNomina: IncidenciaNomina[];
}

export interface InventarioItem {
  id: number;
  categoria: string;
  producto: string;
  cantidad: number;
  unidad: string;
  fecha_ingreso: string;
  costPerUnit?: number;
}

export type NewInventarioItem = Omit<InventarioItem, 'id'>;

export interface Asistencia {
  id: number;
  EMPLEADO_ID: string;
  timestamp: string;
  type: string; // 'check-in' or 'check-out'
}

export enum TurnoStatus {
    PENDIENTE = 'PENDIENTE',
    APROBADO = 'APROBADO',
    RECHAZADO = 'RECHAZADO'
}

// Renamed from Turno for consistency
export interface Shift {
  id: string;
  EMPLEADO_ID: string;
  employeeName?: string; // For UI purposes
  quien_cubre_id: string | null;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  EMPRESA: Company;
  status: TurnoStatus;
}

export type NewShift = Omit<Shift, 'id' | 'employeeName'>;


export interface AttendanceImportData {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
}

export interface Cuenta {
  id: number;
  nombre: string;
  tipo: string; // INGRESO, EGRESO, CUENTA CORRIENTE
  saldo: number;
}

export enum ProductType {
  Platillo = 'Platillo',
  Bebida = 'Bebida',
  Postre = 'Postre',
  Otro = 'Otro',
}

export interface RecipeItem {
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  type: ProductType;
  recipe: RecipeItem[];
  company: Company;
}

export type NewProduct = Omit<Product, 'id'>;

export interface Puesto {
  id: string;
  name: string;
  baseSalary: number;
}

export type NewPuesto = Omit<Puesto, 'id'>;

export interface PayrollRunDetail {
  id: string;
  payrollRunId: string;
  EMPLEADO_ID: string;
  NOMBRE_COMPLETO: string;
  baseSalary: number;
  bonuses: number;
  extraPayments: number;
  loanDeductions: number;
  sanctionDeductions: number;
  absenceDeductions: number;
  totalDeductions: number;
  netPay: number;
}

export interface PayrollRun {
  id: string;
  startDate: string;
  endDate: string;
  EMPRESA: Company;
  details: PayrollRunDetail[];
  totalCost: number;
  runDate: string;
}
export interface PayrollPeriod {
    id: string;
    startDate: string;
    endDate: string;
}


export interface PrestamoHistorial {
  MOVIMIENTO_ID: number;
  EMPLEADO_ID: string;
  FECHA: string;
  MONTO: number;
  TIPO_MOVIMIENTO: string; // 'ABONO' or 'CARGO'
  OBSERVACIONES: string;
}

export interface Incidencia {
    id: number;
    EMPLEADO_ID: string;
    empleado_nombre?: string; // for UI
    fecha: string;
    descripcion: string;
    observacion: string;
}

export type NewIncidencia = Omit<Incidencia, 'id' | 'empleado_nombre'>;
