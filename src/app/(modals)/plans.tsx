import { CaptureHeader } from '@/components/capture/CaptureHeader';
import { BillingToggle } from '@/components/ui/plans/BillingToggle';
import { FeatureRow } from '@/components/ui/plans/FeatureRow';
import { PlanCard } from '@/components/ui/plans/PlanCard';
import type { BillingPeriod, PlanId } from '@/constants/plans';
import { FEATURE_CATEGORIES, PLANS, formatPeriodLabel } from '@/constants/plans';
import { useAuthContext } from '../../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlansScreen() {
    const { user } = useAuthContext();
    const isPro = user?.plan === 'premium' || user?.plan === 'premium_plus';

    const [period, setPeriod] = useState<BillingPeriod>('semesterly');
    const [selectedPlan, setSelectedPlan] = useState<PlanId>(isPro ? user!.plan as PlanId : 'premium');

    const currentPlanId = user?.plan as PlanId | undefined;

    const handleStart = () => {
        Alert.alert(
            'Próximamente',
            'Los planes estarán disponibles pronto. Te notificaremos cuando puedas suscribirte.',
        );
    };

    if (isPro) {
        const plan = PLANS.find(p => p.id === user?.plan);
        return (
            <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
                <CaptureHeader onBack={() => router.dismiss()} />
                <View style={styles.currentContainer}>
                    <View style={styles.currentCard}>
                        <Text style={styles.currentIcon}>{plan?.icon ?? '👑'}</Text>
                        <Text style={[styles.currentTitle, { color: plan?.color ?? '#3B7BFF' }]}>
                            Ya disfrutas de <Text style={styles.currentBold}>{plan?.name}</Text>
                        </Text>
                        <Text style={styles.currentSub}>
                            Sigue aprovechando todas las funciones exclusivas de tu plan.
                        </Text>
                        <TouchableOpacity
                            style={[styles.currentBtn, { backgroundColor: plan?.color ?? '#3B7BFF' }]}
                            onPress={() => router.dismiss()}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
                            <Text style={styles.currentBtnText}>Volver al inicio</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <CaptureHeader onBack={() => router.dismiss()} />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.heading}>Planes Doclyfi Pro</Text>
                <Text style={styles.subheading}>Elige el plan que mejor se adapte a ti</Text>

                <View style={styles.toggleWrap}>
                    <BillingToggle value={period} onChange={setPeriod} />
                    {period !== 'monthly' && (
                        <View style={styles.discountRow}>
                            <Ionicons name="pricetag-outline" size={12} color="#16A34A" />
                            <Text style={styles.discountText}>
                                Ahorra con el plan {formatPeriodLabel(period)}
                            </Text>
                        </View>
                    )}
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.cardsRow}
                    snapToInterval={176}
                    decelerationRate="fast"
                >
                    {PLANS.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            period={period}
                            isCurrent={plan.id === currentPlanId}
                            isSelected={selectedPlan === plan.id}
                            onSelect={() => setSelectedPlan(plan.id)}
                        />
                    ))}
                </ScrollView>

                <View style={styles.featuresCard}>
                    <Text style={styles.featuresTitle}>Todas las características</Text>

                    <View style={styles.featuresHeader}>
                        <Text style={styles.featuresHeaderLabel}>Función</Text>
                        <View style={styles.featuresHeaderChecks}>
                            {(['Free', 'Pre', 'Pre+'] as const).map((l) => (
                                <Text key={l} style={styles.featuresHeaderCheck}>{l}</Text>
                            ))}
                        </View>
                    </View>

                    {FEATURE_CATEGORIES.map((cat) => (
                        <View key={cat.name}>
                            <Text style={styles.categoryName}>{cat.name}</Text>
                            {cat.features.map((feat, idx) => (
                                <FeatureRow key={feat.id} feature={feat} index={idx} />
                            ))}
                        </View>
                    ))}
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.cta, { backgroundColor: PLANS.find(p => p.id === selectedPlan)?.color ?? '#3B7BFF' }]}
                    onPress={handleStart}
                    activeOpacity={0.85}
                >
                    <Ionicons name="rocket-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.ctaText}>
                        Iniciar plan {PLANS.find(p => p.id === selectedPlan)?.name}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F8FAFF',
    },
    scroll: {
        padding: 16,
        gap: 16,
        paddingBottom: 100,
    },
    heading: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    subheading: {
        fontSize: 13,
        color: '#64748B',
        marginTop: -10,
    },
    toggleWrap: {
        gap: 8,
    },
    discountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        justifyContent: 'center',
    },
    discountText: {
        fontSize: 11,
        color: '#16A34A',
        fontWeight: '600',
    },
    cardsRow: {
        gap: 12,
        paddingVertical: 4,
    },
    featuresCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E8EDF5',
        padding: 14,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(59,123,255,0.06)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 14,
            },
            android: { elevation: 2 },
        }),
    },
    featuresTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 10,
    },
    featuresHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        marginBottom: 4,
    },
    featuresHeaderLabel: {
        flex: 1,
        fontSize: 10,
        fontWeight: '700',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    featuresHeaderChecks: {
        flexDirection: 'row',
        gap: 4,
        width: 82,
        justifyContent: 'flex-end',
    },
    featuresHeaderCheck: {
        width: 24,
        textAlign: 'center',
        fontSize: 10,
        fontWeight: '700',
        color: '#94A3B8',
    },
    categoryName: {
        fontSize: 11,
        fontWeight: '700',
        color: '#3B7BFF',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        marginTop: 12,
        marginBottom: 4,
        paddingHorizontal: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
        backgroundColor: '#F8FAFF',
        borderTopWidth: 1,
        borderTopColor: '#E8EDF5',
    },
    cta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 15,
        borderRadius: 14,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(59,123,255,0.3)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 10,
            },
            android: { elevation: 4 },
        }),
    },
    ctaText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.2,
    },

    currentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    currentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E8EDF5',
        padding: 32,
        alignItems: 'center',
        gap: 12,
        maxWidth: 320,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(59,123,255,0.1)',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 1,
                shadowRadius: 20,
            },
            android: { elevation: 6 },
        }),
    },
    currentIcon: {
        fontSize: 48,
    },
    currentTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    currentBold: {
        fontWeight: '800',
    },
    currentSub: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 18,
    },
    currentBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    currentBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
