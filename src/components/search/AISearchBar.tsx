import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

const PLACEHOLDERS = [
  '¿Qué documentos buscas?',
  'Ej: cafés comprados en Liverpool',
  'Ej: facturas de luz del año pasado',
  'Ej: contratos por vencer',
];

const PLACEHOLDER_INTERVAL = 3000;

type SearchStatus = 'idle' | 'loading' | 'results' | 'error';

interface AISearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  status: SearchStatus;
}

export function AISearchBar({ query, setQuery, status }: AISearchBarProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setPlaceholderIndex(prev => (prev + 1) % PLACEHOLDERS.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }, PLACEHOLDER_INTERVAL);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.accentBar} />
      <View style={styles.headerRow}>
        <Animated.View style={{ opacity: pulseAnim }}>
          <Ionicons name="sparkles" size={14} color="#3B7BFF" />
        </Animated.View>
        <Text style={styles.headerLabel}>Búsqueda inteligente</Text>
      </View>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder={PLACEHOLDERS[placeholderIndex]}
          placeholderTextColor="#94A3B8"
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        )}
        {status === 'loading' && (
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    paddingBottom: 12,
    paddingHorizontal: 14,
    paddingTop: 0,
    overflow: 'hidden',
    shadowColor: 'rgba(59,123,255,0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  accentBar: {
    height: 4,
    backgroundColor: '#3B7BFF',
    marginHorizontal: -14,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B7BFF',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B7BFF',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});
