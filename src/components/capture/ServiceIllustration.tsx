import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export function ServiceIllustration() {
    return (
        <View style={styles.wrap}>
            <View style={styles.card}>

                {/* Scanner corners */}
                <View style={styles.cornerTL} />
                <View style={styles.cornerBR} />

                {/* Header */}
                <View style={styles.voucherHeader}>
                    <Ionicons name="flash-outline" size={10} color="#F59E0B" />
                    <Text style={styles.voucherTitle}>CFE</Text>
                </View>
                <Text style={styles.voucherSub}>Comisión Federal{'\n'}de Electricidad</Text>

                <View style={styles.divider} />

                {[
                    ['Servicio', 'Luz'],
                    ['Periodo',  'MAR 2026'],
                    ['Cuenta',  '123-456-78'],
                    ['Vence',   '05 ABR 2026'],
                ].map(([k, v]) => (
                    <View key={k} style={styles.row}>
                        <Text style={styles.rowKey}>{k}</Text>
                        <Text style={styles.rowVal}>{v}</Text>
                    </View>
                ))}

                <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>Total a pagar</Text>
                    <Text style={styles.amountVal}>$1,250.00</Text>
                </View>

                {/* Status badge */}
                <View style={styles.badge}>
                    <Ionicons name="time-outline" size={9} color="#D97706" />
                    <Text style={styles.badgeText}>Pendiente de pago</Text>
                </View>

                {/* Barcode */}
                <View style={styles.barcode}>
                    {[13,9,13,8,11,13,8,13,9,11,13,8,11,13,9,13].map((h, i) => (
                        <View key={i} style={[styles.bar, { height: h }]} />
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { width: 96, flexShrink: 0 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FDE68A',
        padding: 7,
        position: 'relative',
        overflow: 'hidden',
        gap: 2,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(245,158,11,0.18)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 10,
            },
            android: { elevation: 4 },
        }),
    },

    // Scanner corners — azul de Doclyfi
    cornerTL: {
        position: 'absolute', top: 4, left: 4,
        width: 10, height: 10,
        borderTopWidth: 2, borderLeftWidth: 2,
        borderColor: '#3B7BFF', borderRadius: 2,
    },
    cornerBR: {
        position: 'absolute', bottom: 4, right: 4,
        width: 10, height: 10,
        borderBottomWidth: 2, borderRightWidth: 2,
        borderColor: '#3B7BFF', borderRadius: 2,
    },

    // Header provider
    voucherHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
    },
    voucherTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#F59E0B',
        letterSpacing: 0.5,
    },
    voucherSub: {
        fontSize: 6,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 9,
        marginTop: -1,
    },

    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 3 },

    row: { flexDirection: 'row', justifyContent: 'space-between' },
    rowKey: { fontSize: 6, color: '#94A3B8' },
    rowVal: { fontSize: 6, fontWeight: '600', color: '#1E293B' },

    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        paddingTop: 3,
        borderTopWidth: 1,
        borderTopColor: '#FDE68A',
        borderStyle: 'dashed',
    },
    amountLabel: { fontSize: 7, fontWeight: '700', color: '#0F172A' },
    amountVal: { fontSize: 8, fontWeight: '800', color: '#F59E0B' },

    // Status badge
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        backgroundColor: '#FFFBEB',
        borderRadius: 6,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    badgeText: { fontSize: 7, fontWeight: '700', color: '#D97706' },

    // Barcode
    barcode: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 1.5,
        marginTop: 4,
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    bar: { width: 1.5, backgroundColor: '#1E293B', borderRadius: 1 },
});