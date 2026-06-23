export type ContractStatus = 'active' | 'expiring' | 'expired' | 'pending';

type ContractItem = {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  daysLeft: number;
  amount: number;
  status: ContractStatus;
  icon: string;
  color: string;
  bg: string;
};

type HistoryItem = {
  id: string;
  title: string;
  company: string;
  signedDate: string;
  status: 'signed' | 'pending' | 'expired';
  amount: number;
  color: string;
  bg: string;
};

export const UPCOMING_CONTRACTS: ContractItem[] = [
  { id: 'c1', title: 'Contrato de Arrendamiento', company: 'Inmobiliaria Pérez', startDate: '01 ene 2024', endDate: '01 ene 2025', daysLeft: 15, amount: 9000, status: 'expiring', icon: '🏠', color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'c2', title: 'Contrato de Servicios Profesionales', company: 'Consultoría MX S.A.', startDate: '15 feb 2024', endDate: '15 feb 2026', daysLeft: 45, amount: 15000, status: 'expiring', icon: '💼', color: '#8B5CF6', bg: '#F5F3FF' },
  { id: 'c3', title: 'Contrato de Suministro', company: 'Proveedora Industrial', startDate: '01 mar 2024', endDate: '01 mar 2025', daysLeft: 60, amount: 8000, status: 'active', icon: '📦', color: '#0D9488', bg: '#F0FDFA' },
];

export const HISTORY_CONTRACTS: HistoryItem[] = [
  { id: 'h1', title: 'Contrato de Prestación de Servicios', company: 'Tech Solutions', signedDate: '10 may 2024', status: 'signed', amount: 27000, color: '#0D9488', bg: '#F0FDFA' },
  { id: 'h2', title: 'Contrato Confidencialidad (NDA)', company: 'StartupXYZ', signedDate: '21 abr 2024', status: 'signed', amount: 0, color: '#3B7BFF', bg: '#EFF6FF' },
  { id: 'h3', title: 'Contrato de Consultoría', company: 'Consultoría MX S.A.', signedDate: '18 mar 2024', status: 'expired', amount: 5000, color: '#EF4444', bg: '#FEF2F2' },
];
