import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

type PartialDataBannerProps = {
    missingType: 'income' | 'expense';
};

export function PartialDataBanner({ missingType }: PartialDataBannerProps) {
    const config = {
        income: {
            icon:  'arrow-up-circle-outline' as const,
            color: '#16A34A',
            bg:    '#F0FDF4',
            border:'#BBF7D0',
            text:  'Agrega depósitos o comprobantes de ingreso para ver tu balance neto completo.',
            cta:   'Agregar ingresos',
            route: '/deposit',
        },
        expense: {
            icon:  'arrow-down-circle-outline' as const,
            color: '#DC2626',
            bg:    '#FEF2F2',
            border:'#FECACA',
            text:  'Agrega tickets o recibos de gasto para ver tu balance neto completo.',
            cta:   'Agregar gastos',
            route: '/purchase',
        },
    }[missingType];

    return (
        <View style={[styles.banner, { backgroundColor: config.bg, borderColor: config.border }]}>
            <Ionicons name={config.icon} size={16} color={config.color} style={{ flexShrink: 0, marginTop: 1 }} />
            <View style={styles.bannerContent}>
                <Text style={[styles.bannerText, { color: config.color }]}>
                    {config.text}
                </Text>
                <TouchableOpacity
                    onPress={() => router.push(config.route as any)}
                    activeOpacity={0.75}
                >
                    <Text style={[styles.bannerCta, { color: config.color }]}>
                        {config.cta} →
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
