import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { screen, brand } from '@/shared/constants/styles';

export function LoadingScreen() {
    // ── Animaciones ───────────────────────────────────────────────────────────
    const spinAnim  = useRef(new Animated.Value(0)).current;
    const fadeAnim  = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Fade in del contenido
        Animated.timing(fadeAnim, {
            toValue:        1,
            duration:       400,
            useNativeDriver: true,
        }).start();

        // Rotación continua del spinner
        Animated.loop(
            Animated.timing(spinAnim, {
                toValue:         1,
                duration:        1200,
                easing:          Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Pulso suave del logo
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue:         0.92,
                    duration:        900,
                    easing:          Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue:         1,
                    duration:        900,
                    easing:          Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const spinInterpolate = spinAnim.interpolate({
        inputRange:  [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <SafeAreaView style={screen} edges={['top', 'bottom']}>
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

                {/* Logo con pulso */}
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Image
                        source={require('@/assets/doclyfi_images/logo_no_background.png')}
                        style={styles.logo}
                        contentFit="contain"
                    />
                </Animated.View>

                {/* Spinner */}
                <View style={styles.spinnerWrap}>
                    <Animated.View style={[
                        styles.spinnerRing,
                        { transform: [{ rotate: spinInterpolate }] },
                    ]} />
                    <View style={styles.spinnerCenter}>
                        <Ionicons name="document-text-outline" size={20} color="#3B7BFF" />
                    </View>
                </View>

                {/* Texto */}
                <Text style={styles.title}>Cargando tus documentos</Text>
                <Text style={brand.tagline}>Un momento por favor...</Text>

                {/* Dots animados */}
                <View style={styles.dotsRow}>
                    {[0, 1, 2].map(i => (
                        <BouncingDot key={i} delay={i * 180} />
                    ))}
                </View>

            </Animated.View>
        </SafeAreaView>
    );
}

// ── Dot con animación de rebote ───────────────────────────────────────────────
function BouncingDot({ delay }: { delay: number }) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(anim, {
                    toValue:         -6,
                    duration:        350,
                    easing:          Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue:         0,
                    duration:        350,
                    easing:          Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.delay(400),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[
            styles.dot,
            { transform: [{ translateY: anim }] },
        ]} />
    );
}

const styles = StyleSheet.create({
    container: {
        flex:           1,
        alignItems:     'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 16,
    },
    logo: {
        width:        200,
        height:       60,
        marginBottom: 8,
    },
    spinnerWrap: {
        width:          64,
        height:         64,
        alignItems:     'center',
        justifyContent: 'center',
        position:       'relative',
    },
    spinnerRing: {
        position:    'absolute',
        width:       64,
        height:      64,
        borderRadius: 32,
        borderWidth:  3,
        borderColor:  '#E8EDF5',
        borderTopColor: '#3B7BFF',
        borderRightColor: '#93C5FD',
    },
    spinnerCenter: {
        width:          40,
        height:         40,
        borderRadius:   20,
        backgroundColor: '#EFF6FF',
        alignItems:     'center',
        justifyContent: 'center',
    },
    title: {
        fontSize:    16,
        fontWeight:  '700',
        color:       '#0F172A',
        letterSpacing: -0.3,
        marginTop:   8,
    },
    dotsRow: {
        flexDirection: 'row',
        gap:           8,
        marginTop:     8,
    },
    dot: {
        width:         7,
        height:        7,
        borderRadius:  4,
        backgroundColor: '#3B7BFF',
        opacity:       0.7,
    },
});