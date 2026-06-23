// mocks/financial.ts — actualiza los tipos para incluir null

export type FinancialData = {
  income: number | null;   // null = sin datos, 0 = dato real de cero
  expense: number | null;
  incomeTrend: number | null;   // null cuando no hay dato previo para comparar
  expenseTrend: number | null;
};

export type Period = 'Este mes' | 'Este año' | 'Última semana' | '3 meses';

export const MOCK_DATA: Record<Period, FinancialData> = {
  'Este mes': { income: null, expense: 22300, incomeTrend: null, expenseTrend: -3.1 },
  'Este año': { income: 312000, expense: 178000, incomeTrend: 12.4, expenseTrend: 5.7 },
  'Última semana': { income: null, expense: null, incomeTrend: null, expenseTrend: null },
  '3 meses': { income: 134500, expense: 67800, incomeTrend: 4.1, expenseTrend: 2.3 },
};

export const INCOME_PATH = 'M2 22 C8 20, 12 16, 18 14 S30 8, 36 6 S44 8, 50 4';
export const EXPENSE_PATH = 'M2 6 C8 8, 14 10, 18 12 S26 18, 32 16 S42 20, 50 22';