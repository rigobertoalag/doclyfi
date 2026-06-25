import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ProUpsellBannerProps = {
    onPress: () => void;
};

export function ProUpsellBanner({ onPress }: ProUpsellBannerProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.crown}>👑</Text>

            <View style={styles.textCol}>
                <Text style={styles.title}>Sube a <Text style={styles.proHighlight}>Pro</Text></Text>
                <Text style={styles.subtitle}>Desbloquea funciones exclusivas</Text>
            </View>

            <TouchableOpacity style={styles.cta} onPress={onPress} activeOpacity={0.8}>
                <Text style={styles.ctaText}>Ver planes</Text>
                <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#1E1B4B',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#312E81',
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(30, 27, 75, 0.4)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 12,
            },
            android: { elevation: 4 },
        }),
    },
    crown: {
        fontSize: 22,
    },
    textCol: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -0.2,
    },
    proHighlight: {
        color: '#F59E0B',
    },
    subtitle: {
        fontSize: 11,
        color: '#A5B4FC',
        marginTop: 1,
    },
    cta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 10,
    },
    ctaText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
