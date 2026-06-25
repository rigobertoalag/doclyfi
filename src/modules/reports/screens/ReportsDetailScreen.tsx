import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportsDetailScreen() {
    const { category } = useLocalSearchParams<{ category: string }>();

    const titles: Record<string, string> = {
        gastos: 'Gastos y Facturación',
        services: 'Pago de Servicios',
        income: 'Ingresos',
        contracts: 'Contratos',
    };

    const title = titles[category ?? ''] ?? 'Detalle';

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={22} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.backButton} />
            </View>
            <View style={styles.body}>
                <Ionicons name="construct-outline" size={48} color="#94A3B8" />
                <Text style={styles.heading}>En desarrollo</Text>
                <Text style={styles.subtext}>Esta sección estará disponible próximamente.</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F8FAFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F5F9',
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0F172A',
    },
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingHorizontal: 32,
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },
    subtext: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
    },
});
