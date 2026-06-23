import type { OcrField } from '@/constants/config';

export const MOCK_OCR_WARRANTY: OcrField[] = [
  { id: 'product', label: 'Producto / Descripción', value: 'Audífonos inalámbricos Sony WH-1000XM5', icon: '🏷️', iconBg: '#EFF6FF', confidence: 'high', editable: true },
  { id: 'store', label: 'Tienda / Emisor', value: 'Media Markt', icon: '🏪', iconBg: '#F0FDF4', confidence: 'high', editable: true },
  { id: 'date', label: 'Fecha de compra', value: '10 de mayo de 2024', icon: '📅', iconBg: '#FFFBEB', confidence: 'high', editable: true },
  { id: 'total', label: 'Total', value: '$12,799.00', icon: '💰', iconBg: '#F0FDF4', confidence: 'high', editable: true },
  { id: 'doctype', label: 'Tipo de documento', value: 'Ticket de compra', icon: '📄', iconBg: '#F8FAFF', confidence: 'medium', editable: true },
  { id: 'warranty', label: 'Vigencia garantía', value: '2 años (hasta May 2026)', icon: '🛡️', iconBg: '#EFF6FF', confidence: 'medium', editable: true, warrantyOnly: true },
  { id: 'serial', label: 'Número de serie', value: 'SN-4821-XK9', icon: '🔢', iconBg: '#EFF6FF', confidence: 'low', editable: true, warrantyOnly: true },
];

export const MOCK_OCR_NO_WARRANTY: OcrField[] = [
  { id: 'store', label: 'Tienda / Emisor', value: 'Tienda ABC', icon: '🏪', iconBg: '#F0FDF4', confidence: 'high', editable: true },
  { id: 'date', label: 'Fecha de compra', value: '10 de mayo de 2024', icon: '📅', iconBg: '#FFFBEB', confidence: 'high', editable: true },
  { id: 'total', label: 'Total', value: '$3,599.00', icon: '💰', iconBg: '#F0FDF4', confidence: 'high', editable: true },
  { id: 'doctype', label: 'Tipo de documento', value: 'Ticket', icon: '📄', iconBg: '#F8FAFF', confidence: 'medium', editable: true },
];

export const MOCK_OCR_DEPOSIT: OcrField[] = [
  { id: 'bank', label: 'Banco / Entidad', value: 'BBVA México', icon: '🏦', iconBg: '#FDF4FF', confidence: 'high', editable: true },
  { id: 'reference', label: 'Referencia / Folio', value: '1234567890', icon: '🔖', iconBg: '#EFF6FF', confidence: 'high', editable: true },
  { id: 'date', label: 'Fecha de depósito', value: '10 de mayo de 2024', icon: '📅', iconBg: '#FFFBEB', confidence: 'high', editable: true },
  { id: 'amount', label: 'Monto', value: '$15,000.00', icon: '💰', iconBg: '#F0FDF4', confidence: 'high', editable: true },
  { id: 'beneficiary', label: 'Beneficiario / Cta. destino', value: 'Juan Pérez López', icon: '👤', iconBg: '#F8FAFF', confidence: 'medium', editable: true },
  { id: 'sender', label: 'Ordenante / Cta. origen', value: 'Andrea López', icon: '👤', iconBg: '#F8FAFF', confidence: 'medium', editable: true },
  { id: 'concept', label: 'Concepto', value: 'Pago de servicios', icon: '📝', iconBg: '#FFFBEB', confidence: 'low', editable: true },
];

export const MOCK_OCR_SERVICES: OcrField[] = [
  { id: 'bank', label: 'Banco / Entidad', value: 'BBVA México', icon: '🏦', iconBg: '#FDF4FF', confidence: 'high', editable: true },
  { id: 'reference', label: 'Referencia / Folio', value: '1234567890', icon: '🔖', iconBg: '#EFF6FF', confidence: 'high', editable: true },
  { id: 'date', label: 'Fecha de depósito', value: '10 de mayo de 2024', icon: '📅', iconBg: '#FFFBEB', confidence: 'high', editable: true },
  { id: 'amount', label: 'Monto', value: '$15,000.00', icon: '💰', iconBg: '#F0FDF4', confidence: 'high', editable: true },
  { id: 'beneficiary', label: 'Beneficiario / Cta. destino', value: 'Juan Pérez López', icon: '👤', iconBg: '#F8FAFF', confidence: 'medium', editable: true },
  { id: 'sender', label: 'Ordenante / Cta. origen', value: 'Andrea López', icon: '👤', iconBg: '#F8FAFF', confidence: 'medium', editable: true },
  { id: 'concept', label: 'Concepto', value: 'Pago de servicios', icon: '📝', iconBg: '#FFFBEB', confidence: 'low', editable: true },
];

export const MOCK_OCR_CONTRACT: OcrField[] = [
  { id: 'title', label: 'Nombre del contrato', value: 'Contrato de Prestación de Servicios', icon: '📋', iconBg: '#F0FDFA', confidence: 'high', editable: true },
  { id: 'company', label: 'Empresa / Contraparte', value: 'ABC S.A. de C.V.', icon: '🏢', iconBg: '#EFF6FF', confidence: 'high', editable: true },
  { id: 'startDate', label: 'Fecha de inicio', value: '10 de mayo de 2024', icon: '📅', iconBg: '#FFFBEB', confidence: 'high', editable: true },
  { id: 'endDate', label: 'Fecha de vencimiento', value: '10 de mayo de 2026', icon: '📅', iconBg: '#FEF2F2', confidence: 'high', editable: true },
  { id: 'amount', label: 'Monto total', value: '$27,000.00', icon: '💰', iconBg: '#F0FDF4', confidence: 'medium', editable: true },
  { id: 'type', label: 'Tipo de contrato', value: 'Prestación de Servicios', icon: '🗂️', iconBg: '#F8FAFF', confidence: 'medium', editable: true },
  { id: 'clauses', label: 'Cláusulas detectadas', value: '8 cláusulas', icon: '📝', iconBg: '#F0FDFA', confidence: 'low', editable: false },
];
