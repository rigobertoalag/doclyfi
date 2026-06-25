import { INCOME_TYPE_COLORS, MOCK_INCOME } from '@/modules/reports/mocks/reports';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ReportDonut } from './ReportDonut';
import { ReportSummaryRow } from './ReportSummaryRow';

export function IncomeSection() {
    const total = useMemo(() => MOCK_INCOME.reduce((s, i) => s + i.amount, 0), []);

    const typeTotals: Record<string, number> = {};
    MOCK_INCOME.forEach((item) => {
        typeTotals[item.type] = (typeTotals[item.type] ?? 0) + item.amount;
    });

    const segments = Object.entries(typeTotals).map(([type, value]) => ({
        label: INCOME_TYPE_COLORS[type]?.label ?? type,
        value,
        color: INCOME_TYPE_COLORS[type]?.fill ?? '#94A3B8',
    }));

    const handleChartPress = () => {
        router.push({ pathname: '/(main)/reports/detail', params: { category: 'income', totalAmount: total, itemCount: MOCK_INCOME.length } });
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={[styles.iconWrap, { backgroundColor: '#F0FDF4' }]}>
                    <Ionicons name="wallet-outline" size={18} color="#16A34A" />
                </View>
                <Text style={styles.title}>Depósitos e Ingresos</Text>
            </View>

            <View style={styles.chartRow}>
                <ReportDonut
                    segments={segments}
                    centerValue={`$${(total / 1000).toFixed(1)}k`}
                    centerLabel="Total"
                    onPress={handleChartPress}
                />
                <View style={styles.legend}>
                    {segments.map((seg) => (
                        <ReportSummaryRow
                            key={seg.label}
                            label={seg.label}
                            value={`$${seg.value.toLocaleString('es-MX')}`}
                            color={seg.color}
                        />
                    ))}
                </View>
            </View>

            <Text style={styles.sectionTitle}>Últimos ingresos</Text>
            {MOCK_INCOME.slice(0, 5).map((item) => {
                const typeCfg = INCOME_TYPE_COLORS[item.type];
                return (
                    <View key={item.id} style={styles.itemRow}>
                        <View style={[styles.typeBadge, { backgroundColor: typeCfg.bg }]}>
                            <Text style={[styles.typeLabel, { color: typeCfg.fill }]}>{typeCfg.label.slice(0, 2)}</Text>
                        </View>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemDesc}>{item.description}</Text>
                            <Text style={styles.itemDate}>{item.date}</Text>
                        </View>
                        <Text style={styles.itemAmount}>+${item.amount.toLocaleString('es-MX')}</Text>
                    </View>
                );
            })}

            {MOCK_INCOME.length > 5 && (
                <TouchableOpacity onPress={handleChartPress} style={styles.seeAll}>
                    <Text style={styles.seeAllText}>Ver más ({MOCK_INCOME.length - 5})</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E8EDF5',
        padding: 16,
        gap: 12,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(59,123,255,0.06)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 14,
            },
            android: { elevation: 2 },
        }),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
    chartRow: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    legend: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 6,
    },
    typeBadge: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeLabel: {
        fontSize: 10,
        fontWeight: '700',
    },
    itemInfo: {
        flex: 1,
    },
    itemDesc: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0F172A',
    },
    itemDate: {
        fontSize: 11,
        color: '#94A3B8',
    },
    itemAmount: {
        fontSize: 13,
        fontWeight: '700',
        color: '#16A34A',
    },
    seeAll: {
        alignItems: 'center',
        paddingVertical: 6,
        borderTopWidth: 1,
        borderTopColor: '#E8EDF5',
        marginTop: 4,
    },
    seeAllText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3B7BFF',
    },
});
