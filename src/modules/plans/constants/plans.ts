export type PlanId = 'free' | 'premium' | 'premium_plus';

export type BillingPeriod = 'monthly' | 'semesterly' | 'annual';

const PERIOD_LABELS: Record<BillingPeriod, string> = {
    monthly: 'Mensual',
    semesterly: 'Semestral',
    annual: 'Anual',
};

export type Plan = {
    id: PlanId;
    name: string;
    desc: string;
    color: string;
    bg: string;
    border: string;
    shadow: string;
    icon: string;
    recommended?: boolean;
    prices: Record<BillingPeriod, number | null>;
    docs: number;
    storage: string;
};

export type Feature = {
    id: string;
    label: string;
    values: Record<PlanId, boolean>;
};

export type FeatureCategory = {
    name: string;
    features: Feature[];
};

export const PERIODS: { key: BillingPeriod; label: string }[] = [
    { key: 'monthly', label: 'Mensual' },
    { key: 'semesterly', label: 'Semestral' },
    { key: 'annual', label: 'Anual' },
];

export function formatPeriodLabel(period: BillingPeriod): string {
    return PERIOD_LABELS[period];
}

export function formatPrice(price: number | null): string {
    if (price === null) return '—';
    if (price === 0) return 'Gratis';
    return `$${price.toLocaleString('es-MX')} MXN`;
}

export const PLANS: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        desc: 'Para empezar a organizar tus documentos.',
        color: '#64748B',
        bg: '#F8FAFF',
        border: '#E2E8F0',
        shadow: 'rgba(100,116,139,0.12)',
        icon: '📄',
        prices: { monthly: 0, semesterly: null, annual: null },
        docs: 250,
        storage: '250 MB',
    },
    {
        id: 'premium',
        name: 'Premium',
        desc: 'Para uso profesional individual.',
        color: '#3B7BFF',
        bg: '#EFF6FF',
        border: '#BFDBFE',
        shadow: 'rgba(59,123,255,0.2)',
        icon: '⭐',
        recommended: true,
        prices: { monthly: 39, semesterly: 129, annual: 199 },
        docs: 1000,
        storage: '1 GB',
    },
    {
        id: 'premium_plus',
        name: 'Premium Plus',
        desc: 'Para empresas y familias.',
        color: '#7C3AED',
        bg: '#FDF4FF',
        border: '#E9D5FF',
        shadow: 'rgba(124,58,237,0.2)',
        icon: '👑',
        prices: { monthly: 59, semesterly: 199, annual: 349 },
        docs: 5000,
        storage: '5 GB',
    },
];

export const FEATURE_CATEGORIES: FeatureCategory[] = [
    {
        name: 'Consultas Inteligentes',
        features: [
            {
                id: 'smart_queries',
                label: 'Consultas Inteligentes "¿Cuánto gasté en café el mes de Mayo?, ¿Cuánto gasté en restaurantes en mes pasado?, ¿Cuánto he gastado en propinas en este mes?"',
                values: { free: true, premium: true, premium_plus: true },
            },
            {
                id: 'whatsapp',
                label: 'Uso desde WhatsApp para Registro Automático de Documentos y Consultas Inteligentes',
                values: { free: true, premium: true, premium_plus: true },
            },
        ],
    },
    {
        name: 'OCR y Digitalización',
        features: [
            {
                id: 'ocr',
                label: 'OCR. Automatización en Lectura y Extracción de Data desde Fotos, Imágenes y PDFs. Conversión de fotos e imágenes a PDF.',
                values: { free: true, premium: true, premium_plus: true },
            },
            {
                id: 'multi_pdf',
                label: 'Conversión de Múltiples Imágenes juntas a PDF con posibilidad de Descarga',
                values: { free: true, premium: true, premium_plus: true },
            },
        ],
    },
    {
        name: 'Automatización por Tipo',
        features: [
            {
                id: 'auto_warranty',
                label: 'Compras con Garantía — Consultas, Archivado, Registro Contable, Historial, Facturación, Balance y Alertas de Vencimiento',
                values: { free: true, premium: true, premium_plus: true },
            },
            {
                id: 'auto_generic',
                label: 'Compras Genéricas — Consultas, Archivado, Registro Contable, Historial, Facturación y Balance',
                values: { free: true, premium: true, premium_plus: true },
            },
            {
                id: 'auto_deposits',
                label: 'Depósitos a favor y a terceros — Consultas, Archivado, Registro Contable, Historial y Balance',
                values: { free: true, premium: true, premium_plus: true },
            },
            {
                id: 'auto_services',
                label: 'Pago de Servicios (Agua, Luz, Teléfono, Tenencia, Colegiatura, etc.) — Consultas, Archivado, Registro Contable, Facturación, Balance y Creación',
                values: { free: true, premium: true, premium_plus: true },
            },
            {
                id: 'auto_contracts',
                label: 'Contratos — Estatus de Exhibiciones Acordadas, Consultas, Archivado, Historial, Balance, Alertas de Vencimiento',
                values: { free: true, premium: true, premium_plus: true },
            },
            {
                id: 'auto_ids',
                label: 'Identificaciones (INE, Pasaporte, VISA, Licencia de Conducir, etc.) — Consultas, Archivado y Creación',
                values: { free: true, premium: true, premium_plus: true },
            },
        ],
    },
    {
        name: 'Vinculación y Estadísticas',
        features: [
            {
                id: 'link_docs',
                label: 'Vincular Documentos, ejemplo: "Un Contrato con un Depósito"',
                values: { free: true, premium: true, premium_plus: true },
            },
            {
                id: 'advanced_stats',
                label: 'Estadísticas Avanzadas — Análisis de Consumo, Balance General Global, Historial detallado y más',
                values: { free: true, premium: true, premium_plus: true },
            },
        ],
    },
    {
        name: 'Alertas',
        features: [
            {
                id: 'alert_expiry',
                label: 'Alertas de vencimiento',
                values: { free: true, premium: true, premium_plus: true },
            },
            {
                id: 'alert_payments',
                label: 'Alertas de pagos',
                values: { free: true, premium: true, premium_plus: true },
            },
        ],
    },
    {
        name: 'Facturación y Envíos',
        features: [
            {
                id: 'invoice_tickets',
                label: 'Facturación de tickets',
                values: { free: true, premium: true, premium_plus: true },
            },
            {
                id: 'send_professional',
                label: 'Envío automático de documentos a Contador y Abogado',
                values: { free: true, premium: true, premium_plus: true },
            },
        ],
    },
    {
        name: 'Respaldo y Perfiles',
        features: [
            {
                id: 'cloud_backup',
                label: 'Respaldo en nube',
                values: { free: true, premium: true, premium_plus: true },
            },
            {
                id: 'two_profiles',
                label: '2 Perfiles: 1 Personal y 1 de Empresa',
                values: { free: true, premium: true, premium_plus: true },
            },
            {
                id: 'multi_fiscal',
                label: 'Multi perfil fiscal. Crea hasta 5 perfiles de empresas.',
                values: { free: false, premium: true, premium_plus: true },
            },
            {
                id: 'family_admin',
                label: 'Administración y Vinculación Familiar; que tus Hijos y Pareja tengan un perfil asociado al tuyo',
                values: { free: false, premium: false, premium_plus: true },
            },
            {
                id: 'mass_export',
                label: 'Exportación masiva por carpetas, balances e historial',
                values: { free: false, premium: false, premium_plus: true },
            },
        ],
    },
];
