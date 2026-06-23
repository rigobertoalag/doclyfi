import { CaptureHeader } from '@/components/capture/CaptureHeader';
import { Input } from '@/components/ui/auth/Input';
import { fieldInput, form } from '@/constants/styles';
import { changePassword } from '@/services/profileService';
import { validatePassword } from '../../../../scripts/helpers';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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

export default function SecurityScreen() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const newRef = useRef<TextInput>(null);
    const confirmRef = useRef<TextInput>(null);

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!currentPassword) e.current = 'La contraseña actual es obligatoria';
        const passErr = validatePassword(newPassword);
        if (passErr) e.newPassword = passErr;
        if (newPassword !== confirm) e.confirm = 'Las contraseñas no coinciden';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setIsLoading(true);
        try {
            await changePassword({ currentPassword, newPassword });
            Alert.alert('Contraseña actualizada', 'Tu contraseña se ha cambiado correctamente.', [
                { text: 'OK', onPress: () => router.navigate('/(main)/profile') },
            ]);
        } catch (e: any) {
            const msg = e?.message ?? '';
            if (msg.toLowerCase().includes('current') || msg.toLowerCase().includes('actual')) {
                setErrors({ current: 'La contraseña actual no es correcta' });
            } else {
                setErrors({ general: msg || 'Error al actualizar. Intenta de nuevo.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <CaptureHeader onBack={() => router.navigate('/(main)/profile')} />

                <ScrollView
                    contentContainerStyle={[form.scroll, { paddingTop: 16 }]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Cambiar contraseña</Text>

                    {errors.general && (
                        <View style={styles.errorBanner}>
                            <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
                            <Text style={styles.errorText}>{errors.general}</Text>
                        </View>
                    )}

                    <View style={form.card}>
                        <View style={styles.field}>
                            <Text style={form.fieldLabel}>Contraseña actual</Text>
                            <View style={[form.inputRow, errors.current && form.inputRowError]}>
                                <Ionicons name="lock-closed-outline" size={17} color="#94A3B8" />
                                <Input
                                    style={fieldInput.naked}
                                    value={currentPassword}
                                    onChangeText={(v) => { setCurrentPassword(v); setErrors({}); }}
                                    placeholder="••••••••"
                                    isPassword
                                    returnKeyType="next"
                                    onSubmitEditing={() => newRef.current?.focus()}
                                />
                            </View>
                            {errors.current && <Text style={form.fieldError}>{errors.current}</Text>}
                        </View>

                        <View style={styles.field}>
                            <Text style={form.fieldLabel}>Nueva contraseña</Text>
                            <View style={[form.inputRow, errors.newPassword && form.inputRowError]}>
                                <Ionicons name="lock-closed-outline" size={17} color="#94A3B8" />
                                <Input
                                    ref={newRef}
                                    style={fieldInput.naked}
                                    value={newPassword}
                                    onChangeText={(v) => { setNewPassword(v); setErrors({}); }}
                                    placeholder="Mínimo 6 caracteres"
                                    isPassword
                                    returnKeyType="next"
                                    onSubmitEditing={() => confirmRef.current?.focus()}
                                />
                            </View>
                            {errors.newPassword && <Text style={form.fieldError}>{errors.newPassword}</Text>}
                        </View>

                        <View style={styles.field}>
                            <Text style={form.fieldLabel}>Confirmar nueva contraseña</Text>
                            <View style={[form.inputRow, errors.confirm && form.inputRowError]}>
                                <Ionicons name="lock-closed-outline" size={17} color="#94A3B8" />
                                <Input
                                    ref={confirmRef}
                                    style={fieldInput.naked}
                                    value={confirm}
                                    onChangeText={(v) => { setConfirm(v); setErrors({}); }}
                                    placeholder="Repite la contraseña"
                                    isPassword
                                    returnKeyType="done"
                                    onSubmitEditing={handleSave}
                                />
                            </View>
                            {errors.confirm && <Text style={form.fieldError}>{errors.confirm}</Text>}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.saveBtn, isLoading && styles.saveBtnDisabled]}
                        onPress={handleSave}
                        disabled={isLoading}
                        activeOpacity={0.85}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons name="shield-checkmark-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.saveBtnText}>Actualizar contraseña</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F8FAFF',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
        letterSpacing: -0.3,
        marginBottom: 16,
    },
    field: {
        gap: 6,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#FECACA',
        marginBottom: 12,
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        color: '#DC2626',
        fontWeight: '500',
    },
    saveBtn: {
        height: 52,
        backgroundColor: '#10B981',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(16,185,129,0.35)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 12,
            },
            android: { elevation: 4 },
        }),
    },
    saveBtnDisabled: {
        backgroundColor: '#6EE7B7',
        shadowColor: 'transparent',
        elevation: 0,
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.2,
    },
});
