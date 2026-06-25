export type DocCategory = 'all' | 'warranty' | 'invoice' | 'deposit' | 'services' | 'contracts';
type DocStatus = 'active' | 'expiring' | 'expired' | 'paid' | 'pending' | 'processed';
type FileType = 'PDF' | 'IMG' | 'DOC' | 'XLS';

type DocItem = {
  id: string;
  name: string;
  provider: string;
  categoryId: DocCategory;
  date: string;
  amount: number | null;
  status: DocStatus;
  fileType: FileType;
  fileSize: string;
  icon: string;
};

type ExtraField = { label: string; value: string; icon: string; iconColor: string };

type LinkedDoc = {
  id: string;
  name: string;
  subtitle: string;
  isPrimary: boolean;
  thumbnail?: string;
};

type DocumentProduct = {
  name: string;
  quantity?: number;
  price?: number;
};

type DocumentDetail = {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<DocCategory, 'all'>;
  status: DocStatus;
  amount: number | null;
  currency: string;
  date: string;
  provider: string;
  identifier: string;
  fileType: FileType;
  fileSize: string;
  extraFields: ExtraField[];
  linkedDocs: LinkedDoc[];
  paymentMethod?: string;
  billingUrl?: string;
  items?: DocumentProduct[];
};

export type { DocItem, DocStatus, FileType, ExtraField, LinkedDoc, DocumentProduct, DocumentDetail };

// ─── ALL_DOCS (documents.tsx list) ─────────────────────────────────────────────
export const ALL_DOCS: DocItem[] = [
  { id: 'd01', name: 'Ticket de Compra', provider: 'Liverpool', categoryId: 'warranty', date: '10 may 2024', amount: 3499, status: 'active', fileType: 'PDF', fileSize: '345 KB', icon: '🛡️' },
  { id: 'd02', name: 'Ticket Samsung TV 65"', provider: 'Best Buy', categoryId: 'warranty', date: '02 abr 2024', amount: 12499, status: 'expiring', fileType: 'IMG', fileSize: '2.1 MB', icon: '🛡️' },
  { id: 'd03', name: 'Ticket iPhone 15 Pro', provider: 'Apple Store', categoryId: 'warranty', date: '15 mar 2024', amount: 25999, status: 'active', fileType: 'PDF', fileSize: '189 KB', icon: '🛡️' },
  { id: 'd04', name: 'Ticket Lavadora LG', provider: 'Sears', categoryId: 'warranty', date: '20 feb 2024', amount: 8999, status: 'active', fileType: 'PDF', fileSize: '421 KB', icon: '🛡️' },
  { id: 'd05', name: 'Factura CFE Marzo', provider: 'CFE', categoryId: 'invoice', date: '01 mar 2024', amount: 1250, status: 'paid', fileType: 'PDF', fileSize: '213 KB', icon: '📄' },
  { id: 'd06', name: 'Recibo de Pago Abril', provider: 'BBVA', categoryId: 'invoice', date: '05 abr 2024', amount: 3200, status: 'paid', fileType: 'XLS', fileSize: '98 KB', icon: '📄' },
  { id: 'd07', name: 'Factura Internet Mayo', provider: 'Telmex', categoryId: 'invoice', date: '01 may 2024', amount: 530, status: 'pending', fileType: 'PDF', fileSize: '175 KB', icon: '📄' },
  { id: 'd08', name: 'Depósito 10 May', provider: 'BBVA', categoryId: 'deposit', date: '10 may 2024', amount: 15000, status: 'processed', fileType: 'PDF', fileSize: '130 KB', icon: '💰' },
  { id: 'd09', name: 'Depósito 25 May', provider: 'BBVA', categoryId: 'deposit', date: '25 may 2024', amount: 8000, status: 'processed', fileType: 'PDF', fileSize: '181 KB', icon: '💰' },
  { id: 'd10', name: 'Depósito 10 Jun', provider: 'Santander', categoryId: 'deposit', date: '10 jun 2024', amount: 5000, status: 'processed', fileType: 'PDF', fileSize: '180 KB', icon: '💰' },
  { id: 'd11', name: 'Recibo de Luz', provider: 'CFE', categoryId: 'services', date: '05 may 2024', amount: 1250, status: 'paid', fileType: 'PDF', fileSize: '215 KB', icon: '⚡' },
  { id: 'd12', name: 'Recibo de Agua', provider: 'SAPAL', categoryId: 'services', date: '08 may 2024', amount: 320, status: 'paid', fileType: 'PDF', fileSize: '163 KB', icon: '💧' },
  { id: 'd13', name: 'Recibo Telefonía', provider: 'Telcel', categoryId: 'services', date: '05 may 2024', amount: 450, status: 'pending', fileType: 'PDF', fileSize: '198 KB', icon: '📱' },
  { id: 'd14', name: 'Recibo Internet', provider: 'Telmex', categoryId: 'services', date: '01 may 2024', amount: 530, status: 'pending', fileType: 'PDF', fileSize: '177 KB', icon: '🌐' },
  { id: 'd15', name: 'Contrato de Prestación de Servicios', provider: 'ABC S.A. de C.V.', categoryId: 'contracts', date: '10 may 2024', amount: 27000, status: 'active', fileType: 'PDF', fileSize: '1.2 MB', icon: '📋' },
  { id: 'd16', name: 'Contrato Arrendamiento', provider: 'Inmobiliaria Pérez', categoryId: 'contracts', date: '01 ene 2024', amount: 9000, status: 'expiring', fileType: 'PDF', fileSize: '987 KB', icon: '📋' },
  { id: 'd17', name: 'NDA – Acuerdo Confidencialidad', provider: 'StartupXYZ', categoryId: 'contracts', date: '21 abr 2024', amount: 0, status: 'active', fileType: 'PDF', fileSize: '456 KB', icon: '📋' },
];

// ─── MOCK_DOCUMENTS (document detail) ──────────────────────────────────────────
export const MOCK_DOCUMENTS: Record<string, DocumentDetail> = {
  'd11': {
    id: 'd11', title: 'Pago 05 Abr 2024', subtitle: 'Recibo de Luz',
    category: 'services', status: 'paid',
    amount: 1250, currency: 'MXN',
    date: '05 Abr 2024', provider: 'CFE',
    identifier: '#DLY-4421', fileType: 'PDF', fileSize: '213 KB',
    paymentMethod: 'Transferencia SPEI',
    billingUrl: 'https://www.cfe.mx/facturacion',
    items: [
      { name: 'Consumo básico', quantity: 1, price: 850 },
      { name: 'IVA', quantity: 1, price: 136 },
      { name: 'Alumbrado público', quantity: 1, price: 264 },
    ],
    extraFields: [
      { label: 'Periodo',          value: 'Marzo 2024',         icon: 'calendar-outline',    iconColor: '#F59E0B' },
      { label: 'Número de cuenta', value: '123-456-789-0',      icon: 'card-outline',        iconColor: '#3B7BFF' },
      { label: 'Vencimiento',      value: '12 Abr 2024',        icon: 'time-outline',        iconColor: '#DC2626' },
    ],
    linkedDocs: [
      { id: 'ld1', name: 'Recibo de Luz – CFE', subtitle: 'Vencimiento: 12 Abr 2024', isPrimary: true },
    ],
  },
  'd01': {
    id: 'd01', title: 'Ticket de Compra', subtitle: 'Liverpool – Garantía 2 años',
    category: 'warranty', status: 'active',
    amount: 3499, currency: 'MXN',
    date: '10 May 2024', provider: 'Liverpool',
    identifier: '#DLY-3301', fileType: 'PDF', fileSize: '345 KB',
    paymentMethod: 'Tarjeta de crédito',
    billingUrl: 'https://www.liverpool.com.mx/facturacion',
    items: [
      { name: 'Audífonos Sony WH-1000XM5', quantity: 1, price: 3499 },
    ],
    extraFields: [
      { label: 'Garantía hasta',   value: '10 May 2026',       icon: 'shield-checkmark-outline', iconColor: '#3B7BFF' },
      { label: 'Número de serie',  value: 'SN-9872-XK4',       icon: 'barcode-outline',          iconColor: '#64748B' },
      { label: 'Tipo de garantía', value: 'Fabricante + Tienda', icon: 'ribbon-outline',          iconColor: '#F59E0B' },
    ],
    linkedDocs: [
      { id: 'ld2', name: 'Garantía Extendida', subtitle: 'PDF + 345 KB',         isPrimary: true  },
      { id: 'ld3', name: 'Factura CFDI',        subtitle: 'PDF + 289 KB',         isPrimary: false },
    ],
  },
  'd15': {
    id: 'd15', title: 'Contrato de Prestación de Servicios', subtitle: 'ABC S.A. de C.V.',
    category: 'contracts', status: 'expiring',
    amount: 27000, currency: 'MXN',
    date: '10 May 2024', provider: 'ABC S.A. de C.V.',
    identifier: '#DLY-5512', fileType: 'PDF', fileSize: '1.2 MB',
    paymentMethod: 'Transferencia SPEI',
    billingUrl: 'https://abc-sa.com/facturacion',
    items: [
      { name: 'Consultoría técnica mensual', quantity: 12, price: 1800 },
      { name: 'Soporte prioritario 24/7', quantity: 12, price: 450 },
    ],
    extraFields: [
      { label: 'Vigencia inicio', value: '10 May 2024',        icon: 'play-circle-outline',   iconColor: '#0D9488' },
      { label: 'Vigencia fin',    value: '10 May 2026',        icon: 'stop-circle-outline',   iconColor: '#DC2626' },
      { label: 'Cláusulas',       value: '8 detectadas',       icon: 'list-outline',          iconColor: '#64748B' },
    ],
    linkedDocs: [
      { id: 'ld4', name: 'Factura de Servicios', subtitle: 'PDF + 175 KB',         isPrimary: false },
      { id: 'ld5', name: 'Addendum Contrato',    subtitle: 'PDF + 98 KB',          isPrimary: false },
      { id: 'ld6', name: 'ID Representante',     subtitle: 'IMG + 2.3 MB',         isPrimary: false },
    ],
  },
  'd08': {
    id: 'd08', title: 'Depósito 10 May', subtitle: 'BBVA – Transferencia recibida',
    category: 'deposit', status: 'processed',
    amount: 15000, currency: 'MXN',
    date: '10 May 2024', provider: 'BBVA',
    identifier: '#DLY-6890', fileType: 'PDF', fileSize: '130 KB',
    paymentMethod: 'Transferencia SPEI',
    items: [],
    extraFields: [
      { label: 'Tipo de depósito', value: 'Recibido',            icon: 'arrow-down-circle-outline', iconColor: '#7C3AED' },
      { label: 'Referencia',       value: '1234567890',          icon: 'bookmark-outline',          iconColor: '#3B7BFF' },
      { label: 'Ordenante',        value: 'Andrea López',        icon: 'person-outline',            iconColor: '#64748B' },
      { label: 'Concepto',         value: 'Pago de servicios',   icon: 'chatbox-outline',           iconColor: '#0D9488' },
    ],
    linkedDocs: [],
  },
};

// ─── LINKABLE_DOCS + SOURCE_NAMES (LinkDocument) ───────────────────────────────
export type LinkableDoc = {
  id: string;
  name: string;
  provider: string;
  date: string;
  category: Exclude<DocCategory, 'all'>;
  amount: number | null;
  icon: string;
  iconColor: string;
  iconBg: string;
};

export const LINKABLE_DOCS: LinkableDoc[] = [
  { id: 'l01', name: 'Factura de Amazon S3', provider: 'Amazon Web Services', date: '02 Abr 2024', category: 'invoice', amount: 124.50, icon: '📄', iconColor: '#C2410C', iconBg: '#FFF7ED' },
  { id: 'l02', name: 'Recibo de Honorarios Profesionales', provider: 'Dr. Sergio Valdés', date: '01 Abr 2024', category: 'invoice', amount: 850.00, icon: '📄', iconColor: '#C2410C', iconBg: '#FFF7ED' },
  { id: 'l03', name: 'Contrato de Mantenimiento Anual', provider: 'Servicios Integrales', date: '28 Mar 2024', category: 'contracts', amount: null, icon: '📋', iconColor: '#0D9488', iconBg: '#F0FDFA' },
  { id: 'l04', name: 'Póliza de Garantía de Equipo', provider: 'Tech Solutions', date: '15 Mar 2024', category: 'warranty', amount: null, icon: '🛡️', iconColor: '#3B7BFF', iconBg: '#EFF6FF' },
  { id: 'l05', name: 'Depósito Garantía de Arrendamiento', provider: 'BBVA', date: '10 Mar 2024', category: 'deposit', amount: 9000.00, icon: '💰', iconColor: '#7C3AED', iconBg: '#FDF4FF' },
  { id: 'l06', name: 'Recibo de Luz CFE Marzo', provider: 'CFE', date: '05 Mar 2024', category: 'services', amount: 1250.00, icon: '⚡', iconColor: '#0EA5E9', iconBg: '#F0F9FF' },
  { id: 'l07', name: 'Factura CFDI Equipo de Cómputo', provider: 'Dell México', date: '28 Feb 2024', category: 'invoice', amount: 18499, icon: '📄', iconColor: '#C2410C', iconBg: '#FFF7ED' },
  { id: 'l08', name: 'Ticket de Compra MacBook Pro', provider: 'Apple Store', date: '15 Feb 2024', category: 'warranty', amount: 42999, icon: '🛡️', iconColor: '#3B7BFF', iconBg: '#EFF6FF' },
  { id: 'l09', name: 'Contrato de Arrendamiento Oficina', provider: 'Inmobiliaria Pérez', date: '01 Feb 2024', category: 'contracts', amount: 12000, icon: '📋', iconColor: '#0D9488', iconBg: '#F0FDFA' },
  { id: 'l10', name: 'Recibo de Internet Telmex', provider: 'Telmex', date: '01 Feb 2024', category: 'services', amount: 530, icon: '🌐', iconColor: '#0EA5E9', iconBg: '#F0F9FF' },
];

export const SOURCE_NAMES: Record<string, string> = {
  d11: 'Pago 05 Abr 2024',
  d01: 'Ticket de Compra',
  d15: 'Contrato de Prestación de Servicios',
  d08: 'Depósito 10 May',
};

// ─── RecentDocuments mock ──────────────────────────────────────────────────────
type ExpiryStatus = 'urgent' | 'warning' | 'ok' | 'none';

export type RecentDoc = {
  id: string;
  name: string;
  extension: 'PDF' | 'XLS' | 'DOC' | 'IMG' | string;
  category: string;
  date: string;
  expiry: ExpiryStatus;
  expiryLabel: string;
};

export const MOCK_DOCS: RecentDoc[] = [
  { id: 'doc_1', name: 'Contrato Arrendamiento.pdf', extension: 'PDF', category: 'Contratos', date: '10 May 2024', expiry: 'urgent', expiryLabel: 'Vence en 15 días' },
  { id: 'doc_2', name: 'Recibo de Pago Abril.xlsx', extension: 'XLS', category: 'Ingresos', date: '8 May 2024', expiry: 'none', expiryLabel: 'Sin vencimiento' },
  { id: 'doc_3', name: 'Garantía Samsung TV.docx', extension: 'DOC', category: 'Garantías', date: '3 May 2024', expiry: 'ok', expiryLabel: 'Vigente' },
  { id: 'doc_4', name: 'Factura Iberdrola Mayo.pdf', extension: 'PDF', category: 'Facturación', date: '1 May 2024', expiry: 'warning', expiryLabel: 'Vence en 7 días' },
];
