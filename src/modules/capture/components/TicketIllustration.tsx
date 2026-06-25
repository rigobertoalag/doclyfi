import type { PurchaseType } from '@/modules/capture/constants/config';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

type TicketIllustrationProps = {
    type: PurchaseType;
    accentColor: string;
};

const TICKET_DATA: Record<PurchaseType, { store: string; total: string }> = {
    warranty:   { store: 'MEDIA MARKT', total: '$12,499' },
    no_warranty: { store: 'TIENDA ABC',  total: '$3,599'  },
};

export function TicketIllustration({ type, accentColor }: TicketIllustrationProps) {
    const data = TICKET_DATA[type];
    const date = new Date()
        .toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
        .toUpperCase()
        .replace('.', '');

    return (
        <View style={styles.wrap}>
            <View style={[styles.card, { borderColor: `${accentColor}30` }]}>

                {/* Scanner corners */}
                <View style={[styles.cornerTL, { borderColor: accentColor }]} />
                <View style={[styles.cornerBR, { borderColor: accentColor }]} />

                {/* Warranty stamp */}
                {type === 'warranty' && (
                    <View style={[styles.stamp, { backgroundColor: accentColor }]}>
                        <Text style={styles.stampText}>✓ GAR</Text>
                    </View>
                )}

                <Text style={styles.store}>{data.store}</Text>
                <Text style={styles.date}>{date}</Text>

                <View style={styles.divider} />

                {[['Producto 1', '$499'], ['Producto 2', '$1,200']].map(([name, val]) => (
                    <View key={name} style={styles.item}>
                        <Text style={styles.itemName}>{name}</Text>
                        <Text style={styles.itemVal}>{val}</Text>
                    </View>
                ))}

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={[styles.totalVal, { color: accentColor }]}>{data.total}</Text>
                </View>

                {/* Barcode */}
                <View style={styles.barcode}>
                    {[16,12,16,10,14,16,10,16,12,14,16,10,14,16,12,16,10,14,16,12].map((h, i) => (
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
        padding: 8,
        position: 'relative',
        overflow: 'hidden',
        ...Platform.select({
            ios: { shadowColor: 'rgba(0,0,0,0.12)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 10 },
            android: { elevation: 4 },
        }),
    },
    cornerTL: { position: 'absolute', top: 4, left: 4, width: 12, height: 12, borderTopWidth: 2, borderLeftWidth: 2, borderRadius: 2 },
    cornerBR: { position: 'absolute', bottom: 4, right: 4, width: 12, height: 12, borderBottomWidth: 2, borderRightWidth: 2, borderRadius: 2 },
    stamp: { position: 'absolute', top: -1, right: -1, borderBottomLeftRadius: 6, paddingHorizontal: 5, paddingVertical: 2 },
    stampText: { fontSize: 7, fontWeight: '800', color: '#FFFFFF' },
    store: { fontSize: 9, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 2, letterSpacing: 0.3 },
    date: { fontSize: 7, color: '#94A3B8', textAlign: 'center', marginBottom: 5 },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },
    item: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    itemName: { fontSize: 7, color: '#64748B' },
    itemVal: { fontSize: 7, fontWeight: '600', color: '#0F172A' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#E2E8F0', borderStyle: 'dashed' },
    totalLabel: { fontSize: 8, fontWeight: '700', color: '#0F172A' },
    totalVal: { fontSize: 9, fontWeight: '800' },
    barcode: { flexDirection: 'row', justifyContent: 'center', gap: 1.5, marginTop: 6, paddingTop: 5, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    bar: { width: 1.5, backgroundColor: '#1E293B', borderRadius: 1 },
});