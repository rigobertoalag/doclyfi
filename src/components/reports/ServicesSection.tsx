import { MOCK_SERVICES, SERVICE_CATEGORY_COLORS } from '@/mocks/reports';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ReportDonut } from './ReportDonut';
import { ReportSummaryRow } from './ReportSummaryRow';

export function ServicesSection() {
    const filtered = useMemo(() => {
        const months = [...new Set(MOCK_SERVICES.map((s) => s.month))].sort().slice(-2);
        return MOCK_SERVICES.filter((s) => months.includes(s.month));
    }, []);

    const paidTotal = filtered.filter((s) => s.status === 'paid').reduce((sum, s) => sum + s.amount, 0);
    const pendingTotal = filtered.filter((s) => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0);
    const total = paidTotal + pendingTotal;

    const categoryTotals: Record<string, number> = {};
    filtered.forEach((s) => {
        categoryTotals[s.category] = (categoryTotals[s.category] ?? 0) + s.amount;
    });

    const segments = Object.entries(categoryTotals).map(([label, value]) => ({
        label,
        value,
        color: SERVICE_CATEGORY_COLORS[label]?.fill ?? '#94A3B8',
    }));

    const handleChartPress = () => {
        router.push({ pathname: '/(main)/reports/detail', params: { category: 'services', period: '2m', totalAmount: total, itemCount: filtered.length } });
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={[styles.iconWrap, { backgroundColor: '#F0F9FF' }]}>
                    <Ionicons name="receipt-outline" size={18} color="#0EA5E9" />
                </View>
                <Text style={styles.title}>Pago de Servicios</Text>
            </View>

            <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Pagado</Text>
                    <Text style={[styles.summaryValue, { color: '#16A34A' }]}>${paidTotal.toLocaleString('es-MX')}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Pendiente</Text>
                    <Text style={[styles.summaryValue, { color: '#EF4444' }]}>${pendingTotal.toLocaleString('es-MX')}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total</Text>
                    <Text style={[styles.summaryValue, { color: '#0F172A' }]}>${total.toLocaleString('es-MX')}</Text>
                </View>
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

            <TouchableOpacity onPress={handleChartPress} style={styles.seeAll}>
                <Text style={styles.seeAllText}>Ver más</Text>
            </TouchableOpacity>
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
    summaryRow: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
        gap: 2,
    },
    summaryDivider: {
        width: 1,
        backgroundColor: '#E2E8F0',
    },
    summaryLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: '#94A3B8',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    chartRow: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    legend: {
        flex: 1,
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
