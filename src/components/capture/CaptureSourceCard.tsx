import type { CaptureSource } from '@/hooks/useDocumentCapture';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SOURCES = [
    { id: 'camera'  as CaptureSource, label: 'Cámara',  icon: 'camera-outline',         bg: '#EFF6FF', border: '#BFDBFE', color: '#2563EB' },
    { id: 'gallery' as CaptureSource, label: 'Galería', icon: 'image-outline',           bg: '#F0FDF4', border: '#BBF7D0', color: '#16A34A' },
    { id: 'pdf'     as CaptureSource, label: 'PDF',     icon: 'document-attach-outline', bg: '#FEF2F2', border: '#FECACA', color: '#DC2626' },
];

type CaptureSourceCardProps = {
    title: string;
    subtitle?: string;
    onSource: (id: CaptureSource) => void;
    illustration: React.ReactNode;  // cada pantalla pasa su propia ilustración
};

export function CaptureSourceCard({ title, subtitle, onSource, illustration }: CaptureSourceCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.left}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                <View style={styles.row}>
                    {SOURCES.map(src => (
                        <TouchableOpacity
                            key={src.id}
                            style={styles.srcBtn}
                            onPress={() => onSource(src.id)}
                            activeOpacity={0.75}
                        >
                            <View style={[styles.srcIcon, { backgroundColor: src.bg, borderColor: src.border }]}>
                                <Ionicons name={src.icon as any} size={20} color={src.color} />
                            </View>
                            <Text style={styles.srcLabel}>{src.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {illustration}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1,
        borderColor: '#E8EDF5', padding: 14,
        flexDirection: 'row', alignItems: 'flex-start', gap: 12,
        ...Platform.select({
            ios: { shadowColor: 'rgba(59,123,255,0.07)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 14 },
            android: { elevation: 3 },
        }),
    },
    left: { flex: 1 },
    title: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 3 },
    subtitle: { fontSize: 11, color: '#94A3B8', marginBottom: 14, lineHeight: 15 },
    row: { flexDirection: 'row', gap: 10 },
    srcBtn: { alignItems: 'center', gap: 5 },
    srcIcon: {
        width: 44, height: 44, borderRadius: 13, borderWidth: 1,
        alignItems: 'center', justifyContent: 'center',
        ...Platform.select({
            ios: { shadowColor: 'rgba(0,0,0,0.08)', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 8 },
            android: { elevation: 2 },
        }),
    },
    srcLabel: { fontSize: 10, fontWeight: '600', color: '#64748B' },
});