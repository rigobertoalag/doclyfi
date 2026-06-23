import type { Feature } from '@/constants/plans';
import type { PlanId } from '@/constants/plans';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PLAN_ORDER: PlanId[] = ['free', 'premium', 'premium_plus'];

type FeatureRowProps = {
    feature: Feature;
    index: number;
};

export function FeatureRow({ feature, index }: FeatureRowProps) {
    return (
        <View style={[styles.row, index % 2 === 0 && styles.rowAlt]}>
            <Text style={styles.label} numberOfLines={3}>
                {feature.label}
            </Text>
            <View style={styles.checks}>
                {PLAN_ORDER.map((pid) => (
                    <Text key={pid} style={[styles.check, feature.values[pid] ? styles.checkYes : styles.checkNo]}>
                        {feature.values[pid] ? '✓' : '✗'}
                    </Text>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4,
        gap: 8,
    },
    rowAlt: {
        backgroundColor: '#FAFBFF',
        borderRadius: 8,
    },
    label: {
        flex: 1,
        fontSize: 11,
        color: '#334155',
        fontWeight: '500',
        lineHeight: 16,
    },
    checks: {
        flexDirection: 'row',
        gap: 4,
        width: 82,
        justifyContent: 'flex-end',
    },
    check: {
        width: 24,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '700',
    },
    checkYes: {
        color: '#16A34A',
    },
    checkNo: {
        color: '#CBD5E1',
    },
});
