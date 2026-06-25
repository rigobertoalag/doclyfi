import { CaptureHeader } from '@/shared/components/CaptureHeader';
import { Input } from '@/shared/components/Input';
import { fieldInput, form } from '@/shared/constants/styles';
import { updateProfile } from '@/modules/profile/services/profileService';
import { validateName } from '../../../../scripts/helpers';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '../../../../context/AuthContext';

export default function EditProfileScreen() {
    const { user, updateUser } = useAuthContext();
    const [name, setName] = useState(user?.fullName ?? '');
    const [phone, setPhone] = useState(user?.phone ?? '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        const nameErr = validateName(name);
        if (nameErr) { setError(nameErr); return; }
        setError(null);
        setIsLoading(true);
        try {
            await updateProfile({ fullName: name.trim(), phone: phone.trim() || null });
            await updateUser({ fullName: name.trim(), phone: phone.trim() || null });
            router.navigate('/(main)/profile');
        } catch (e: any) {
            if (e?.message?.includes('conexión') || e?.message?.includes('fetch') || e?.message?.includes('Network')) {
                setError('Error de conexión. Intenta de nuevo.');
            } else {
                setError(e?.message ?? 'Error al guardar. Intenta de nuevo.');
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
                    <Text style={styles.title}>Editar perfil</Text>

                    {error && (
                        <View style={styles.errorBanner}>
                            <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={form.card}>
                        <View style={styles.field}>
                            <Text style={form.fieldLabel}>Nombre completo</Text>
                            <View style={form.inputRow}>
                                <Ionicons name="person-outline" size={17} color="#94A3B8" />
                                <Input
                                    style={fieldInput.naked}
                                    value={name}
                                    onChangeText={(v) => { setName(v); setError(null); }}
                                    placeholder="Tu nombre completo"
                                    autoComplete="name"
                                    returnKeyType="done"
                                    onSubmitEditing={handleSave}
                                />
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Text style={form.fieldLabel}>Correo electrónico</Text>
                            <View style={styles.readonlyRow}>
                                <Ionicons name="mail-outline" size={17} color="#CBD5E1" />
                                <Text style={styles.readonlyText}>{user?.email ?? '—'}</Text>
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Text style={form.fieldLabel}>Teléfono</Text>
                            <View style={form.inputRow}>
                                <Ionicons name="call-outline" size={17} color="#94A3B8" />
                                <Input
                                    style={fieldInput.naked}
                                    value={phone}
                                    onChangeText={(v) => { setPhone(v); setError(null); }}
                                    placeholder="Tu número telefónico"
                                    keyboardType="phone-pad"
                                    returnKeyType="done"
                                    onSubmitEditing={handleSave}
                                />
                            </View>
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
                                <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.saveBtnText}>Guardar cambios</Text>
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
    readonlyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 4,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    readonlyText: {
        fontSize: 15,
        color: '#94A3B8',
        fontWeight: '500',
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
        backgroundColor: '#3B7BFF',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
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
    saveBtnDisabled: {
        backgroundColor: '#93C5FD',
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
