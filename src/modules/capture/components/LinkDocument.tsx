import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Platform, StyleSheet, Text,
    TouchableOpacity, View,
} from 'react-native';

export type LinkedDocument = {
    id: string;
    name: string;
    type: string;
    typeLabel: string;
};

type LinkDocumentProps = {
    linked: LinkedDocument | null;
    onLink: () => void;       // abre el selector de documentos
    onUnlink: () => void;
    accentColor?: string;
};

export function LinkDocument({
    linked,
    onLink,
    onUnlink,
    accentColor = '#3B7BFF',
}: LinkDocumentProps) {
    const accentBg     = `${accentColor}10`;
    const accentBorder = `${accentColor}30`;

    // ── Sin documento vinculado ───────────────────────────────────────────────
    if (!linked) {
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={onLink}
                activeOpacity={0.75}
            >
                <View style={styles.left}>
                    <View style={styles.iconWrap}>
                        <Ionicons name="link-outline" size={18} color="#94A3B8" />
                    </View>
                    <View style={styles.textWrap}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>Vincular con otro documento</Text>
                            <View style={styles.optionalBadge}>
                                <Text style={styles.optionalText}>opcional</Text>
                            </View>
                        </View>
                        <Text style={styles.subtitle}>
                            Relaciona este ticket con otro ticket o factura.
                        </Text>
                    </View>
                </View>

                <View style={[styles.linkBtn, { backgroundColor: accentBg, borderColor: accentBorder }]}>
                    <Ionicons name="link" size={13} color={accentColor} />
                    <Text style={[styles.linkBtnText, { color: accentColor }]}>Vincular</Text>
                </View>

                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </TouchableOpacity>
        );
    }

    // ── Con documento vinculado ───────────────────────────────────────────────
    return (
        <View style={[styles.card, styles.cardLinked, { borderColor: accentBorder }]}>
            <View style={styles.left}>
                <View style={[styles.iconWrap, { backgroundColor: accentBg }]}>
                    <Ionicons name="link" size={18} color={accentColor} />
                </View>
                <View style={styles.textWrap}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>Documento vinculado</Text>
                        <View style={[styles.linkedBadge, { backgroundColor: accentBg, borderColor: accentBorder }]}>
                            <View style={[styles.linkedDot, { backgroundColor: accentColor }]} />
                            <Text style={[styles.linkedBadgeText, { color: accentColor }]}>
                                Vinculado
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.subtitle} numberOfLines={1}>
                        {linked.name}
                    </Text>
                    <Text style={styles.linkedType}>{linked.typeLabel}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.unlinkBtn}
                onPress={onUnlink}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Ionicons name="close-circle" size={20} color="#CBD5E1" />
            </TouchableOpacity>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E8EDF5',
        padding: 14,
        marginVertical:10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(59,123,255,0.06)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 8,
            },
            android: { elevation: 2 },
        }),
    },
    cardLinked: {
        borderWidth: 1.5,
    },
    left: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        minWidth: 0,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F8FAFF',
        borderWidth: 1,
        borderColor: '#E8EDF5',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    textWrap: {
        flex: 1,
        minWidth: 0,
        gap: 2,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
    },
    title: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
        letterSpacing: -0.1,
    },
    subtitle: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '400',
        lineHeight: 15,
    },

    // Optional badge
    optionalBadge: {
        backgroundColor: '#F1F5F9',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    optionalText: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '500',
    },

    // Link button (estado vacío)
    linkBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        flexShrink: 0,
    },
    linkBtnText: {
        fontSize: 12,
        fontWeight: '700',
    },

    // Linked state
    linkedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 20,
        borderWidth: 1,
    },
    linkedDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
    },
    linkedBadgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    linkedType: {
        fontSize: 10,
        color: '#CBD5E1',
        fontWeight: '500',
        marginTop: 1,
    },
    unlinkBtn: {
        flexShrink: 0,
        padding: 2,
    },
});