export type ServiceStatus = 'pending' | 'paid' | 'overdue';

export type FilterTab = 'all' | 'pending' | 'paid';

export type Month = 'Marzo 2026' | 'Febrero 2026' | 'Enero 2026';

export type ServiceItem = {
  id: string;
  provider: string;
  category: string;
  amount: number;
  dueInDays: number;
  status: ServiceStatus;
  color: string;
  bg: string;
  icon: string;
};

export const SERVICE_CATEGORIES = [
  { id: 'luz', label: 'Luz', icon: 'bulb-outline', color: '#F59E0B', bg: '#FFFBEB', pending: 2, paid: 1 },
  { id: 'agua', label: 'Agua', icon: 'water-outline', color: '#0EA5E9', bg: '#F0F9FF', pending: 1, paid: 1 },
  { id: 'internet', label: 'Internet', icon: 'wifi-outline', color: '#8B5CF6', bg: '#F5F3FF', pending: 1, paid: 1 },
  { id: 'streaming', label: 'Streaming', icon: 'play-circle-outline', color: '#EF4444', bg: '#FEF2F2', pending: 1, paid: 2 },
  { id: 'colegiaturas', label: 'Colegiaturas', icon: 'school-outline', color: '#3B7BFF', bg: '#EFF6FF', pending: 1, paid: 1 },
  { id: 'telefonia', label: 'Telefonía', icon: 'call-outline', color: '#10B981', bg: '#F0FDF4', pending: 0, paid: 1 },
] as const;

export const MONTHS: Month[] = ['Marzo 2026', 'Febrero 2026', 'Enero 2026'];

export const SERVICES_BY_MONTH: Record<Month, ServiceItem[]> = {
  'Marzo 2026': [
    { id: 's1', provider: 'CFE - Luz', category: 'Servicio de electricidad', amount: 1250, dueInDays: 5, status: 'pending', color: '#F59E0B', bg: '#FFFBEB', icon: 'bulb-outline' },
    { id: 's2', provider: 'SAPAL - Agua', category: 'Servicio de agua potable', amount: 320, dueInDays: 12, status: 'pending', color: '#0EA5E9', bg: '#F0F9FF', icon: 'water-outline' },
    { id: 's3', provider: 'Telmex - Internet', category: 'Servicio de internet', amount: 530, dueInDays: 18, status: 'pending', color: '#8B5CF6', bg: '#F5F3FF', icon: 'wifi-outline' },
  ],
  'Febrero 2026': [
    { id: 's4', provider: 'CFE - Luz', category: 'Servicio de electricidad', amount: 1100, dueInDays: 0, status: 'paid', color: '#F59E0B', bg: '#FFFBEB', icon: 'bulb-outline' },
    { id: 's5', provider: 'Netflix', category: 'Streaming', amount: 219, dueInDays: 0, status: 'paid', color: '#EF4444', bg: '#FEF2F2', icon: 'play-circle-outline' },
  ],
  'Enero 2026': [
    { id: 's6', provider: 'CFE - Luz', category: 'Servicio de electricidad', amount: 980, dueInDays: 0, status: 'paid', color: '#F59E0B', bg: '#FFFBEB', icon: 'bulb-outline' },
    { id: 's7', provider: 'SAPAL - Agua', category: 'Servicio de agua potable', amount: 290, dueInDays: 0, status: 'paid', color: '#0EA5E9', bg: '#F0F9FF', icon: 'water-outline' },
    { id: 's8', provider: 'Telmex - Internet', category: 'Servicio de internet', amount: 530, dueInDays: 0, status: 'paid', color: '#8B5CF6', bg: '#F5F3FF', icon: 'wifi-outline' },
  ],
};

export const PAYMENT_HISTORY = [
  { id: 'h1', provider: 'Netflix', category: 'Streaming', date: '10 mar 2026', amount: 219, status: 'paid', color: '#EF4444', bg: '#FEF2F2', icon: 'play-circle-outline' },
  { id: 'h2', provider: 'SAPAL - Agua', category: 'Servicio de agua', date: '08 mar 2026', amount: 320, status: 'paid', color: '#0EA5E9', bg: '#F0F9FF', icon: 'water-outline' },
  { id: 'h3', provider: 'Telcel', category: 'Servicio de telefonía', date: '05 mar 2026', amount: 450, status: 'pending', color: '#10B981', bg: '#F0FDF4', icon: 'call-outline' },
];
