export type GastosItem = {
    id: string;
    merchant: string;
    category: string;
    amount: number;
    date: string;
    hasWarranty: boolean;
    warrantyExpiry?: string;
};

export type ServicesItem = {
    id: string;
    provider: string;
    category: string;
    amount: number;
    month: string;
    status: 'paid' | 'pending';
};

export type IncomeItem = {
    id: string;
    type: 'nomina' | 'transferencia' | 'efectivo' | 'otros';
    amount: number;
    date: string;
    description: string;
};

export type ContractInstallment = {
    dueDate: string;
    amount: number;
    status: 'paid' | 'pending';
};

export type ContractItem = {
    id: string;
    name: string;
    counterparty: string;
    totalAmount: number;
    installments: ContractInstallment[];
};

export const MOCK_GASTOS: GastosItem[] = [
    { id: 'g1', merchant: 'Walmart', category: 'Alimentación', amount: 2340, date: '2026-06-15', hasWarranty: false },
    { id: 'g2', merchant: 'Soriana', category: 'Alimentación', amount: 1870, date: '2026-06-14', hasWarranty: false },
    { id: 'g3', merchant: 'Pemex', category: 'Transporte', amount: 850, date: '2026-06-14', hasWarranty: false },
    { id: 'g4', merchant: 'Farmacia Guadalajara', category: 'Salud', amount: 560, date: '2026-06-13', hasWarranty: false },
    { id: 'g5', merchant: 'Cinemex', category: 'Entretenimiento', amount: 320, date: '2026-06-12', hasWarranty: false },
    { id: 'g6', merchant: 'Liverpool', category: 'Vivienda', amount: 4500, date: '2026-06-11', hasWarranty: false },
    { id: 'g7', merchant: 'Office Depot', category: 'Otros', amount: 780, date: '2026-06-10', hasWarranty: false },
    { id: 'g8', merchant: 'Best Buy', category: 'Alimentación', amount: 12500, date: '2026-06-08', hasWarranty: true, warrantyExpiry: '2028-06-08' },
    { id: 'g9', merchant: 'Uber', category: 'Transporte', amount: 230, date: '2026-06-07', hasWarranty: false },
    { id: 'g10', merchant: 'Netflix', category: 'Entretenimiento', amount: 219, date: '2026-06-05', hasWarranty: false },
    { id: 'g11', merchant: 'Costco', category: 'Alimentación', amount: 3200, date: '2026-06-16', hasWarranty: false },
    { id: 'g12', merchant: 'Shell', category: 'Transporte', amount: 720, date: '2026-06-17', hasWarranty: false },
    { id: 'g13', merchant: 'Amazon', category: 'Vivienda', amount: 1890, date: '2026-06-17', hasWarranty: false },
    { id: 'g14', merchant: 'Dairy Queen', category: 'Entretenimiento', amount: 280, date: '2026-06-18', hasWarranty: false },
    { id: 'g15', merchant: 'OXXO', category: 'Alimentación', amount: 165, date: '2026-06-19', hasWarranty: false },
    { id: 'g16', merchant: 'Home Depot', category: 'Vivienda', amount: 5600, date: '2026-06-19', hasWarranty: true, warrantyExpiry: '2029-06-19' },
];

export const MOCK_SERVICES: ServicesItem[] = [
    { id: 'sv1', provider: 'CFE - Luz', category: 'Luz', amount: 1250, month: 'Junio 2026', status: 'pending' },
    { id: 'sv2', provider: 'SAPAL - Agua', category: 'Agua', amount: 320, month: 'Junio 2026', status: 'pending' },
    { id: 'sv3', provider: 'Telmex - Internet', category: 'Internet', amount: 530, month: 'Junio 2026', status: 'pending' },
    { id: 'sv4', provider: 'CFE - Luz', category: 'Luz', amount: 1100, month: 'Mayo 2026', status: 'paid' },
    { id: 'sv5', provider: 'SAPAL - Agua', category: 'Agua', amount: 320, month: 'Mayo 2026', status: 'paid' },
    { id: 'sv6', provider: 'Telmex - Internet', category: 'Internet', amount: 530, month: 'Mayo 2026', status: 'paid' },
    { id: 'sv7', provider: 'Telcel', category: 'Telefonía', amount: 450, month: 'Mayo 2026', status: 'paid' },
    { id: 'sv8', provider: 'Netflix', category: 'Streaming', amount: 219, month: 'Mayo 2026', status: 'paid' },
    { id: 'sv9', provider: 'Universidad Anáhuac', category: 'Colegiaturas', amount: 8500, month: 'Mayo 2026', status: 'paid' },
    { id: 'sv10', provider: 'CFE - Luz', category: 'Luz', amount: 980, month: 'Abril 2026', status: 'paid' },
    { id: 'sv11', provider: 'SAPAL - Agua', category: 'Agua', amount: 290, month: 'Abril 2026', status: 'paid' },
    { id: 'sv12', provider: 'Telmex - Internet', category: 'Internet', amount: 530, month: 'Abril 2026', status: 'paid' },
];

export const MOCK_INCOME: IncomeItem[] = [
    { id: 'i1', type: 'nomina', amount: 28500, date: '2026-06-15', description: 'Nómina quincenal Junio' },
    { id: 'i2', type: 'transferencia', amount: 5000, date: '2026-06-10', description: 'Transferencia de María' },
    { id: 'i3', type: 'efectivo', amount: 2000, date: '2026-06-08', description: 'Venta de artículos' },
    { id: 'i4', type: 'nomina', amount: 28500, date: '2026-05-31', description: 'Nómina quincenal Mayo' },
    { id: 'i5', type: 'transferencia', amount: 15000, date: '2026-05-20', description: 'Pago de factura independiente' },
    { id: 'i6', type: 'otros', amount: 3500, date: '2026-05-15', description: 'Devolución de impuestos' },
    { id: 'i7', type: 'nomina', amount: 28500, date: '2026-05-15', description: 'Nómina quincenal Mayo' },
    { id: 'i8', type: 'efectivo', amount: 1200, date: '2026-05-10', description: 'Reembolso' },
];

export const MOCK_CONTRACTS: ContractItem[] = [
    {
        id: 'c1',
        name: 'Prestación de Servicios Profesionales',
        counterparty: 'ABC S.A. de C.V.',
        totalAmount: 27000,
        installments: [
            { dueDate: '2026-01-15', amount: 13500, status: 'paid' },
            { dueDate: '2026-07-15', amount: 13500, status: 'pending' },
        ],
    },
    {
        id: 'c2',
        name: 'Renta de Oficina',
        counterparty: 'Inmobiliaria López',
        totalAmount: 120000,
        installments: [
            { dueDate: '2026-01-01', amount: 10000, status: 'paid' },
            { dueDate: '2026-02-01', amount: 10000, status: 'paid' },
            { dueDate: '2026-03-01', amount: 10000, status: 'paid' },
            { dueDate: '2026-04-01', amount: 10000, status: 'paid' },
            { dueDate: '2026-05-01', amount: 10000, status: 'paid' },
            { dueDate: '2026-06-01', amount: 10000, status: 'paid' },
            { dueDate: '2026-07-01', amount: 10000, status: 'pending' },
            { dueDate: '2026-08-01', amount: 10000, status: 'pending' },
            { dueDate: '2026-09-01', amount: 10000, status: 'pending' },
            { dueDate: '2026-10-01', amount: 10000, status: 'pending' },
            { dueDate: '2026-11-01', amount: 10000, status: 'pending' },
            { dueDate: '2026-12-01', amount: 10000, status: 'pending' },
        ],
    },
    {
        id: 'c3',
        name: 'Desarrollo de Software',
        counterparty: 'TechSolutions MX',
        totalAmount: 45000,
        installments: [
            { dueDate: '2026-04-01', amount: 15000, status: 'paid' },
            { dueDate: '2026-05-01', amount: 15000, status: 'paid' },
            { dueDate: '2026-06-01', amount: 15000, status: 'pending' },
        ],
    },
];

export const CATEGORY_COLORS: Record<string, { fill: string; bg: string; border: string }> = {
    Alimentación: { fill: '#3B7BFF', bg: '#EFF6FF', border: '#BFDBFE' },
    Transporte: { fill: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
    Vivienda: { fill: '#7C3AED', bg: '#FDF4FF', border: '#E9D5FF' },
    Salud: { fill: '#10B981', bg: '#F0FDF4', border: '#BBF7D0' },
    Entretenimiento: { fill: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
    Otros: { fill: '#94A3B8', bg: '#F8FAFC', border: '#E2E8F0' },
};

export const SERVICE_CATEGORY_COLORS: Record<string, { fill: string; bg: string }> = {
    Luz: { fill: '#F59E0B', bg: '#FFFBEB' },
    Agua: { fill: '#0EA5E9', bg: '#F0F9FF' },
    Internet: { fill: '#8B5CF6', bg: '#F5F3FF' },
    Telefonía: { fill: '#10B981', bg: '#F0FDF4' },
    Streaming: { fill: '#EF4444', bg: '#FEF2F2' },
    Colegiaturas: { fill: '#3B7BFF', bg: '#EFF6FF' },
};

export const INCOME_TYPE_COLORS: Record<string, { fill: string; bg: string; label: string }> = {
    nomina: { fill: '#16A34A', bg: '#F0FDF4', label: 'Nómina' },
    transferencia: { fill: '#3B7BFF', bg: '#EFF6FF', label: 'Transferencia' },
    efectivo: { fill: '#D97706', bg: '#FFFBEB', label: 'Efectivo' },
    otros: { fill: '#94A3B8', bg: '#F8FAFC', label: 'Otros' },
};
