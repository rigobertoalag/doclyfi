import { Input } from '@/components/ui/auth/Input';
import { alertBanner, brand, errorText, fieldInput, form, screen } from '@/constants/styles';
import { useLogin } from '@/hooks/useLogin';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Easing,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthMethod = 'email' | 'phone';

function useMountFade(delay = 0) {
    const anim = useRef({
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(20),
    });
    React.useEffect(() => {
        const a = anim.current;
        Animated.parallel([
            Animated.timing(a.opacity, {
                toValue: 1,
                duration: 450,
                delay,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(a.translateY, {
                toValue: 0,
                duration: 450,
                delay,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return anim.current;
}

function useShake() {
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const shake = React.useCallback(() => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
        ]).start();
    }, [shakeAnim]);
    return { shakeAnim, shake };
}

function usePressScale() {
    const scale = useRef(new Animated.Value(1)).current;
    const pressIn = React.useCallback(() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start(), [scale]);
    const pressOut = React.useCallback(() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start(), [scale]);
    return { scale, pressIn, pressOut };
}

export default function LoginScreen() {
    const { handleLogin, isLoading, errors, clearErrors } = useLogin();

    const [authMethod] = useState<AuthMethod>('email');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');

    const passwordRef = useRef<TextInput>(null);

    const brandAnim = useMountFade(100);
    const cardAnim = useMountFade(250);
    const dividerAnim = useMountFade(500);
    const socialAnim = useMountFade(550);
    const switchAnim = useMountFade(600);
    const legalAnim = useMountFade(650);

    const errShake = useShake();
    const btnScale = usePressScale();

    const shakeRef = useRef(errShake);
    React.useEffect(() => {
        if (errors.general || errors.contact || errors.password) {
            shakeRef.current.shake();
        }
    }, [errors]);

    const onSubmit = async () => {
        const success = await handleLogin({ authMethod, contact, password });
        if (success) router.replace('/(main)/dashboard');
    };

    return (
        <SafeAreaView style={screen} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={styles.kav}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={[form.scroll, { paddingTop: 28, justifyContent: 'center' }]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Brand ──────────────────────────────────────────── */}
                    <Animated.View style={[brand.section, { marginBottom: 28, opacity: brandAnim.opacity, transform: [{ translateY: brandAnim.translateY }] }]}>
                        <Image
                            source={require('/home/rigoalag/doclyfi-app/assets/doclyfi_images/logo_no_background.png')}
                            style={styles.brandLogo}
                            contentFit="contain"
                        />
                        <Text style={brand.tagline}>Tus documentos, siempre contigo</Text>
                    </Animated.View>

                    {/* ── Card ───────────────────────────────────────────── */}
                    <Animated.View style={[form.card, { opacity: cardAnim.opacity, transform: [{ translateY: cardAnim.translateY }] }]}>
                        <Text style={styles.cardTitle}>Iniciar Sesión</Text>
                        <Text style={styles.cardSubtitle}>
                            Accede a todos tus documentos escaneados
                        </Text>

                        {/* Error banner */}
                        {errors.general && (
                            <Animated.View style={[alertBanner.error, { marginBottom: 16, transform: [{ translateX: errShake.shakeAnim }] }]}>
                                <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
                                <Text style={errorText.banner}>{errors.general}</Text>
                            </Animated.View>
                        )}

                        {/* Email */}
                        <View style={styles.fieldWrap}>
                            <Text style={[form.fieldLabel, { marginBottom: 7 }]}>Correo electrónico</Text>
                            <View style={styles.fieldRow}>
                                <View style={styles.fieldIconWrap}>
                                    <Ionicons name="mail-outline" size={17} color="#94A3B8" />
                                </View>
                                <Input
                                    style={fieldInput.naked}
                                    value={contact}
                                    onChangeText={(v) => { setContact(v); clearErrors(); }}
                                    placeholder="tu@correo.com"
                                    keyboardType="email-address"
                                    autoComplete="email"
                                    returnKeyType="next"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onSubmitEditing={() => passwordRef.current?.focus()}
                                    editable={!isLoading}
                                />
                            </View>
                            {errors.contact && (
                                <Animated.View style={{ transform: [{ translateX: errShake.shakeAnim }] }}>
                                    <Text style={styles.fieldError}>{errors.contact}</Text>
                                </Animated.View>
                            )}
                        </View>

                        {/* Password */}
                        <View style={styles.fieldWrap}>
                            <Text style={[form.fieldLabel, { marginBottom: 7 }]}>Contraseña</Text>
                            <View style={styles.fieldRow}>
                                <View style={styles.fieldIconWrap}>
                                    <Ionicons name="lock-closed-outline" size={17} color="#94A3B8" />
                                </View>
                                <Input
                                    ref={passwordRef}
                                    style={fieldInput.naked}
                                    value={password}
                                    onChangeText={(v) => { setPassword(v); clearErrors(); }}
                                    placeholder="••••••••"
                                    placeholderTextColor="#94A3B8"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="done"
                                    onSubmitEditing={onSubmit}
                                    editable={!isLoading}
                                    isPassword
                                    autoComplete="password"
                                />
                            </View>
                            {errors.password && (
                                <Animated.View style={{ transform: [{ translateX: errShake.shakeAnim }] }}>
                                    <Text style={styles.fieldError}>{errors.password}</Text>
                                </Animated.View>
                            )}
                        </View>

                        {/* Forgot */}
                        <TouchableOpacity style={styles.forgotLink}>
                            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>

                        {/* ── Submit ────────────────────────────────── */}
                        <Animated.View style={{ transform: [{ scale: btnScale.scale }] }}>
                            <TouchableOpacity
                                style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                                onPress={onSubmit}
                                disabled={isLoading}
                                onPressIn={btnScale.pressIn}
                                onPressOut={btnScale.pressOut}
                                activeOpacity={0.85}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
                                        <Text style={styles.submitBtnText}>Entrar</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>

                    {/* ── Divider ────────────────────────────────────────── */}
                    <Animated.View style={[styles.dividerRow, { opacity: dividerAnim.opacity }]}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>o continúa con</Text>
                        <View style={styles.dividerLine} />
                    </Animated.View>

                    {/* ── Social buttons ─────────────────────────────────── */}
                    <Animated.View style={[styles.socialRow, { opacity: socialAnim.opacity, transform: [{ translateY: socialAnim.translateY }] }]}>
                        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
                            <Ionicons name="logo-google" size={18} color="#EA4335" />
                            <Text style={styles.socialBtnText}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
                            <Ionicons name="logo-apple" size={18} color="#0F172A" />
                            <Text style={styles.socialBtnText}>Apple</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* ── Switch ─────────────────────────────────────────── */}
                    <Animated.View style={[form.switchRow, { marginBottom: 14, opacity: switchAnim.opacity }]}>
                        <Text style={form.switchText}>¿No tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                            <Text style={form.switchLink}>Crear cuenta</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* ── Legal ──────────────────────────────────────────── */}
                    <Animated.Text style={[styles.legal, { opacity: legalAnim.opacity }]}>
                        Al continuar aceptas los{' '}
                        <Text style={styles.legalLink}>Términos de Servicio</Text>
                        {' '}y la{' '}
                        <Text style={styles.legalLink}>Política de Privacidad</Text>
                    </Animated.Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    kav: {
        flex: 1,
    },
    brandLogo: {
        width: 180,
        height: 56,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 20,
        lineHeight: 18,
    },
    fieldWrap: {
        marginBottom: 14,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 13,
        paddingLeft: 12,
        minHeight: 50,
    },
    fieldIconWrap: {
        marginRight: 4,
        flexShrink: 0,
    },
    forgotLink: {
        alignSelf: 'flex-end',
        marginBottom: 18,
        marginTop: 2,
    },
    forgotText: {
        fontSize: 13,
        color: '#3B7BFF',
        fontWeight: '500',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E8EDF5',
    },
    dividerText: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
    socialRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    socialBtn: {
        flex: 1,
        height: 46,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 13,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0,0.05)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 6,
            },
            android: { elevation: 1 },
        }),
    },
    socialBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    legal: {
        fontSize: 11,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 16,
    },
    legalLink: {
        color: '#64748B',
        textDecorationLine: 'underline',
    },
    fieldError: { fontSize: 11, color: '#DC2626', fontWeight: '500' },
    // Submit
    submitBtn: {
        height: 52,
        backgroundColor: '#3B7BFF',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(59,123,255,0.35)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 12,
            },
            android: { elevation: 4 },
        }),
    },
    submitBtnDisabled: { backgroundColor: '#93C5FD', shadowColor: 'transparent', elevation: 0 },
    submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 },
});