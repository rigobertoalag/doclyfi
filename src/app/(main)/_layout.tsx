import { Colors } from '@/shared/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES, router } from '@/shared/lib/routes';
import { Tabs } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Animated Tab Icon ─────────────────────────────────────────────────────────
function AnimatedTabIcon({ active, icon, size, color }: { active: boolean; icon: string; size: number; color: string }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(active ? 1.15 : 1, { stiffness: 250, damping: 15 });
  }, [active]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Ionicons name={icon as any} size={size} color={color} />
    </Animated.View>
  );
}

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────
const TAB_ICON_CONFIG: Record<string, { active: string; inactive: string }> = {
  dashboard: { active: 'home', inactive: 'home-outline' },
  documents: { active: 'document-text', inactive: 'document-text-outline' },
  reports: { active: 'stats-chart', inactive: 'stats-chart-outline' },
  profile: { active: 'person-circle', inactive: 'person-circle-outline' },
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(20);
  const tabPositions = useRef<Record<string, { x: number; w: number }>>({});

  const TABS = [
    { name: 'dashboard', label: 'Inicio', icon: 'home' },
    { name: 'documents', label: 'Documentos', icon: 'document-text' },
    { name: '__fab__', label: '', icon: 'add' },
    { name: 'reports', label: 'Reportes', icon: 'stats-chart' },
    { name: 'profile', label: 'Perfil', icon: 'person-circle' },
  ] as const;

  const onTabLayout = useCallback((name: string, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    tabPositions.current[name] = { x, w: width };
    if (state.index === TABS.findIndex((t) => t.name === name)) {
      indicatorX.value = x + width / 2 - 10;
      indicatorW.value = 20;
    }
  }, []);

  const onTabPress = useCallback((tabName: string, index: number) => {
    const pos = tabPositions.current[tabName];
    if (pos) {
      indicatorX.value = withSpring(pos.x + pos.w / 2 - 10, { stiffness: 200, damping: 20 });
      indicatorW.value = withSpring(20, { stiffness: 200, damping: 20 });
    }
    navigation.jumpTo(tabName);
  }, [navigation]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorW.value,
  }));

  return (
    <View style={[styles.barWrapper, { paddingBottom: insets.bottom || 12 }]}>
      <View style={styles.bar}>
        {TABS.map((tab, idx) => {
          // ── FAB central ────────────────────────────────────────
          if (tab.name === '__fab__') {
            return (
              <View key="fab" style={styles.fabSlot}>
                <TouchableOpacity
                  style={styles.fab}
                  onPress={() => router.push(ROUTES.PURCHASE('warranty'))}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add" size={28} color={Colors.background} />
                </TouchableOpacity>
              </View>
            );
          }

          const route = state.routes.find((r: any) => r.name === tab.name);
          const routeIndex = state.routes.indexOf(route);
          const isActive = state.index === routeIndex;
          const icons = TAB_ICON_CONFIG[tab.name];

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => onTabPress(tab.name, idx)}
              onLayout={(e) => onTabLayout(tab.name, e)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrap}>
                <AnimatedTabIcon
                  active={isActive}
                  icon={(isActive ? icons.active : icons.inactive) as any}
                  size={22}
                  color={isActive ? Colors.primary : '#94A3B8'}
                />
              </View>

              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <Animated.View style={[styles.activeBar, indicatorStyle]} />
      </View>
    </View>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function MainLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="documents" />
      <Tabs.Screen name="reports" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  barWrapper: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: '#E8EDF5',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(59,123,255,0.08)',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
    }),
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingHorizontal: 4,
  },

  // Normal tab
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 4,
    position: 'relative',
  },
  activeBar: {
    position: 'absolute',
    top: -8,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  iconWrap: {
    position: 'relative',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.1,
  },
  labelActive: {
    color: Colors.primary,
  },

  // FAB
  fabSlot: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 6,
  },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
    marginTop: -20, // sube el FAB sobre la barra
    ...Platform.select({
      ios: {
        shadowColor: Colors.fabShadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: { elevation: 10 },
    }),
  },
});