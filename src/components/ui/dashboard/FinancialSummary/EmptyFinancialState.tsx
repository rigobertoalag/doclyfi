import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export function EmptyFinancialState() {
    return (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
                <Ionicons name="bar-chart-outline" size={28} color="#3B7BFF" />
            </View>
            <Text style={styles.emptyTitle}>Sin movimientos aún</Text>
            <Text style={styles.emptySub}>
                Sube tus primeros tickets, facturas o comprobantes para ver tu resumen financiero.
            </Text>
            <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => router.push('/(main)/documents')}
                activeOpacity={0.85}
            >
                <Ionicons name="add" size={15} color="#FFFFFF" />
                <Text style={styles.emptyBtnText}>Subir primer documento</Text>
            </TouchableOpacity>
        </View>
    );
}
