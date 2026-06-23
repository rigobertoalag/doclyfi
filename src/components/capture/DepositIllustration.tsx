import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export function DepositIllustration() {
    return (
        <View style={styles.wrap}>
            <View style={styles.card}>

                {/* Scanner corners */}
                <View style={styles.cornerTL} />
                <View style={styles.cornerBR} />

                {/* Header voucher */}
                <View style={styles.voucherHeader}>
                    <Ionicons name="business-outline" size={12} color="#10ad47" />
                    <Text style={styles.voucherTitle}>DEPÓSITO</Text>
                </View>

                <Text style={styles.date}>10 MAY 2024</Text>
                <View style={styles.divider} />

                {[
                    ['Banco', 'Santander'],
                    ['Ref.', '12345678'],
                    ['De', 'Dr. Juan P.'],
                    ['Para', 'Andrea L.'],
                ].map(([k, v]) => (
                    <View key={k} style={styles.row}>
                        <Text style={styles.rowKey}>{k}</Text>
                        <Text style={styles.rowVal}>{v}</Text>
                    </View>
                ))}

                <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>Monto</Text>
                    <Text style={styles.amountVal}>$15,000</Text>
                </View>

                {/* Deposited badge */}
                <View style={styles.badge}>
                    <Ionicons name="checkmark-circle" size={9} color="#16A34A" />
                    <Text style={styles.badgeText}>Depósito recibido</Text>
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
        borderColor: '#E9D5FF',
        padding: 7,
        position: 'relative',
        overflow: 'hidden',
        ...Platform.select({
            ios: { shadowColor: 'rgba(124,58,237,0.15)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 10 },
            android: { elevation: 4 },
        }),
    },
    cornerTL: { position: 'absolute', top: 4, left: 4, width: 10, height: 10, borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#16A34A', borderRadius: 2 },
    cornerBR: { position: 'absolute', bottom: 4, right: 4, width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#16A34A', borderRadius: 2 },
    voucherHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        marginBottom: 2,
    },
    voucherTitle: { fontSize: 9, fontWeight: '800', color: '#10ad47', letterSpacing: 0.5 },
    date: { fontSize: 6, color: '#94A3B8', textAlign: 'center', marginBottom: 4 },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 3 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    rowKey: { fontSize: 6, color: '#94A3B8' },
    rowVal: { fontSize: 6, fontWeight: '600', color: '#1E293B' },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        paddingTop: 3,
        borderTopWidth: 1,
        borderTopColor: '#E9D5FF',
        borderStyle: 'dashed',
    },
    amountLabel: { fontSize: 7, fontWeight: '700', color: '#0F172A' },
    amountVal: { fontSize: 8, fontWeight: '800', color: '#10ad47' },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        marginTop: 6,
        backgroundColor: '#F0FDF4',
        borderRadius: 6,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    badgeText: { fontSize: 7, fontWeight: '700', color: '#16A34A' },
});
