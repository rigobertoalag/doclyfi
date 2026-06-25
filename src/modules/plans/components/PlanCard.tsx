import type { BillingPeriod, Plan } from '@/modules/plans/constants/plans';
import { formatPrice } from '@/modules/plans/constants/plans';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PlanCardProps = {
    plan: Plan;
    period: BillingPeriod;
    isCurrent?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
};

export function PlanCard({ plan, period, isCurrent, isSelected, onSelect }: PlanCardProps) {
    const price = plan.prices[period];
    const isFree = plan.id === 'free';

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    borderColor: isSelected ? plan.color : plan.border,
                    backgroundColor: isFree && !isSelected ? '#FAFAFA' : '#FFFFFF',
                },
                isSelected && { shadowColor: plan.shadow },
            ]}
            onPress={onSelect}
            activeOpacity={0.85}
            disabled={isCurrent}
        >
            {plan.recommended && !isCurrent && (
                <View style={[styles.recommendedBadge, { backgroundColor: '#F59E0B' }]}>
                    <Text style={styles.recommendedText}>RECOMENDADO</Text>
                </View>
            )}

            {isCurrent && (
                <View style={[styles.currentBadge, { backgroundColor: plan.color }]}>
                    <Text style={styles.currentText}>PLAN ACTUAL</Text>
                </View>
            )}

            <Text style={styles.icon}>{plan.icon}</Text>
            <Text style={[styles.name, { color: plan.color }]}>{plan.name}</Text>

            {price !== null ? (
                <Text style={[styles.price, { color: plan.color }]}>
                    {formatPrice(price)}
                </Text>
            ) : (
                <Text style={styles.na}>—</Text>
            )}

            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{plan.docs.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>docs.</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: plan.border }]} />
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{plan.storage}</Text>
                    <Text style={styles.statLabel}>espacio</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 160,
        borderRadius: 18,
        borderWidth: 1.5,
        padding: 16,
        alignItems: 'center',
        gap: 6,
        position: 'relative',
        overflow: 'visible',
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
            },
            android: { elevation: 4 },
        }),
    },
    recommendedBadge: {
        position: 'absolute',
        top: -10,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
    },
    recommendedText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    currentBadge: {
        position: 'absolute',
        top: -10,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
    },
    currentText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    icon: {
        fontSize: 28,
        marginTop: 4,
    },
    name: {
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
    },
    na: {
        fontSize: 15,
        fontWeight: '600',
        color: '#CBD5E1',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    stat: {
        alignItems: 'center',
        gap: 1,
    },
    statValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
    },
    statLabel: {
        fontSize: 9,
        color: '#94A3B8',
        fontWeight: '500',
    },
    statDivider: {
        width: 1,
        height: 24,
    },
});
