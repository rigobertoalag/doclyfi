import type { FinancialData } from '@/modules/dashboard/mocks/financial';

export function formatCurrency(value: number): string {
    return '$' + value.toLocaleString('es-MX');
}

export type CardState = 'full' | 'income_only' | 'expense_only' | 'empty';

export function getCardState(data: FinancialData): CardState {
    const hasIncome  = data.income  !== null;
    const hasExpense = data.expense !== null;
    if (hasIncome  && hasExpense)  return 'full';
    if (hasIncome  && !hasExpense) return 'income_only';
    if (!hasIncome && hasExpense)  return 'expense_only';
    return 'empty';
}
