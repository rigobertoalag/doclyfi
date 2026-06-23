import { OcrFieldRow } from '@/components/ui/capture/OcrFieldRow';
import type { OcrField } from '@/constants/config';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

type OcrInfoCardProps = {
    fields: OcrField[];
    onEdit: (id: string, value: string) => void;
};

export function OcrInfoCard({ fields, onEdit }: OcrInfoCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Información detectada</Text>
                <View style={styles.badge}>
                    <View style={styles.badgeDot} />
                    <Text style={styles.badgeText}>OCR completado</Text>
                </View>
            </View>

            {fields.map((field, idx) => (
                <OcrFieldRow
                    key={field.id}
                    field={field}
                    isLast={idx === fields.length - 1}
                    onEdit={onEdit}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E8EDF5',
        overflow: 'hidden',
        ...Platform.select({
            ios: { shadowColor: 'rgba(59,123,255,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8 },
            android: { elevation: 2 },
        }),
    },
    header: {
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFF',
    },
    title: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F0FDF4',
        borderWidth: 1,
        borderColor: '#BBF7D0',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    badgeDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#16A34A',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#16A34A',
    },
});