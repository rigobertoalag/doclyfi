import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

type AlertVariant = 'urgent' | 'important' | 'normal';

type AlertBadgeProps = {
  variant: AlertVariant;
  icon: string;
  label: string;
};

const VARIANT_STYLES = {
  urgent: {
    container: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
    text: { color: '#DC2626' },
    icon: '#DC2626',
    shadow: 'rgba(220, 38, 38, 0.12)',
  },
  important: {
    container: { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' },
    text: { color: '#C2410C' },
    icon: '#C2410C',
    shadow: 'rgba(194, 65, 12, 0.12)',
  },
  normal: {
    container: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
    text: { color: '#4338CA' },
    icon: '#4338CA',
    shadow: 'rgba(67, 56, 202, 0.10)',
  },
} as const;

export function AlertBadge({ variant, icon, label }: AlertBadgeProps) {
  const v = VARIANT_STYLES[variant];

  return (
    <View style={[styles.badge, v.container, { shadowColor: v.shadow }]}>
      <Ionicons name={icon as any} size={15} color={v.icon} />
      <Text style={[styles.label, v.text]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});