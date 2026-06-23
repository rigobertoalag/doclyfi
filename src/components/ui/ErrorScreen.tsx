import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useRef } from 'react';
import {
    Animated, Easing, Platform,
    StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { screen, btn, alertBanner } from '@/constants/styles';

// ── Tipos de error conocidos → configuración visual ───────────────────────────
type ErrorType = 'network' | 'auth' | 'server' | 'empty' | 'generic';

type ErrorConfig = {
    icon:     React.ComponentProps<typeof Ionicons>['name'];
    iconColor: string;
    iconBg:   string;
    title:    string;
    retryLabel: string;
};

const ERROR_CONFIGS: Record<ErrorType, ErrorConfig> = {
    network: {
        icon:       'wifi-outline',
        iconColor:  '#F59E0B',
        iconBg:     '#FFFBEB',
        title:      'Sin conexión a internet',
        retryLabel: 'Reconectar',
    },
    auth: {
        icon:       'lock-closed-outline',
        iconColor:  '#3B7BFF',
        iconBg:     '#EFF6FF',
        title:      'Sesión expirada',
        retryLabel: 'Iniciar sesión',
    },
    server: {
        icon:       'cloud-offline-outline',
        iconColor:  '#8B5CF6',
        iconBg:     '#F5F3FF',
        title:      'Error en el servidor',
        retryLabel: 'Reintentar',
    },
    empty: {
        icon:       'documents-outline',
        iconColor:  '#0D9488',
        iconBg:     '#F0FDFA',
        title:      'Sin documentos aún',
        retryLabel: 'Actualizar',
    },
    generic: {
        icon:       'alert-circle-outline',
        iconColor:  '#EF4444',
        iconBg:     '#FEF2F2',
        title:      'Algo salió mal',
        retryLabel: 'Intentar de nuevo',
    },
};

// ── Inferir tipo de error a partir del mensaje ────────────────────────────────
const inferErrorType = (message: string): ErrorType => {
    const msg = message.toLowerCase();
    if (msg.includes('network') || msg.includes('conexión') || msg.includes('internet') || msg.includes('fetch'))
        return 'network';
    if (msg.includes('401') || msg.includes('no autorizado') || msg.includes('sesión'))
        return 'auth';
    if (msg.includes('500') || msg.includes('servidor'))
        return 'server';
    if (msg.includes('sin datos') || msg.includes('vacío'))
        return 'empty';
    return 'generic';
};

// ── Props ─────────────────────────────────────────────────────────────────────
type ErrorScreenProps = {
    message:  string;
    onRetry?: () => void;
    // Forzar un tipo de error ignorando la inferencia automática
    errorType?: ErrorType;
};

export function ErrorScreen({ message, onRetry, errorType }: ErrorScreenProps) {
    const type   = errorType ?? inferErrorType(message);
    const config = ERROR_CONFIGS[type];

    // ── Animaciones ───────────────────────────────────────────────────────────
    const fadeAnim   = useRef(new Animated.Value(0)).current;
    const slideAnim  = useRef(new Animated.Value(24)).current;
    const shakeAnim  = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entrada: fade + slide up
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue:         1,
                duration:        350,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue:         0,
                duration:        350,
                easing:          Easing.out(Easing.back(1.4)),
                useNativeDriver: true,
            }),
        ]).start();

        // Shake del ícono de error para llamar la atención
        if (type !== 'empty') {
            setTimeout(() => {
                Animated.sequence([
                    Animated.timing(shakeAnim, { toValue:  8, duration: 60, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue:  5, duration: 60, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue: -5, duration: 60, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue:  0, duration: 60, useNativeDriver: true }),
                ]).start();
            }, 300);
        }
    }, []);

    return (
        <SafeAreaView style={screen} edges={['top', 'bottom']}>
            <Animated.View style={[
                styles.container,
                {
                    opacity:   fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}>

                {/* Logo pequeño en top */}
                <View style={styles.logoWrap}>
                    <Image
                        source={require('@/assets/doclyfi_images/logo_no_background.png')}
                        style={styles.logo}
                        contentFit="contain"
                    />
                </View>

                {/* Ícono de error con shake */}
                <Animated.View style={[
                    styles.iconOuter,
                    { transform: [{ translateX: shakeAnim }] },
                ]}>
                    <View style={[styles.iconInner, { backgroundColor: config.iconBg }]}>
                        <Ionicons
                            name={config.icon}
                            size={36}
                            color={config.iconColor}
                        />
                    </View>
                </Animated.View>

                {/* Textos */}
                <View style={styles.textBlock}>
                    <Text style={styles.title}>{config.title}</Text>
                    <Text style={styles.message}>{message}</Text>
                </View>

                {/* Detalles técnicos colapsados — útil en dev */}
                {__DEV__ && (
                    <View style={styles.devBlock}>
                        <Text style={styles.devLabel}>DEV — Detalle del error:</Text>
                        <Text style={styles.devMessage}>{message}</Text>
                    </View>
                )}

                {/* Acciones */}
                <View style={styles.actions}>
                    {onRetry && (
                        <TouchableOpacity
                            style={[btn.primary, { backgroundColor: config.iconColor }]}
                            onPress={onRetry}
                            activeOpacity={0.85}
                        >
                            <Ionicons name="refresh-outline" size={17} color="#FFFFFF" />
                            <Text style={styles.retryBtnText}>{config.retryLabel}</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={btn.outline}
                        activeOpacity={0.75}
                    >
                        <Ionicons name="help-circle-outline" size={15} color="#64748B" />
                        <Text style={styles.supportBtnText}>Contactar soporte</Text>
                    </TouchableOpacity>
                </View>

                {/* Info extra según tipo */}
                {type === 'network' && (
                    <View style={[alertBanner.warning, { width: '100%' }]}>
                        <Ionicons name="information-circle-outline" size={15} color="#F59E0B" />
                        <Text style={styles.tipText}>
                            Verifica que tengas conexión WiFi o datos móviles activos.
                        </Text>
                    </View>
                )}

                {type === 'auth' && (
                    <View style={[alertBanner.info, { width: '100%' }]}>
                        <Ionicons name="shield-outline" size={15} color="#3B7BFF" />
                        <Text style={[styles.tipText, { color: '#2563EB' }]}>
                            Tu sesión expiró por seguridad. Inicia sesión nuevamente.
                        </Text>
                    </View>
                )}

            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:           1,
        alignItems:     'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
        gap: 18,
    },

    // Logo
    logoWrap: { marginBottom: 8 },
    logo: { width: 140, height: 42 },

    // Ícono
    iconOuter: {
        ...Platform.select({
            ios: {
                shadowColor:   'rgba(0,0,0,0.10)',
                shadowOffset:  { width: 0, height: 6 },
                shadowOpacity: 1,
                shadowRadius:  14,
            },
            android: { elevation: 4 },
        }),
    },
    iconInner: {
        width:          88,
        height:         88,
        borderRadius:   28,
        alignItems:     'center',
        justifyContent: 'center',
    },

    // Texto
    textBlock: { alignItems: 'center', gap: 8 },
    title: {
        fontSize:     20,
        fontWeight:   '800',
        color:        '#0F172A',
        textAlign:    'center',
        letterSpacing: -0.4,
    },
    message: {
        fontSize:   13,
        color:      '#64748B',
        textAlign:  'center',
        lineHeight: 19,
        maxWidth:   280,
    },

    // DEV block
    devBlock: {
        backgroundColor: '#1E293B',
        borderRadius:    10,
        padding:         12,
        width:           '100%',
        gap:             4,
    },
    devLabel:   { fontSize: 10, fontWeight: '700', color: '#F59E0B' },
    devMessage: { fontSize: 11, color: '#CBD5E1', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },

    // Acciones
    actions: { width: '100%', gap: 10 },
    retryBtnText: {
        fontSize:   15,
        fontWeight: '700',
        color:      '#FFFFFF',
    },
    supportBtnText: {
        fontSize:   13,
        fontWeight: '600',
        color:      '#64748B',
    },
    tipText: {
        flex:       1,
        fontSize:   12,
        color:      '#B45309',
        lineHeight: 17,
        fontWeight: '400',
    },
});