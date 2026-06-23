import { ContractsSection, GastosSection, IncomeSection, ServicesSection } from '@/components/reports';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportsScreen() {
    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeIn.duration(400)}>
                <View style={styles.header}>
                    <Text style={styles.title}>Reportes</Text>
                    <Text style={styles.subtitle}>Visualiza tus estadísticas y reportes financieros</Text>
                </View>

                <GastosSection />
                <ServicesSection />
                <IncomeSection />
                <ContractsSection />
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F8FAFF',
    },
    content: {
        padding: 20,
        gap: 16,
        paddingBottom: 32,
    },
    header: {
        gap: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 17,
    },
});
