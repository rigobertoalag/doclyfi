import { CATEGORY_COLORS, MOCK_GASTOS } from '@/modules/reports/mocks/reports';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ReportDonut } from './ReportDonut';
import { ReportPeriodPills } from './ReportPeriodPills';
import { ReportSummaryRow } from './ReportSummaryRow';

const PERIODS = [
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mes' },
    { key: '3months', label: '3 Meses' },
];

function filterByPeriod(items: typeof MOCK_GASTOS, period: string) {
    const now = new Date();
    const today = now.getDay();
    const diff = now.getDate() - today + (today === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    return items.filter((item) => {
        const d = new Date(item.date);
        if (period === 'week') return d >= monday;
        if (period === 'month') return d >= monthStart;
        return d >= threeMonthsAgo;
    });
}

export function GastosSection() {
    const [period, setPeriod] = useState('week');

    const filtered = useMemo(() => filterByPeriod(MOCK_GASTOS, period), [period]);
    const total = filtered.reduce((s, i) => s + i.amount, 0);
    const warrantyItems = filtered.filter((i) => i.hasWarranty);
    const warrantyTotal = warrantyItems.reduce((s, i) => s + i.amount, 0);

    const categoryTotals: Record<string, number> = {};
    filtered.forEach((item) => {
        categoryTotals[item.category] = (categoryTotals[item.category] ?? 0) + item.amount;
    });

    const segments = Object.entries(categoryTotals).map(([label, value]) => ({
        label,
        value,
        color: CATEGORY_COLORS[label]?.fill ?? '#94A3B8',
    }));

    const displayItems = filtered.slice(0, 5);

    const handleChartPress = () => {
        router.push({ pathname: '/(main)/reports/detail', params: { category: 'gastos', period, totalAmount: total, itemCount: filtered.length } });
    };

    const handleSeeAll = () => {
        router.push({ pathname: '/(main)/reports/detail', params: { category: 'gastos', period, totalAmount: total, itemCount: filtered.length } });
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={[styles.iconWrap, { backgroundColor: '#FFF7ED' }]}>
                    <Ionicons name="cart-outline" size={18} color="#C2410C" />
                </View>
                <Text style={styles.title}>Gastos y Facturación</Text>
            </View>

            <ReportPeriodPills periods={PERIODS} active={period} onSelect={setPeriod} />

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

            {warrantyTotal > 0 && (
                <View style={styles.warrantyBanner}>
                    <Ionicons name="shield-checkmark-outline" size={14} color="#3B7BFF" />
                    <Text style={styles.warrantyText}>
                        ${warrantyTotal.toLocaleString('es-MX')} en compras con garantía
                    </Text>
                </View>
            )}

            <Text style={styles.sectionTitle}>Últimos movimientos</Text>
            {displayItems.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                    <View style={[styles.itemDot, { backgroundColor: CATEGORY_COLORS[item.category]?.fill ?? '#94A3B8' }]} />
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.merchant}</Text>
                        <Text style={styles.itemDate}>{item.date}</Text>
                    </View>
                    {item.hasWarranty && (
                        <View style={styles.warrantyBadge}>
                            <Ionicons name="shield-checkmark" size={12} color="#3B7BFF" />
                        </View>
                    )}
                    <Text style={styles.itemAmount}>${item.amount.toLocaleString('es-MX')}</Text>
                </View>
            ))}
            {filtered.length > 5 && (
                <TouchableOpacity onPress={handleSeeAll} style={styles.seeAll}>
                    <Text style={styles.seeAllText}>Ver más ({filtered.length - 5})</Text>
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
    warrantyBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#EFF6FF',
        borderRadius: 10,
        padding: 10,
    },
    warrantyText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#3B7BFF',
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
    itemDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0F172A',
    },
    itemDate: {
        fontSize: 11,
        color: '#94A3B8',
    },
    warrantyBadge: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemAmount: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
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
