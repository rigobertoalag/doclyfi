import { MOCK_CONTRACTS } from '@/mocks/reports';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ReportDonut } from './ReportDonut';

function formatDate(iso: string): string {
    try {
        const d = new Date(iso);
        const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
        return iso;
    }
}

export function ContractsSection() {
    const { totalPaid, totalPending, totalAmount, contracts } = useMemo(() => {
        let paid = 0;
        let pending = 0;
        MOCK_CONTRACTS.forEach((c) => {
            c.installments.forEach((inst) => {
                if (inst.status === 'paid') paid += inst.amount;
                else pending += inst.amount;
            });
        });
        return { totalPaid: paid, totalPending: pending, totalAmount: paid + pending, contracts: MOCK_CONTRACTS };
    }, []);

    const segments = [
        { label: 'Pagado', value: totalPaid, color: '#16A34A' },
        { label: 'Pendiente', value: totalPending, color: '#EF4444' },
    ];

    const handleChartPress = () => {
        router.push({ pathname: '/(main)/reports/detail', params: { category: 'contracts', totalAmount, itemCount: contracts.length } });
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={[styles.iconWrap, { backgroundColor: '#FDF4FF' }]}>
                    <Ionicons name="document-text-outline" size={18} color="#7C3AED" />
                </View>
                <Text style={styles.title}>Contratos</Text>
            </View>

            <View style={styles.chartRow}>
                <ReportDonut
                    segments={segments}
                    centerValue={`$${(totalAmount / 1000).toFixed(1)}k`}
                    centerLabel="Total"
                    onPress={handleChartPress}
                />
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: '#16A34A' }]} />
                        <Text style={styles.legendLabel}>Pagado</Text>
                        <Text style={styles.legendValue}>${totalPaid.toLocaleString('es-MX')}</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                        <Text style={styles.legendLabel}>Pendiente</Text>
                        <Text style={styles.legendValue}>${totalPending.toLocaleString('es-MX')}</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Contratos activos</Text>
            {contracts.map((c) => {
                const cPaid = c.installments.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
                const pct = c.totalAmount > 0 ? (cPaid / c.totalAmount) * 100 : 0;
                const nextPending = c.installments.find((i) => i.status === 'pending');
                return (
                    <View key={c.id} style={styles.contractRow}>
                        <View style={styles.contractInfo}>
                            <Text style={styles.contractName}>{c.name}</Text>
                            <Text style={styles.contractParty}>{c.counterparty}</Text>
                        </View>
                        <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: `${pct}%` }]} />
                        </View>
                        <View style={styles.contractMeta}>
                            <Text style={styles.contractAmount}>${cPaid.toLocaleString('es-MX')} / ${c.totalAmount.toLocaleString('es-MX')}</Text>
                            {nextPending && (
                                <Text style={styles.contractNext}>Próximo: {formatDate(nextPending.dueDate)}</Text>
                            )}
                        </View>
                    </View>
                );
            })}

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
    chartRow: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    legend: {
        flex: 1,
        gap: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendLabel: {
        flex: 1,
        fontSize: 13,
        fontWeight: '500',
        color: '#475569',
    },
    legendValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    contractRow: {
        gap: 4,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    contractInfo: {
        gap: 2,
    },
    contractName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0F172A',
    },
    contractParty: {
        fontSize: 11,
        color: '#94A3B8',
    },
    progressTrack: {
        height: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#7C3AED',
        borderRadius: 3,
    },
    contractMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contractAmount: {
        fontSize: 11,
        fontWeight: '600',
        color: '#475569',
    },
    contractNext: {
        fontSize: 11,
        color: '#F59E0B',
        fontWeight: '600',
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
