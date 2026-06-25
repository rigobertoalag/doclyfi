import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

type ProfileStatCardProps = {
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    label: string;
    color?: string;
};

export function ProfileStatCard({ icon, value, label, color = '#3B7BFF' }: ProfileStatCardProps) {
    return (
        <View style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
                <Ionicons name={icon} size={18} color={color} />
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#E8EDF5',
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(59,123,255,0.05)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 8,
            },
            android: { elevation: 1 },
        }),
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    value: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        color: '#94A3B8',
        textAlign: 'center',
    },
});
