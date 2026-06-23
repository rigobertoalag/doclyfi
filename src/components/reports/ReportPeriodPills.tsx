import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Period = {
    key: string;
    label: string;
};

type ReportPeriodPillsProps = {
    periods: Period[];
    active: string;
    onSelect: (key: string) => void;
};

export function ReportPeriodPills({ periods, active, onSelect }: ReportPeriodPillsProps) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
            {periods.map((p) => {
                const isActive = p.key === active;
                return (
                    <TouchableIndicator
                        key={p.key}
                        onPress={() => onSelect(p.key)}
                        active={isActive}
                        label={p.label}
                    />
                );
            })}
        </ScrollView>
    );
}

function TouchableIndicator({ onPress, active, label }: { onPress: () => void; active: boolean; label: string }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.pill, active && styles.pillActive]}
            activeOpacity={0.7}
        >
            <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 4,
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    pillActive: {
        backgroundColor: '#3B7BFF',
        borderColor: '#3B7BFF',
    },
    pillText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    pillTextActive: {
        color: '#FFFFFF',
    },
});
