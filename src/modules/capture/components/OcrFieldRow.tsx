import type { OcrConfidence, OcrField } from '@/modules/capture/constants/config';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const CONFIDENCE_CONFIG: Record<OcrConfidence, { label: string; bg: string; color: string }> = {
    high: { label: 'Alta confianza', bg: '#F0FDF4', color: '#16A34A' },
    medium: { label: 'Confianza media', bg: '#FFFBEB', color: '#B45309' },
    low: { label: 'Baja confianza — Revisa', bg: '#FEF2F2', color: '#DC2626' },
};

type OcrFieldRowProps = {
    field: OcrField;
    isLast: boolean;
    onEdit: (id: string, newValue: string) => void;
};

export function OcrFieldRow({ field, isLast, onEdit }: OcrFieldRowProps) {
    const [editing, setEditing] = useState(false);
    const [localVal, setLocalVal] = useState(field.value);
    const conf = CONFIDENCE_CONFIG[field.confidence];

    const confirmEdit = () => {
        onEdit(field.id, localVal);
        setEditing(false);
    };

    return (
        <View style={[styles.row, !isLast && styles.rowBorder]}>
            <View style={[styles.icon, { backgroundColor: field.iconBg }]}>
                <Text style={styles.iconEmoji}>{field.icon}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>{field.label}</Text>

                {editing ? (
                    <TextInput
                        style={styles.input}
                        value={localVal}
                        onChangeText={setLocalVal}
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={confirmEdit}
                        onBlur={confirmEdit}
                    />
                ) : (
                    <Text style={styles.value} numberOfLines={1}>{localVal}</Text>
                )}

                <View style={[styles.confBadge, { backgroundColor: conf.bg }]}>
                    <Text style={[styles.confText, { color: conf.color }]}>{conf.label}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.editBtn, editing && styles.editBtnActive]}
                onPress={() => editing ? confirmEdit() : setEditing(true)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Ionicons
                    name={editing ? 'checkmark' : 'pencil'}
                    size={13}
                    color={editing ? '#16A34A' : '#94A3B8'}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row', alignItems: 'center',
        gap: 10, paddingVertical: 11, paddingHorizontal: 14,
    },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F8FAFF' },
    icon: {
        width: 32, height: 32, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    iconEmoji: { fontSize: 14 },
    content: { flex: 1, minWidth: 0, gap: 2 },
    label: { fontSize: 10, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.2 },
    value: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
    input: {
        fontSize: 13, fontWeight: '700', color: '#1E293B',
        borderBottomWidth: 1.5, borderBottomColor: '#3B7BFF',
        paddingVertical: 2, paddingHorizontal: 0,
    },
    confBadge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
    confText: { fontSize: 9, fontWeight: '700' },
    editBtn: {
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        backgroundColor: '#F8FAFF', borderWidth: 1, borderColor: '#E2E8F0',
        alignItems: 'center', justifyContent: 'center',
    },
    editBtnActive: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
});