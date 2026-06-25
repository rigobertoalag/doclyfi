import type { Period } from '@/modules/dashboard/mocks/financial';
import { EXPENSE_PATH, INCOME_PATH, MOCK_DATA } from '@/modules/dashboard/mocks/financial';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { EmptyFinancialState } from './EmptyFinancialState';
import { formatCurrency, getCardState } from './helpers';
import { styles } from './styles';
import { MetricColumn } from './MetricColumn';
import { PartialDataBanner } from './PartialDataBanner';

const PERIODS: Period[] = ['Este mes', 'Este año', 'Última semana', '3 meses'];

export function FinancialSummary() {
    const [periodIdx, setPeriodIdx] = useState(0);
    const period    = PERIODS[periodIdx];
    const data      = MOCK_DATA[period];
    const cardState = getCardState(data);
    const cyclePeriod = () => setPeriodIdx((i) => (i + 1) % PERIODS.length);

    const balance = (data.income !== null && data.expense !== null)
        ? data.income - data.expense
        : null;

    return (
        <View style={styles.card}>

            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>Resumen financiero</Text>
                    <TouchableOpacity style={styles.infoBtn}>
                        <Text style={styles.infoBtnText}>i</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.periodBtn} onPress={cyclePeriod}>
                    <Text style={styles.periodText}>{period}</Text>
                    <Text style={styles.periodArrow}>▾</Text>
                </TouchableOpacity>
            </View>

            {cardState === 'empty' && (
                <EmptyFinancialState />
            )}

            {cardState !== 'empty' && (
                <>
                    <View style={styles.metricsRow}>
                        <MetricColumn
                            label="Ingresos"
                            value={data.income}
                            trend={data.incomeTrend}
                            color="#16A34A"
                            sparkPath={INCOME_PATH}
                            gradientId="gIncome"
                            missingCta={
                                data.income === null
                                    ? { label: 'Agregar ingresos', route: '/deposit' }
                                    : undefined
                            }
                        />

                        <View style={styles.metricDivider} />

                        <MetricColumn
                            label="Egresos"
                            value={data.expense}
                            trend={data.expenseTrend}
                            color="#DC2626"
                            sparkPath={EXPENSE_PATH}
                            gradientId="gExpense"
                            missingCta={
                                data.expense === null
                                    ? { label: 'Agregar gastos', route: '/purchase' }
                                    : undefined
                            }
                        />
                    </View>

                    {(cardState === 'income_only' || cardState === 'expense_only') && (
                        <PartialDataBanner
                            missingType={cardState === 'expense_only' ? 'income' : 'expense'}
                        />
                    )}

                    <View style={styles.divider} />
                    <View style={styles.balanceRow}>
                        <Text style={styles.balanceLabel}>Balance neto</Text>
                        {balance !== null ? (
                            <Text style={[
                                styles.balanceValue,
                                balance < 0 && { color: '#DC2626' },
                            ]}>
                                {formatCurrency(balance)}
                            </Text>
                        ) : (
                            <View style={styles.balanceIncomplete}>
                                <Ionicons
                                    name="remove-outline"
                                    size={14}
                                    color="#94A3B8"
                                />
                                <Text style={styles.balanceIncompleteText}>
                                    Incompleto
                                </Text>
                            </View>
                        )}
                    </View>
                </>
            )}

        </View>
    );
}
