import { ProfileAvatar, ProfileMenuItem, ProfileSectionCard, ProfileStatCard } from '@/components/profile';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { useUserStats } from '@/hooks/useUserStats';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '../../../../context/AuthContext';
import { PLANS } from '../../../constants/plans';

function formatStorage(bytes: number): string {
    if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`;
    if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
    return `${bytes} B`;
}

function formatDate(iso: string): string {
    try {
        const d = new Date(iso);
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
        return '—';
    }
}

export default function ProfileScreen() {
    const { user, logout, updateUser } = useAuthContext();
    const stats = useUserStats();
    const [notifications, setNotifications] = useState(user?.preferences.notifications ?? true);
    const [theme, setTheme] = useState<'light' | 'dark'>(user?.preferences.theme ?? 'light');

    const plan = PLANS.find((p) => p.id === user?.plan) ?? PLANS[0];
    const planColor = plan.color;

    const handleLogout = () => {
        Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
        ]);
    };

    const avatarUpload = useAvatarUpload((avatarUrl) => { updateUser({ avatarUrl }); });

    const onAvatarTap = () => {
        avatarUpload.clearError();
        Alert.alert('Foto de perfil', 'Selecciona una opción', [
            { text: 'Tomar foto', onPress: avatarUpload.takePhoto },
            { text: 'Elegir de galería', onPress: avatarUpload.pickFromGallery },
            { text: 'Cancelar', style: 'cancel' },
        ]);
    };

    const statsData = stats.data;
    const docsLimit = plan.docs;
    const docsUsed = statsData?.docsCount ?? 0;
    const docsPct = docsLimit > 0 ? Math.min((docsUsed / docsLimit) * 100, 100) : 0;
    const storageLimitStr = plan.storage;
    const storageUsed = statsData?.storageUsed ?? 0;
    const storageLimitBytes = parseStorageToBytes(plan.storage);
    const storagePct = storageLimitBytes > 0 ? Math.min((storageUsed / storageLimitBytes) * 100, 100) : 0;
    const isNearLimit = docsPct > 80 || storagePct > 80;
    const isAtLimit = docsPct >= 100 || storagePct >= 100;

    const progressColor = isAtLimit ? '#DC2626' : isNearLimit ? '#F59E0B' : '#3B7BFF';

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeIn.duration(400)}>
                {avatarUpload.error && (
                    <View style={styles.avatarError}>
                        <Text style={styles.avatarErrorText}>{avatarUpload.error}</Text>
                    </View>
                )}
                {/* Avatar section */}
                <View style={styles.avatarSection}>
                    <ProfileAvatar
                        uri={user?.avatarUrl ?? null}
                        name={user?.fullName ?? ''}
                        onEdit={onAvatarTap}
                    />
                    {avatarUpload.isUploading && <Text style={styles.uploadingText}>Subiendo...</Text>}
                    <Text style={styles.userName}>{user?.fullName}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <View style={[styles.planBadge, { backgroundColor: plan.bg, borderColor: plan.border }]}>
                        <Text style={styles.planIcon}>{plan.icon}</Text>
                        <Text style={[styles.planLabel, { color: plan.color }]}>{plan.name.toUpperCase()}</Text>
                    </View>
                </View>

                {/* Stats section */}
                {stats.isLoading ? (
                    <View style={styles.statsRow}>
                        {[1, 2, 3].map((i) => (
                            <View key={i} style={[styles.statCard, styles.skeleton]} />
                        ))}
                    </View>
                ) : stats.error ? (
                    <View style={styles.errorCard}>
                        <Text style={styles.errorText}>Error al cargar estadísticas</Text>
                        <TouchableOpacity onPress={stats.retry} style={styles.retryBtn}>
                            <Text style={styles.retryText}>Reintentar</Text>
                        </TouchableOpacity>
                    </View>
                ) : statsData ? (
                    <View style={styles.statsRow}>
                        <ProfileStatCard icon="document-text" value={`${docsUsed}`} label="Documentos" color={planColor} />
                        <ProfileStatCard icon="cloud-outline" value={formatStorage(storageUsed)} label="Almacenamiento" color={planColor} />
                        <ProfileStatCard icon="calendar-outline" value={formatDate(statsData.createdAt)} label="Miembro desde" color={planColor} />
                    </View>
                ) : null}

                {/* Usage progress */}
                {statsData && (
                    <View style={styles.usageCard}>
                        <View style={styles.usageRow}>
                            <Text style={styles.usageLabel}>Documentos</Text>
                            <Text style={styles.usageValue}>{docsUsed} / {docsLimit}</Text>
                        </View>
                        <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: `${docsPct}%`, backgroundColor: progressColor }]} />
                        </View>
                        <View style={styles.usageRow}>
                            <Text style={styles.usageLabel}>Almacenamiento</Text>
                            <Text style={styles.usageValue}>{formatStorage(storageUsed)} / {storageLimitStr}</Text>
                        </View>
                        <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: `${storagePct}%`, backgroundColor: progressColor }]} />
                        </View>
                        {isNearLimit && !isAtLimit && (
                            <Text style={styles.warningText}>Estás cerca del límite de tu plan</Text>
                        )}
                        {isAtLimit && (
                            <View style={styles.upgradePrompt}>
                                <Text style={styles.upgradeText}>Actualiza tu plan para seguir usando Doclyfi</Text>
                                <TouchableOpacity
                                    style={styles.upgradeBtn}
                                    onPress={() => router.push('/(modals)/plans')}
                                >
                                    <Text style={styles.upgradeBtnText}>Ver planes</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}

                {/* Menu */}
                <View style={styles.menuCard}>
                    <ProfileMenuItem icon="person-outline" label="Editar perfil" color="#3B7BFF" onPress={() => router.push('/(main)/profile/edit')} />
                    <View style={styles.menuDivider} />
                    <ProfileMenuItem icon="lock-closed-outline" label="Cambiar contraseña" color="#10B981" onPress={() => router.push('/(main)/profile/security')} />
                    <View style={styles.menuDivider} />
                    <ProfileMenuItem icon="diamond-outline" label="Mi plan" color="#F59E0B" onPress={() => router.push('/(modals)/plans')} />
                </View>

                {/* Settings */}
                <ProfileSectionCard title="Configuración" icon="settings-outline" color="#64748B" defaultExpanded={false}>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Notificaciones</Text>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
                            thumbColor={notifications ? '#3B7BFF' : '#CBD5E1'}
                        />
                    </View>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Idioma</Text>
                        <Text style={styles.settingValue}>Español</Text>
                    </View>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Tema oscuro</Text>
                        <Switch
                            value={theme === 'dark'}
                            onValueChange={(v) => setTheme(v ? 'dark' : 'light')}
                            trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
                            thumbColor={theme === 'dark' ? '#3B7BFF' : '#CBD5E1'}
                        />
                    </View>
                </ProfileSectionCard>

                {/* Upgrade CTA for free users */}
                {user?.plan === 'free' && (
                    <TouchableOpacity
                        style={styles.upgradeCta}
                        onPress={() => router.push('/(modals)/plans')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.upgradeCtaTitle}>Actualiza tu plan</Text>
                        <Text style={styles.upgradeCtaDesc}>Obtén más documentos, almacenamiento y funciones exclusivas.</Text>
                    </TouchableOpacity>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerVersion}>Versión {Constants.expoConfig?.version ?? '1.0.0'}</Text>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

function parseStorageToBytes(str: string): number {
    const match = str.match(/^(\d+(?:\.\d+)?)\s*(KB|MB|GB)$/i);
    if (!match) return 0;
    const val = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    if (unit === 'KB') return val * 1_000;
    if (unit === 'GB') return val * 1_000_000_000;
    return val * 1_000_000;
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F8FAFF' },
    content: { padding: 20, gap: 16 },
    avatarSection: { alignItems: 'center', paddingVertical: 20, gap: 6 },
    userName: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
    userEmail: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
    planBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        marginTop: 4,
    },
    planIcon: { fontSize: 14 },
    planLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
    statsRow: { flexDirection: 'row', gap: 8 },
    statCard: { flex: 1 },
    skeleton: {
        height: 80,
        backgroundColor: '#E8EDF5',
        borderRadius: 14,
    },
    errorCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    errorText: { fontSize: 13, color: '#DC2626', fontWeight: '500' },
    retryBtn: {
        backgroundColor: '#DC2626',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    retryText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
    usageCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E8EDF5',
        padding: 16,
        gap: 8,
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
    usageRow: { flexDirection: 'row', justifyContent: 'space-between' },
    usageLabel: { fontSize: 12, fontWeight: '600', color: '#64748B' },
    usageValue: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
    progressTrack: {
        height: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: { height: '100%', borderRadius: 3 },
    warningText: { fontSize: 12, fontWeight: '600', color: '#F59E0B', textAlign: 'center' },
    upgradePrompt: { alignItems: 'center', gap: 8, marginTop: 4 },
    upgradeText: { fontSize: 12, fontWeight: '600', color: '#DC2626', textAlign: 'center' },
    upgradeBtn: {
        backgroundColor: '#3B7BFF',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    upgradeBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E8EDF5',
        padding: 4,
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
    menuDivider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 14 },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    settingLabel: { fontSize: 14, fontWeight: '500', color: '#0F172A' },
    settingValue: { fontSize: 14, color: '#94A3B8', fontWeight: '500' },
    upgradeCta: {
        backgroundColor: '#EFF6FF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        padding: 18,
        gap: 6,
    },
    upgradeCtaTitle: { fontSize: 16, fontWeight: '700', color: '#3B7BFF' },
    upgradeCtaDesc: { fontSize: 13, color: '#64748B', fontWeight: '500' },
    footer: { alignItems: 'center', gap: 12, paddingVertical: 8 },
    footerVersion: { fontSize: 12, color: '#CBD5E1', fontWeight: '500' },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FECACA',
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(220,38,38,0.06)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 6,
            },
            android: { elevation: 1 },
        }),
    },
    logoutText: { fontSize: 14, fontWeight: '700', color: '#DC2626' },
    avatarError: {
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    avatarErrorText: { fontSize: 12, color: '#DC2626', fontWeight: '500', textAlign: 'center' },
    uploadingText: { fontSize: 12, color: '#3B7BFF', fontWeight: '600', marginTop: 4 },
});
