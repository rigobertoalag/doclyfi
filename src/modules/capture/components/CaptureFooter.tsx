import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type FooterAction = {
    label: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    color?: string;
    onPress: () => void;
};

type CaptureFooterProps = {
    // CTA principal
    ctaLabel: string;
    ctaSubLabel: string;
    ctaIcon: React.ComponentProps<typeof Ionicons>['name'];
    ctaColor: string;
    onCtaPress: () => void;
    // Acciones secundarias (máx 2)
    secondaryActions: [FooterAction, FooterAction];
    // Acción destructiva
    onDiscard: () => void;
    discardLabel?: string;
};

export function CaptureFooter({
    ctaLabel, ctaSubLabel, ctaIcon, ctaColor, onCtaPress,
    secondaryActions,
    onDiscard, discardLabel = 'Descartar',
}: CaptureFooterProps) {
    return (
        <View style={styles.footer}>
            <TouchableOpacity
                style={[styles.btnPrimary, { backgroundColor: ctaColor }]}
                onPress={onCtaPress}
                activeOpacity={0.82}
            >
                <View style={styles.btnPrimaryIconWrap}>
                    <Ionicons name={ctaIcon} size={20} color="#FFF" />
                </View>
                <View style={styles.btnPrimaryTextWrap}>
                    <Text style={styles.btnPrimaryLabel}>{ctaLabel}</Text>
                    <Text style={styles.btnPrimarySub}>{ctaSubLabel}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>

            <View style={styles.secondaryRow}>
                {secondaryActions.map((action) => (
                    <TouchableOpacity
                        key={action.label}
                        style={styles.btnSecondary}
                        onPress={action.onPress}
                        activeOpacity={0.8}
                    >
                        <Ionicons name={action.icon} size={14} color={action.color ?? '#64748B'} />
                        <Text style={[styles.btnSecondaryText, action.color ? { color: action.color } : null]}>
                            {action.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.btnGhost} onPress={onDiscard} activeOpacity={0.7}>
                <Ionicons name="trash-outline" size={14} color="#DC2626" />
                <Text style={styles.btnGhostText}>{discardLabel}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1, borderTopColor: '#E8EDF5',
        padding: 14, gap: 8,
        position: 'absolute', bottom: 15, left: 10, right: 10,
        borderRadius: 20,
        ...Platform.select({
            ios: { shadowColor: 'rgba(0,0,0,0.1)', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 1, shadowRadius: 16 },
            android: { elevation: 10 },
        }),
    },
    btnPrimary: {
        height: 62, borderRadius: 16, flexDirection: 'row',
        alignItems: 'center', paddingHorizontal: 16, gap: 12,
    },
    btnPrimaryIconWrap: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    btnPrimaryTextWrap: { flex: 1 },
    btnPrimaryLabel: { fontSize: 15, fontWeight: '800', color: '#FFF', letterSpacing: -0.2 },
    btnPrimarySub: { fontSize: 11, color: 'rgba(255,255,255,0.72)', marginTop: 1 },
    secondaryRow: { flexDirection: 'row', gap: 8 },
    btnSecondary: {
        flex: 1, height: 42, borderRadius: 12,
        backgroundColor: '#F8FAFF', borderWidth: 1.5, borderColor: '#E2E8F0',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    },
    btnSecondaryText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
    btnGhost: {
        height: 36, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center', gap: 5,
    },
    btnGhostText: { fontSize: 12, fontWeight: '600', color: '#DC2626' },
});