import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ReportSummaryRowProps = {
    label: string;
    value: string;
    color: string;
    right?: React.ReactNode;
};

export function ReportSummaryRow({ label, value, color, right }: ReportSummaryRowProps) {
    return (
        <View style={styles.row}>
            <View style={styles.left}>
                <View style={[styles.dot, { backgroundColor: color }]} />
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={styles.right}>
                <Text style={styles.value}>{value}</Text>
                {right}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: '#475569',
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    value: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0F172A',
    },
});
