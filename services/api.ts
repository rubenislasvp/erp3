// This file provides a mock API for the application that persists data in localStorage,
// simulating a real backend. All changes made will be saved across browser sessions.
import {
  User, Empleado, NewEmpleado, EmpleadoDetails, Role, Company, PaymentType,
  InventarioItem, NewInventarioItem, Contrato, Sancion, IncidenciaNomina,
  Shift, NewShift, TurnoStatus, AttendanceImportData, Cuenta, Incidencia,
  NewIncidencia, Product, NewProduct, Puesto, NewPuesto, Prestamo, PrestamoHistorial,
  PayrollPeriod, PayrollRun, ProductType, Asistencia
} from '../types';

// Mock Data - Used for initial database seed
const initialDb = {
  users: [
    { id: '1', EMPLEADO_ID: 'EMP001', name: 'Admin User', email: 'admin@genisa.com', role: 'admin' as Role },
    { id: '2', EMPLEADO_ID: 'EMP002', name: 'Manager User', email: 'manager@genisa.com', role: 'manager' as Role },
    { id: '3', EMPLEADO_ID: 'EMP003', name: 'Employee User', email: 'employee@genisa.com', role: 'employee' as Role },
  ],
  employees: [
    { EMPLEADO_ID: 'EMP001', NOMBRE_COMPLETO: 'Admin User', NOMBRE_CORTO: 'Admin', PUESTO: 'System Admin', EMPRESA: Company.Genisa, TIPO_PAGO: PaymentType.B, FECHA_INGRESO: '2020-01-15', FECHA_ALTA_IMSS: '2020-01-15', BASE_MENSUAL: 50000, BONOS_MENSUAL: 5000, ACTIVO: true, role: 'admin' as Role },
    { EMPLEADO_ID: 'EMP002', NOMBRE_COMPLETO: 'Manager User', NOMBRE_CORTO: 'Manager', PUESTO: 'Gerente', EMPRESA: Company.ColonialPachuca, TIPO_PAGO: PaymentType.B, FECHA_INGRESO: '2021-02-20', FECHA_ALTA_IMSS: '2021-02-20', BASE_MENSUAL: 35000, BONOS_MENSUAL: 2500, ACTIVO: true, role: 'manager' as Role },
    { EMPLEADO_ID: 'EMP003', NOMBRE_COMPLETO: 'Employee User', NOMBRE_CORTO: 'Employee', PUESTO: 'Cocinero', EMPRESA: Company.ColonialPachuca, TIPO_PAGO: PaymentType.E, FECHA_INGRESO: '2022-03-10', FECHA_ALTA_IMSS: '2022-03-10', BASE_MENSUAL: 12000, BONOS_MENSUAL: 500, ACTIVO: true, role: 'employee' as Role },
    { EMPLEADO_ID: 'EMP004', NOMBRE_COMPLETO: 'Maria Garcia', NOMBRE_CORTO: 'Maria', PUESTO: 'Mesera', EMPRESA: Company.CafeteriaUPT, TIPO_PAGO: PaymentType.E, FECHA_INGRESO: '2023-01-01', FECHA_ALTA_IMSS: '2023-01-01', BASE_MENSUAL: 8000, BONOS_MENSUAL: 1000, ACTIVO: true, role: 'employee' as Role },
    { EMPLEADO_ID: 'EMP005', NOMBRE_COMPLETO: 'Juan Perez', NOMBRE_CORTO: 'Juan', PUESTO: 'Chef', EMPRESA: Company.ColonialPachuca, TIPO_PAGO: PaymentType.B, FECHA_INGRESO: '2021-05-12', FECHA_ALTA_IMSS: '2021-05-12', BASE_MENSUAL: 20000, BONOS_MENSUAL: 1500, ACTIVO: false, role: 'employee' as Role },
  ],
  contratos: [
      { CONTRATO_ID: 1, EMPLEADO_ID: 'EMP003', TIPO_CONTRATO: 'Determinado', FECHA_VENCIMIENTO: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString() },
      { CONTRATO_ID: 2, EMPLEADO_ID: 'EMP004', TIPO_CONTRATO: 'Indeterminado', FECHA_VENCIMIENTO: null },
  ],
  sanciones: [
      { SANCION_ID: 1, EMPLEADO_ID: 'EMP003', FECHA: '2023-10-15', MOTIVO: 'Llegada tarde', NUMERO_SANCION: 1, MONTO_APLICADO: 50 },
  ],
  incidenciasNomina: [
      { INCIDENCIA_ID: 1, EMPLEADO_ID: 'EMP003', PERIODO: '2023-10-01', FALTAS_DIAS: 1, PAGO_EXTRA: 0, DESCUENTO_PRESTAMO: 100, DESCUENTO_SANCIONES: 50, DESCUENTO_INVENTARIO: 0 },
  ],
  prestamos: [
      { PRESTAMO_ID: 1, EMPLEADO_ID: 'EMP003', SALDO_EMPRESA: 1000, SALDO_PAULINO: 500 }
  ],
  prestamoHistorial: [
    { MOVIMIENTO_ID: 1, EMPLEADO_ID: 'EMP003', FECHA: '2023-09-01', MONTO: 1500, TIPO_MOVIMIENTO: 'CARGO', OBSERVACIONES: 'Préstamo inicial Empresa' },
    { MOVIMIENTO_ID: 2, EMPLEADO_ID: 'EMP003', FECHA: '2023-09-15', MONTO: 250, TIPO_MOVIMIENTO: 'ABONO', OBSERVACIONES: 'Abono quincenal' },
    { MOVIMIENTO_ID: 3, EMPLEADO_ID: 'EMP003', FECHA: '2023-09-30', MONTO: 250, TIPO_MOVIMIENTO: 'ABONO', OBSERVACIONES: 'Abono quincenal' },
    { MOVIMIENTO_ID: 4, EMPLEADO_ID: 'EMP003', FECHA: '2023-10-05', MONTO: 500, TIPO_MOVIMIENTO: 'CARGO', OBSERVACIONES: 'Préstamo Paulino' },
  ] as PrestamoHistorial[],
  // FIX: Explicitly cast the inventory array to InventarioItem[] to ensure the optional 'costPerUnit' property is handled correctly.
  inventory: [
    { id: 1, categoria: 'Lácteos', producto: 'Leche', cantidad: 50, unidad: 'lt', fecha_ingreso: '2023-10-26', costPerUnit: 20 },
    { id: 2, categoria: 'Carnes', producto: 'Pechuga de Pollo', cantidad: 25, unidad: 'kg', fecha_ingreso: '2023-10-25', costPerUnit: 80 },
    { id: 3, categoria: 'Verduras', producto: 'Tomate', cantidad: 100, unidad: 'kg', fecha_ingreso: '2023-10-27', costPerUnit: 15 },
  ] as InventarioItem[],
  // FIX: Explicitly cast the shifts array to Shift[] to ensure the optional 'employeeName' property is handled correctly.
  shifts: [
    { id: '1', EMPLEADO_ID: 'EMP003', employeeName: 'Employee User', fecha: '2023-11-01', hora_inicio: '08:00', hora_fin: '16:00', EMPRESA: Company.ColonialPachuca, status: TurnoStatus.APROBADO, quien_cubre_id: null },
    { id: '2', EMPLEADO_ID: 'EMP004', employeeName: 'Maria Garcia', fecha: '2023-11-01', hora_inicio: '10:00', hora_fin: '18:00', EMPRESA: Company.CafeteriaUPT, status: TurnoStatus.APROBADO, quien_cubre_id: null },
  ] as Shift[],
  cuentas: [
      {id: 1, nombre: 'Ventas Colonial', tipo: 'INGRESO', saldo: 150000},
      {id: 2, nombre: 'Costos Materia Prima', tipo: 'EGRESO', saldo: 60000},
      {id: 3, nombre: 'Caja Chica', tipo: 'CUENTA CORRIENTE', saldo: 5000},
  ],
  incidencias: [
      {id: 1, EMPLEADO_ID: 'EMP003', fecha: '2023-10-20', descripcion: 'Retardo', observacion: '15 minutos tarde'},
  ],
  products: [
      {id: 'PROD01', name: 'Chilaquiles Verdes', description: 'Totopos de maíz bañados en salsa verde.', price: 85, cost: 35, type: ProductType.Platillo, recipe: [], company: Company.ColonialPachuca},
  ],
  puestos: [
      {id: 'P01', name: 'Cocinero', baseSalary: 12000},
      {id: 'P02', name: 'Mesero', baseSalary: 8000},
  ],
  payrollRuns: [
      { id: 'RUN01', startDate: '2023-10-01', endDate: '2023-10-15', EMPRESA: Company.ColonialPachuca, details: [], totalCost: 150000, runDate: '2023-10-16'}
  ],
  asistencia: [] as Asistencia[],
};

type Db = typeof initialDb;

const DB_KEY = 'GENISA_ERP_DB';

const getDb = (): Db => {
  const dbJson = localStorage.getItem(DB_KEY);
  return dbJson ? JSON.parse(dbJson) : initialDb;
};

const saveDb = (db: Db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const initDb = () => {
  if (!localStorage.getItem(DB_KEY)) {
    saveDb(initialDb);
  }
};

// Initialize DB on module load
initDb();

// API implementation
export const api = {
  login: async (email: string, password: string): Promise<{ user: User }> => {
    const db = getDb();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = db.users.find(u => u.email === email && password === 'password'); // Password check is mocked
        if (user) {
          resolve({ user });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },

  getEmployees: async (): Promise<Empleado[]> => Promise.resolve(getDb().employees),

  getEmployeeById: async (id: string): Promise<EmpleadoDetails> => {
    const db = getDb();
    const employee = db.employees.find(e => e.EMPLEADO_ID === id) as EmpleadoDetails;
    if (employee) {
        employee.contrato = db.contratos.find(c => c.EMPLEADO_ID === id) || null;
        employee.sanciones = db.sanciones.filter(s => s.EMPLEADO_ID === id);
        employee.incidenciasNomina = db.incidenciasNomina.filter(i => i.EMPLEADO_ID === id);
        employee.prestamo = db.prestamos.find(p => p.EMPLEADO_ID === id) || null;
    }
    return Promise.resolve(employee);
  },
  
  addEmployee: async (employee: NewEmpleado): Promise<Empleado> => {
      const db = getDb();
      const newEmployee: Empleado = { ...employee, EMPLEADO_ID: `EMP${Date.now()}` };
      db.employees.push(newEmployee);
      saveDb(db);
      return Promise.resolve(newEmployee);
  },

  updateEmployee: async (employee: Empleado): Promise<Empleado> => {
      const db = getDb();
      const index = db.employees.findIndex(e => e.EMPLEADO_ID === employee.EMPLEADO_ID);
      if (index !== -1) {
          db.employees[index] = employee;
          saveDb(db);
      }
      return Promise.resolve(employee);
  },

  getContratos: async (): Promise<Contrato[]> => Promise.resolve(getDb().contratos),
  getSanciones: async (): Promise<Sancion[]> => Promise.resolve(getDb().sanciones),
  getIncidenciasNomina: async (): Promise<IncidenciaNomina[]> => Promise.resolve(getDb().incidenciasNomina),

  getInventory: async (): Promise<InventarioItem[]> => Promise.resolve(getDb().inventory),
  addInventoryItem: async (item: NewInventarioItem): Promise<InventarioItem> => {
      const db = getDb();
      const newItem: InventarioItem = { ...item, id: Date.now() };
      db.inventory.push(newItem);
      saveDb(db);
      return Promise.resolve(newItem);
  },
  updateInventoryItem: async (item: InventarioItem): Promise<InventarioItem> => {
      const db = getDb();
      const index = db.inventory.findIndex(i => i.id === item.id);
      if(index !== -1) db.inventory[index] = item;
      saveDb(db);
      return Promise.resolve(item);
  },
  deleteInventoryItem: async (itemId: number): Promise<{ success: boolean }> => {
      const db = getDb();
      db.inventory = db.inventory.filter(i => i.id !== itemId);
      saveDb(db);
      return Promise.resolve({ success: true });
  },

  getShifts: async (): Promise<Shift[]> => Promise.resolve(getDb().shifts),
  addShift: async (shift: NewShift): Promise<Shift> => {
    const db = getDb();
    const employee = db.employees.find(e => e.EMPLEADO_ID === shift.EMPLEADO_ID);
    const newShift: Shift = { ...shift, id: `S${Date.now()}`, employeeName: employee?.NOMBRE_COMPLETO };
    db.shifts.push(newShift);
    saveDb(db);
    return Promise.resolve(newShift);
  },
  updateShift: async (shift: Shift): Promise<Shift> => {
    const db = getDb();
    const index = db.shifts.findIndex(s => s.id === shift.id);
    if(index !== -1) db.shifts[index] = shift;
    saveDb(db);
    return Promise.resolve(shift);
  },
  deleteShift: async (shiftId: string): Promise<{ success: boolean }> => {
    const db = getDb();
    db.shifts = db.shifts.filter(s => s.id !== shiftId);
    saveDb(db);
    return Promise.resolve({ success: true });
  },

  getAttendanceRecords: async (): Promise<Asistencia[]> => {
    return Promise.resolve(getDb().asistencia);
  },

  addAttendanceRecord: async (employeeId: string, type: 'check-in' | 'check-out'): Promise<Asistencia> => {
    const db = getDb();
    const newRecord: Asistencia = {
      id: Date.now(),
      EMPLEADO_ID: employeeId,
      timestamp: new Date().toISOString(),
      type: type,
    };
    db.asistencia.push(newRecord);
    saveDb(db);
    return Promise.resolve(newRecord);
  },

  importAttendance: async (data: AttendanceImportData[]): Promise<{ success: boolean; imported: number }> => Promise.resolve({ success: true, imported: data.length }),

  getCuentas: async (): Promise<Cuenta[]> => Promise.resolve(getDb().cuentas),
  
  getIncidencias: async(): Promise<Incidencia[]> => Promise.resolve(getDb().incidencias),
  addIncidencia: async (inc: NewIncidencia): Promise<Incidencia> => {
    const db = getDb();
    const newInc: Incidencia = { ...inc, id: Date.now() };
    db.incidencias.push(newInc);
    saveDb(db);
    return Promise.resolve(newInc);
  },
  updateIncidencia: async (inc: Incidencia): Promise<Incidencia> => {
    const db = getDb();
    const index = db.incidencias.findIndex(i => i.id === inc.id);
    if(index !== -1) db.incidencias[index] = inc;
    saveDb(db);
    return Promise.resolve(inc);
  },
  deleteIncidencia: async (id: number): Promise<{ success: boolean }> => {
    const db = getDb();
    db.incidencias = db.incidencias.filter(i => i.id !== id);
    saveDb(db);
    return Promise.resolve({ success: true });
  },

  getProducts: async(): Promise<Product[]> => Promise.resolve(getDb().products),
  addProduct: async (p: NewProduct): Promise<Product> => {
    const db = getDb();
    const newP: Product = { ...p, id: `PROD${Date.now()}`};
    db.products.push(newP);
    saveDb(db);
    return Promise.resolve(newP);
  },
  updateProduct: async (p: Product): Promise<Product> => {
    const db = getDb();
    const index = db.products.findIndex(i => i.id === p.id);
    if(index !== -1) db.products[index] = p;
    saveDb(db);
    return Promise.resolve(p);
  },
  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    const db = getDb();
    db.products = db.products.filter(p => p.id !== id);
    saveDb(db);
    return Promise.resolve({ success: true });
  },

  getPuestos: async(): Promise<Puesto[]> => Promise.resolve(getDb().puestos),
  addPuesto: async (p: NewPuesto): Promise<Puesto> => {
      const db = getDb();
      const newP: Puesto = { ...p, id: `P${Date.now()}` };
      db.puestos.push(newP);
      saveDb(db);
      return Promise.resolve(newP);
  },
  updatePuesto: async (p: Puesto): Promise<Puesto> => {
      const db = getDb();
      const index = db.puestos.findIndex(i => i.id === p.id);
      if (index !== -1) db.puestos[index] = p;
      saveDb(db);
      return Promise.resolve(p);
  },
  deletePuesto: async (id: string): Promise<{ success: boolean }> => {
      const db = getDb();
      db.puestos = db.puestos.filter(p => p.id !== id);
      saveDb(db);
      return Promise.resolve({ success: true });
  },
  
  getPrestamos: async(): Promise<Prestamo[]> => Promise.resolve(getDb().prestamos),
  updatePrestamo: async (p: Prestamo): Promise<Prestamo> => {
      const db = getDb();
      const index = db.prestamos.findIndex(i => i.PRESTAMO_ID === p.PRESTAMO_ID);
      if (index !== -1) db.prestamos[index] = p;
      saveDb(db);
      return Promise.resolve(p);
  },
  
  getPrestamoHistorialByEmployeeId: async (employeeId: string): Promise<PrestamoHistorial[]> => {
    const db = getDb();
    return Promise.resolve(
      db.prestamoHistorial
        .filter(h => h.EMPLEADO_ID === employeeId)
        .sort((a, b) => new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime())
    );
  },

  getPayrollPeriods: async(): Promise<PayrollPeriod[]> => Promise.resolve([{ id: 'PER1023', startDate: '2023-10-01', endDate: '2023-10-15'}]),
  getPayrollRun: async (periodId: string): Promise<PayrollRun | null> => Promise.resolve(getDb().payrollRuns.find(p => p.id === 'RUN01') || null),
  runPayroll: async(periodId: string): Promise<PayrollRun> => Promise.resolve(getDb().payrollRuns[0]),
};