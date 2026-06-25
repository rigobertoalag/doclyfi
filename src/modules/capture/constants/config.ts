export type PurchaseType = 'warranty' | 'no_warranty';

export type OcrConfidence = 'high' | 'medium' | 'low';

export type OcrField = {
  id: string;
  label: string;
  value: string;
  icon: string;
  iconBg: string;
  confidence: OcrConfidence;
  editable: boolean;
  warrantyOnly?: boolean;
};

// ─── Config estática ──────────────────────────────────────────────────────────
export const DEPOSIT_CONFIG = {
  pill: '🏦  Depósito',
  subtitle: 'Guarda y organiza tus comprobantes de depósito.',
  captureTitle: 'Agregar comprobante',
  captureSub: 'Escanea o sube tu comprobante de depósito.',
  infoIcon: 'information-circle-outline' as const,
  infoText: 'Captura el banco, referencia y monto claramente. El OCR extraerá los datos automáticamente.',
  accent: '#7C3AED',
  accentBg: '#FDF4FF',
  accentBorder: '#E9D5FF',
  accentLight: '#6D28D9',
  ctaIcon: 'arrow-down-circle' as const,
  ctaLabel: 'Guardar depósito',
  ctaSub: 'El comprobante quedará en tu historial',
};

export type DepositType = 'received' | 'sent' | null;

export const PURCHASE_CONFIG = {
  warranty: {
    pill: '🛡️  Compra con Garantía',
    subtitle: 'Escanea tu ticket para registrar la garantía y proteger tu compra.',
    tabs: ['Ticket de compra', 'Factura'],
    tabIcons: ['receipt-outline', 'document-text-outline'],
    captureTitle: 'Agregar ticket de compra',
    infoIcon: 'shield-checkmark-outline' as const,
    infoText: 'Asegúrate de capturar el número de serie y la fecha de compra. Son clave para activar la garantía.',
    ocrHints: ['Tienda y fecha de compra', 'Productos y número de serie', 'Duración de garantía'],
    accent: '#3B7BFF',
    accentBg: '#EFF6FF',
    accentBorder: '#BFDBFE',
    accentLight: '#2563EB',
    ctaIcon: 'shield-checkmark' as const,
    ctaLabel: 'Guardar con Garantía',
    ctaSub: 'Se registrará la garantía del producto',
  },
  no_warranty: {
    pill: '📄  Archivado y Facturación',
    subtitle: 'Guarda tus tickets y facturas, factúralos o envíalos a tu contador.',
    tabs: ['Tickets', 'Facturas'],
    tabIcons: ['receipt-outline', 'clipboard-outline'],
    captureTitle: 'Agregar ticket',
    infoIcon: 'information-circle-outline' as const,
    infoText: 'Puedes subir imágenes o PDFs. El OCR leerá el contenido automáticamente para archivar tu compra.',
    ocrHints: [],
    accent: '#C2410C',
    accentBg: '#FFF7ED',
    accentBorder: '#FED7AA',
    accentLight: '#C2410C',
    ctaIcon: 'archive' as const,
    ctaLabel: 'Archivar ticket',
    ctaSub: 'El documento quedará guardado en tu biblioteca',
  },
};

export const SOURCES = [
  { id: 'camera', label: 'Cámara', icon: 'camera-outline', bg: '#EFF6FF', border: '#BFDBFE', iconColor: '#2563EB' },
  { id: 'gallery', label: 'Galería', icon: 'image-outline', bg: '#F0FDF4', border: '#BBF7D0', iconColor: '#16A34A' },
  { id: 'pdf', label: 'PDF', icon: 'document-attach-outline', bg: '#FEF2F2', border: '#FECACA', iconColor: '#DC2626' },
];

// ─── Captura de Servicios ─────────────────────────────────────────────────────
export const SERVICES_CONFIG = {
  pill: '📜  Pago de Servicios',
  subtitle: 'Escanea, organiza y controla todos tus servicios en un solo lugar.',
  captureTitle: 'Agregar recibo de servicio',
  captureSub: 'Escanea o sube tu recibo.',
  infoIcon: 'information-circle-outline' as const,
  infoText: 'El OCR extraerá los datos automáticamente, te recomendamos siempre verificar la información.',
  accent: '#3B7BFF',
  accentBg: '#EFF6FF',
  accentBorder: '#BFDBFE',
  accentLight: '#2563EB',
  ctaIcon: 'arrow-down-circle' as const,
  ctaLabel: 'Guardar depósito',
  ctaSub: 'El comprobante quedará en tu historial',
};
