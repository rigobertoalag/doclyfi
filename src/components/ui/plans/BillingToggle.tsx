import type { BillingPeriod } from '@/constants/plans';
import { PERIODS } from '@/constants/plans';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type BillingToggleProps = {
    value: BillingPeriod;
    onChange: (period: BillingPeriod) => void;
};

export function BillingToggle({ value, onChange }: BillingToggleProps) {
    return (
        <View style={styles.track}>
            {PERIODS.map((p) => {
                const active = p.key === value;
                return (
                    <TouchableOpacity
                        key={p.key}
                        style={[styles.pill, active && styles.pillActive]}
                        onPress={() => onChange(p.key)}
                        activeOpacity={0.75}
                    >
                        <Text style={[styles.label, active && styles.labelActive]}>
                            {p.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    track: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 3,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0,0.04)',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 1,
                shadowRadius: 3,
            },
            android: { elevation: 1 },
        }),
    },
    pill: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillActive: {
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0,0.08)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 6,
            },
            android: { elevation: 2 },
        }),
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#94A3B8',
    },
    labelActive: {
        color: '#0F172A',
    },
});
