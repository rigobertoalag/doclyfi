import { AlertBadge } from '@/components/ui/dashboard/AlertBadge';
import { CategoryGrid } from '@/components/ui/dashboard/CategoryGrid';
import { FinancialSummary } from '@/components/ui/dashboard/FinancialSummary';
import { ProUpsellBanner } from '@/components/ui/dashboard/ProUpsellBanner';
import { RecentDocuments } from '@/components/ui/dashboard/RecentDocuments';
import { ErrorScreen } from '@/components/ui/ErrorScreen';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Colors } from '@/constants/colors';
import { card, link, sectionHeader } from '@/constants/styles';
import { useDashboard } from '@/hooks/useDashboard';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '../../../context/AuthContext';

export default function DashboardScreen() {
  const { user, logout } = useAuthContext();
  const { data, isLoading, error, refetch } = useDashboard();

  useEffect(() => {
    // fetchDocuments();
  }, []);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  })();

  if (isLoading) return <LoadingScreen />;
  if (error) return (
    <ErrorScreen
      message={error}
      onRetry={refetch}
    />
  ); if (!data) return null;

  console.log('data', data)

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#3B7BFF"
          />
        }
      >
        <Animated.View entering={FadeIn.duration(400)}>
        {/* ── Header ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('/home/rigoalag/doclyfi-app/assets/doclyfi_images/logo_no_background.png')}
              style={styles.logo}
            />
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.userName}>{data.user.fullName.split(' ')[0]} 👋</Text>
          </View>
          <View style={styles.headerRight}>

            {/* Contenedor de la campana */}
            <TouchableOpacity style={styles.bellContainer} onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={24} color="#333" />

              {/* Indicador de notificación (el puntito rojo) */}
              <View style={styles.notificationDot}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700', textAlign: 'center', lineHeight: 20 }}>3</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{data.user.fullName.trim().charAt(0).toUpperCase()}</Text>
            </View>

          </View>
        </View>

        {/* search bar */}
        <View style={styles.searchBarContainer}>
          {/* Lupa del lado izquierdo */}
          <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />

          {/* Input que abarca casi todo el espacio */}
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar documentos..."
            placeholderTextColor="#888"
          />

          {/* Botón al costado derecho */}
          <TouchableOpacity style={styles.searchButtonText}>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Alertas de Vencimiento */}
        <View style={card.lg}>

          <View style={[sectionHeader.row, styles.alertsHeader]}>
            <Text style={sectionHeader.title}>Tus alertas</Text>
            <TouchableOpacity>
              <Text style={link.seeAll}>Ver todas (12)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.alertsRow}>
            <View style={styles.alertIconContainer}>
              <Ionicons name="time-outline" size={20} color="#3B7BFF" />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.alertsList}
            >
              <AlertBadge
                variant="urgent"
                icon="shield-checkmark-outline"
                label="1 garantía vence hoy"
              />
              <AlertBadge
                variant="urgent"
                icon="create-outline"
                label="1 contrato vence hoy"
              />
              <AlertBadge
                variant="important"
                icon="construct-outline"
                label="1 servicio vence en 7 días"
              />
              <AlertBadge
                variant="normal"
                icon="calendar-outline"
                label="12 alertas en 30 días"
              />
            </ScrollView>
          </View>

        </View>

        <CategoryGrid onNewDocument={() => router.push('/dashboard')} />

        {user?.plan === 'free' && (
          <ProUpsellBanner onPress={() => router.push('/(modals)/plans')} />
        )}

        <FinancialSummary />

        {/* <RecentDocuments
          // onDocPress={(doc) => router.push(`/(main)/documents/${doc.id}`)}
          onDocPress={(doc) => router.push(`/(main)/dashboard`)}
          onDocOptions={(doc) => console.log('options:', doc.id)}
        /> */}

        <RecentDocuments docs={data.recentDocuments} />

        {/* Bottom spacing for FAB */}
        <View style={styles.fabSpacer} />
      </Animated.View>
      </ScrollView>

      {/* ── FAB ───────────────────────────────────────────────────── */}
      <View style={styles.fabContainer}>
        {/* <FAB onPress={() => router.push('/upload')} /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: `${Colors.primary}50`,
    marginTop: 5,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  fabSpacer: {
    height: 100,
  },
  fabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 94 : 72,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  logo: {
    width: 150,
    height: 50,
    left: 0,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  bellContainer: {
    position: 'relative',
    padding: 5,
  },
  notificationDot: {
    position: 'absolute',
    top: -5,
    right: 0,
    width: 20,
    height: 20,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e6e6e6',
    borderWidth: 2,
    borderRadius: 12,
    marginHorizontal: 0,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: 40,
  },
  searchButtonText: {
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  alertsHeader: {
    marginBottom: 12,
  },
  alertsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alertIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF4FF',
    borderWidth: 1,
    borderColor: '#C7D7FE',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  alertsList: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 4,
  },
});