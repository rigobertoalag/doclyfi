import { screen, form, alertBanner } from '@/shared/constants/styles';
import { Button } from '@/modules/auth/components/Button';
import { Input } from '@/shared/components/Input';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated, Easing,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { validateEmail, validateName, validatePassword } from '../../../../scripts/helpers';

type AuthMethod = 'email' | 'phone';

function useMountFade(delay = 0) {
  const anim = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(24),
  });
  React.useEffect(() => {
    const a = anim.current;
    Animated.parallel([
      Animated.timing(a.opacity, {
        toValue: 1,
        duration: 500,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(a.translateY, {
        toValue: 0,
        duration: 500,
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

export default function RegisterScreen() {
  const [method, setMethod] = useState<AuthMethod>('email');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const brandAnim = useMountFade(50);
  const cardAnim = useMountFade(250);
  const switchAnim = useMountFade(600);

  const errShake = useShake();
  const btnScale = usePressScale();

  const errorsShakeRef = useRef(errShake);
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      errorsShakeRef.current.shake();
    }
  }, [errors]);

  const handleMethodChange = (m: AuthMethod) => {
    setMethod(m);
    setContact('');
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameErr = validateName(name);
    if (nameErr) newErrors.name = nameErr;

    if (method === 'email') {
      const emailErr = validateEmail(contact);
      if (emailErr) newErrors.contact = emailErr;
    } else {
      const phoneRegex = /^\+?[\d\s\-()]{8,15}$/;
      if (!contact.trim()) newErrors.contact = 'El teléfono es obligatorio';
      else if (!phoneRegex.test(contact)) newErrors.contact = 'Formato de teléfono inválido';
    }

    const passErr = validatePassword(password);
    if (passErr) newErrors.password = passErr;
    if (password !== confirm) newErrors.confirm = 'Las contraseñas no coinciden';
    if (!acceptTerms) newErrors.terms = 'Debes aceptar los términos para continuar';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      await new Promise(r => setTimeout(r, 1200));
      router.replace('/(main)/dashboard');
    } catch (err: any) {
      setErrors({ general: err.message ?? 'Error al crear la cuenta' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[form.scroll, { paddingTop: 20 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo + hero */}
          <Animated.View style={[styles.heroSection, { opacity: brandAnim.opacity, transform: [{ translateY: brandAnim.translateY }] }]}>
            <Image
              source={require('@/assets/doclyfi_images/logo_no_background.png')}
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={styles.heroTitle}>Crear cuenta gratuita</Text>
            <Text style={styles.heroSub}>
              Organiza tus garantías, facturas, contratos y más en un solo lugar
            </Text>
          </Animated.View>

          {/* Error general */}
          {errors.general && (
            <Animated.View style={[alertBanner.error, { transform: [{ translateX: errShake.shakeAnim }] }]}>
              <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </Animated.View>
          )}

          {/* Card */}
          <Animated.View style={[styles.card, { opacity: cardAnim.opacity, transform: [{ translateY: cardAnim.translateY }] }]}>

            {/* Nombre */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nombre completo</Text>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre completo"
                autoComplete="name"
                returnKeyType="next"
                leftIcon={<Ionicons name="person-outline" size={18} color="#94A3B8" />}
                error={errors.name || null}
              />
            </View>

            {/* Method toggle */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Método de registro</Text>
              <View style={styles.methodToggle}>
                <TouchableOpacity
                  style={[styles.methodBtn, method === 'email' && styles.methodBtnActive]}
                  onPress={() => handleMethodChange('email')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="mail-outline"
                    size={15}
                    color={method === 'email' ? '#3B7BFF' : '#94A3B8'}
                  />
                  <Text style={[
                    styles.methodBtnText,
                    method === 'email' && styles.methodBtnTextActive,
                  ]}>
                    Correo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.methodBtn, method === 'phone' && styles.methodBtnActive]}
                  onPress={() => handleMethodChange('phone')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="phone-portrait-outline"
                    size={15}
                    color={method === 'phone' ? '#3B7BFF' : '#94A3B8'}
                  />
                  <Text style={[
                    styles.methodBtnText,
                    method === 'phone' && styles.methodBtnTextActive,
                  ]}>
                    Teléfono
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Email o Teléfono */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>
                {method === 'email' ? 'Correo electrónico' : 'Número de teléfono'}
              </Text>
              <Input
                value={contact}
                onChangeText={setContact}
                placeholder={method === 'email' ? 'tu@correo.com' : '+52 55 1234 5678'}
                keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
                autoCapitalize="none"
                autoComplete={method === 'email' ? 'email' : 'tel'}
                returnKeyType="next"
                leftIcon={
                  <Ionicons
                    name={method === 'email' ? 'mail-outline' : 'call-outline'}
                    size={18}
                    color="#94A3B8"
                  />
                }
                error={errors.contact || null}
              />
              {method === 'phone' && (
                <Text style={styles.fieldHint}>
                  Te enviaremos un código de verificación por SMS
                </Text>
              )}
            </View>

            {/* Contraseña */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Contraseña</Text>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
                isPassword
                returnKeyType="next"
                leftIcon={<Ionicons name="lock-closed-outline" size={18} color="#94A3B8" />}
                error={errors.password || null}
              />
            </View>

            {/* Confirmar */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Confirmar contraseña</Text>
              <Input
                value={confirm}
                onChangeText={setConfirm}
                placeholder="Repite la contraseña"
                isPassword
                returnKeyType="done"
                onSubmitEditing={handleRegister}
                leftIcon={<Ionicons name="lock-closed-outline" size={18} color="#94A3B8" />}
                error={errors.confirm || null}
              />
            </View>

            {/* Términos */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAcceptTerms(v => !v)}
              activeOpacity={0.7}
            >
              <Animated.View style={[styles.termsCheck, acceptTerms && styles.termsCheckActive]}>
                {acceptTerms && (
                  <Ionicons name="checkmark" size={13} color="#FFF" />
                )}
              </Animated.View>
              <Text style={styles.termsText}>
                Acepto los{' '}
                <Text style={styles.termsLink}>Términos de Servicio</Text>
                {' '}y la{' '}
                <Text style={styles.termsLink}>Política de Privacidad</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && (
              <Animated.View style={{ transform: [{ translateX: errShake.shakeAnim }] }}>
                <Text style={styles.termsError}>{errors.terms}</Text>
              </Animated.View>
            )}

            <Animated.View style={{ transform: [{ scale: btnScale.scale }], marginTop: 4 }}>
              <Button
                label={method === 'phone' ? 'Continuar — Verificar número' : 'Crear mi cuenta'}
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                onPressIn={btnScale.pressIn}
                onPressOut={btnScale.pressOut}
                onPress={handleRegister}
              />
            </Animated.View>
          </Animated.View>

          {/* Switch to login */}
          <Animated.View style={[styles.switchRow, { opacity: switchAnim.opacity }]}>
            <Text style={styles.switchText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.switchLink}>Iniciar sesión</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    gap: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(59,123,255,0.08)',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 24,
      },
      android: { elevation: 4 },
    }),
  },

  heroSection: { alignItems: 'center', marginBottom: 28 },
  logo: { width: 180, height: 56, marginBottom: 12 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 6, letterSpacing: -0.3 },
  heroSub: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 18, paddingHorizontal: 16 },

  errorBannerText: { flex: 1, color: '#DC2626', fontSize: 13, fontWeight: '500' },

  field: { gap: 6 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldHint: { fontSize: 11, color: '#94A3B8', marginTop: 2 },

  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 3,
    gap: 3,
  },
  methodBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 11,
  },
  methodBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(59,123,255,0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  methodBtnText: { fontSize: 13, fontWeight: '600', color: '#94A3B8' },
  methodBtnTextActive: { color: '#3B7BFF' },

  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  termsCheck: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  termsCheckActive: { backgroundColor: '#3B7BFF', borderColor: '#3B7BFF' },
  termsText: { flex: 1, fontSize: 13, color: '#64748B', lineHeight: 18 },
  termsLink: { color: '#3B7BFF', fontWeight: '600', textDecorationLine: 'underline' },
  termsError: { fontSize: 11, color: '#DC2626', fontWeight: '500' },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
  },
  switchText: { fontSize: 14, color: '#64748B' },
  switchLink: { fontSize: 14, color: '#3B7BFF', fontWeight: '700' },
});
