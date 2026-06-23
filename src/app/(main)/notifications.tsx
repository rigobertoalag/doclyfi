import { NOTIFICATIONS_DATA } from '@/mocks/notifications';
import { Colors } from '@/constants/colors';
import { screen, shadow } from '@/constants/styles';
import { CaptureHeader } from '@/components/capture/CaptureHeader';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ─────────────────────────────────────────────────────────────────────
type NotificationFilter = 'Todas' | 'Alertas' | 'Documentos';

type NotificationItem = {
  id: string;
  type: 'alert' | 'document' | 'success' | 'system';
  title: string;
  description: string;
  time: string;
  unread: boolean;
};

const FILTER_MAP: Record<NotificationFilter, string[]> = {
  Todas: ['alert', 'document', 'success', 'system'],
  Alertas: ['alert'],
  Documentos: ['document'],
};

// ─── Screen ────────────────────────────────────────────────────────────────────
export default function NotificationsScreen() {
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('Todas');

  const filteredSections = useMemo(() => {
    const allowed = FILTER_MAP[activeFilter];
    return NOTIFICATIONS_DATA
      .map(section => ({
        ...section,
        data: section.data.filter(item => allowed.includes(item.type)),
      }))
      .filter(section => section.data.length > 0);
  }, [activeFilter]);

  const unreadCount = useMemo(
    () => NOTIFICATIONS_DATA.reduce((acc, s) => acc + s.data.filter(n => n.unread).length, 0),
    [],
  );

  const renderNotificationIcon = (type: NotificationItem['type']) => {
    const config = {
      alert: { icon: 'notifications-outline' as const, color: '#D9381E', bg: '#FFF5F5' },
      document: { icon: 'document-outline' as const, color: '#2B6CB0', bg: '#EBF8FF' },
      success: { icon: 'link-outline' as const, color: '#2F855A', bg: '#E6FFFA' },
      system: { icon: 'settings-outline' as const, color: '#4A5568', bg: '#EDF2F7' },
    } as const;

    const c = config[type];
    return (
      <View style={[styles.iconContainer, { backgroundColor: c.bg }]}>
        <Ionicons name={c.icon} size={22} color={c.color} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CaptureHeader onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.subHeader}>
          <Text style={styles.unreadCount}>Tienes {unreadCount} sin leer</Text>
          <TouchableOpacity>
            <Text style={styles.markReadText}>Marcar todas como leídas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          {(['Todas', 'Alertas', 'Documentos'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            const iconMap: Record<string, any> = {
              Alertas: 'warning-outline',
              Documentos: 'document-text-outline',
            };
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter)}
              >
                {iconMap[filter] && (
                  <Ionicons
                    name={iconMap[filter]}
                    size={16}
                    color={isActive ? '#FFF' : '#4A5568'}
                    style={styles.chipIcon}
                  />
                )}
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredSections.map((section) => (
          <View key={section.title} style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>{section.title}</Text>

            {section.data.map((item) => (
              <View key={item.id} style={styles.card}>
                {renderNotificationIcon(item.type)}

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardDescription}>
                    {item.description}
                  </Text>
                  <Text style={styles.cardTime}>
                    {item.time}
                  </Text>
                </View>

                {item.unread && <View style={styles.unreadDot} />}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: screen,
  scrollContainer: {
    paddingBottom: 24,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  unreadCount: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  markReadText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  chipIcon: {
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#718096',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    ...shadow.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 4,
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 13,
    color: '#718096',
    lineHeight: 18,
    marginBottom: 6,
  },
  cardTime: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: 18,
    right: 16,
  },
});
