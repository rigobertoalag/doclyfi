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
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { validateEmail, validateName, validatePassword } from '../../../../scripts/helpers';

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

export default function RegisterScreen() {
  const [method, setMethod] = useState<AuthMethod>('email');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const backAnim = useMountFade(50);
  const brandAnim = useMountFade(100);
  const cardAnim = useMountFade(200);
  const infoAnim = useMountFade(450);
  const switchAnim = useMountFade(500);

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
            contentContainerStyle={[form.scroll, { paddingTop: 16 }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          {/* Back */}
          <Animated.View style={{ opacity: backAnim.opacity, transform: [{ translateY: backAnim.translateY }] }}>
            <TouchableOpacity
              style={form.backBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={18} color="#475569" />
              <Text style={form.backText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Logo */}
          <Animated.View style={[styles.brandSection, { opacity: brandAnim.opacity, transform: [{ translateY: brandAnim.translateY }] }]}>
            <Image
              source={require('@/assets/doclyfi_images/logo_no_background.png')}
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={styles.tagline}>Crea tu cuenta gratis</Text>
          </Animated.View>

          {/* Error general */}
          {errors.general && (
            <Animated.View style={[alertBanner.error, { transform: [{ translateX: errShake.shakeAnim }] }]}>
              <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </Animated.View>
          )}

          {/* Card */}
          <Animated.View style={[form.card, { gap: 14, marginBottom: 14, opacity: cardAnim.opacity, transform: [{ translateY: cardAnim.translateY }] }]}>

            {/* Nombre */}
            <View style={styles.field}>
              <Text style={form.fieldLabel}>Nombre completo</Text>
              <View style={[form.inputRow, errors.name && form.inputRowError]}>
                <Ionicons name="person-outline" size={17} color="#94A3B8" />
                <Input
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Tu nombre completo"
                  autoComplete="name"
                  returnKeyType="next"
                />
              </View>
              {errors.name && <Animated.View style={{ transform: [{ translateX: errShake.shakeAnim }] }}><Text style={form.fieldError}>{errors.name}</Text></Animated.View>}
            </View>

            {/* Method toggle */}
            <View style={styles.field}>
              <Text style={form.fieldLabel}>Método de registro</Text>
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
              <Text style={form.fieldLabel}>
                {method === 'email' ? 'Correo electrónico' : 'Número de teléfono'}
              </Text>
              <View style={[form.inputRow, errors.contact && form.inputRowError]}>
                <Ionicons
                  name={method === 'email' ? 'mail-outline' : 'call-outline'}
                  size={17}
                  color="#94A3B8"
                />
                <Input
                  style={styles.input}
                  value={contact}
                  onChangeText={setContact}
                  placeholder={method === 'email' ? 'tu@correo.com' : '+52 55 1234 5678'}
                  keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
                  autoCapitalize="none"
                  autoComplete={method === 'email' ? 'email' : 'tel'}
                  returnKeyType="next"
                />
              </View>
              {errors.contact && <Animated.View style={{ transform: [{ translateX: errShake.shakeAnim }] }}><Text style={form.fieldError}>{errors.contact}</Text></Animated.View>}
              {method === 'phone' && (
                <Text style={styles.fieldHint}>
                  Te enviaremos un código de verificación por SMS
                </Text>
              )}
            </View>

            {/* Contraseña */}
            <View style={styles.field}>
              <Text style={form.fieldLabel}>Contraseña</Text>
              <View style={[form.inputRow, errors.password && form.inputRowError]}>
                <Ionicons name="lock-closed-outline" size={17} color="#94A3B8" />
                <Input
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mínimo 6 caracteres"
                  isPassword
                  returnKeyType="next"
                />
              </View>
              {errors.password && <Animated.View style={{ transform: [{ translateX: errShake.shakeAnim }] }}><Text style={form.fieldError}>{errors.password}</Text></Animated.View>}
            </View>

            {/* Confirmar */}
            <View style={styles.field}>
              <Text style={form.fieldLabel}>Confirmar contraseña</Text>
              <View style={[form.inputRow, errors.confirm && form.inputRowError]}>
                <Ionicons name="lock-closed-outline" size={17} color="#94A3B8" />
                <Input
                  style={styles.input}
                  value={confirm}
                  onChangeText={setConfirm}
                  placeholder="Repite la contraseña"
                  isPassword
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
              </View>
              {errors.confirm && <Animated.View style={{ transform: [{ translateX: errShake.shakeAnim }] }}><Text style={form.fieldError}>{errors.confirm}</Text></Animated.View>}
            </View>

            {/* Términos */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAcceptTerms(v => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.termsCheck, acceptTerms && styles.termsCheckActive]}>
                {acceptTerms && <Ionicons name="checkmark" size={12} color="#FFF" />}
              </View>
              <Text style={styles.termsText}>
                Acepto los{' '}
                <Text style={styles.termsLink}>Términos de Servicio</Text>
                {' '}y la{' '}
                <Text style={styles.termsLink}>Política de Privacidad</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && <Animated.View style={{ transform: [{ translateX: errShake.shakeAnim }] }}><Text style={form.fieldError}>{errors.terms}</Text></Animated.View>}

            <Animated.View style={{ transform: [{ scale: btnScale.scale }] }}>
              <Button
                label={method === 'phone' ? 'Continuar — Verificar número' : 'Crear mi cuenta'}
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                onPressIn={btnScale.pressIn}
                onPressOut={btnScale.pressOut}
                onPress={handleRegister}
                style={{ marginTop: 4 }}
              />
            </Animated.View>
          </Animated.View>

          {/* Info de datos futuros */}
          <Animated.View style={[alertBanner.info, { opacity: infoAnim.opacity, transform: [{ translateY: infoAnim.translateY }] }]}>
            <Ionicons name="information-circle-outline" size={16} color="#3B7BFF" />
            <Text style={styles.infoCardText}>
              Podrás agregar datos fiscales, información de tu contador y preferencias
              de facturación desde tu perfil, cuando los necesites.
            </Text>
          </Animated.View>

          {/* Switch to login */}
          <Animated.View style={[form.switchRow, { opacity: switchAnim.opacity }]}>
            <Text style={form.switchText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={form.switchLink}>Iniciar sesión</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brandSection: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 160, height: 50, marginBottom: 8 },
  tagline: { fontSize: 13, color: '#94A3B8' },

  errorBannerText: { flex: 1, color: '#DC2626', fontSize: 13, fontWeight: '500' },

  field: { gap: 6 },
  input: { flex: 1, borderWidth: 0, backgroundColor: 'transparent', paddingLeft: 0 },
  fieldHint: { fontSize: 11, color: '#94A3B8' },

  methodToggle: {
    flexDirection: 'row', backgroundColor: '#F1F5F9',
    borderRadius: 12, padding: 3, gap: 3,
  },
  methodBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: 10,
  },
  methodBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: { shadowColor: 'rgba(59,123,255,0.1)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  methodBtnText: { fontSize: 13, fontWeight: '600', color: '#94A3B8' },
  methodBtnTextActive: { color: '#3B7BFF' },

  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  termsCheck: {
    width: 20, height: 20, borderRadius: 6, borderWidth: 2,
    borderColor: '#E2E8F0', backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  termsCheckActive: { backgroundColor: '#3B7BFF', borderColor: '#3B7BFF' },
  termsText: { flex: 1, fontSize: 13, color: '#64748B', lineHeight: 18 },
  termsLink: { color: '#3B7BFF', fontWeight: '600', textDecorationLine: 'underline' },

  infoCardText: { flex: 1, fontSize: 12, color: '#3B7BFF', lineHeight: 17, fontWeight: '400' },
});