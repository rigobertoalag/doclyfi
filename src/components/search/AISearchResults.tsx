import { DocumentRow } from '@/modules/documents/components/DocumentRow';
import { DocItem } from '@/modules/documents/types/document';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SearchStatus = 'idle' | 'loading' | 'results' | 'error';

const ACCENT_BY_CATEGORY: Record<string, string> = {
  warranty: '#3B7BFF',
  invoice: '#C2410C',
  deposit: '#7C3AED',
  services: '#0EA5E9',
  contracts: '#0D9488',
};

const ALL_SUGGESTIONS = [
  'facturas de servicios',
  'contratos vigentes',
  'compras con garantía',
  'pagos realizados',
  'documentos por vencer',
  'depósitos recientes',
  'recibos de nómina',
  'estados de cuenta',
  'pólizas de seguro',
  'órdenes de compra',
];

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface AISearchResultsProps {
  interpretation: string;
  results: DocItem[];
  status: SearchStatus;
  error: string | null;
  query: string;
  setQuery: (q: string) => void;
}

export function AISearchResults({
  interpretation,
  results,
  status,
  error,
  query,
  setQuery,
}: AISearchResultsProps) {
  const suggestions = useMemo(() => getRandomItems(ALL_SUGGESTIONS, 4), [query]);

  if (status === 'idle' || status === 'loading') return null;

  const errorMessage = (() => {
    if (!error) return null;
    if (error === 'AI_TIMEOUT') return 'La búsqueda tardó demasiado, intenta de nuevo';
    if (error === 'AI_PARSE_ERROR') return 'No se pudo procesar tu búsqueda, reformúlala';
    return 'Error al buscar, verifica tu conexión';
  })();

  return (
    <View style={styles.container}>
      {status === 'error' && errorMessage && (
        <View style={styles.errorContainer}>
          <View style={styles.errorIconWrap}>
            <Ionicons name="alert-circle-outline" size={28} color="#EF4444" />
          </View>
          <Text style={styles.errorTitle}>Error en la búsqueda</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      )}
      {status === 'results' && (
        <>
          {interpretation ? (
            <View style={styles.interpretationChip}>
              <Ionicons name="bulb-outline" size={14} color="#3B7BFF" />
              <Text style={styles.interpretationText}>
                Buscando: {interpretation}
              </Text>
            </View>
          ) : null}

          {(results ?? []).length > 0 ? (
            <>
              <Text style={styles.resultCount}>
                Se encontraron {results.length} documentos
              </Text>
              <View style={styles.resultsCard}>
                {results.map((doc, idx) => (
                  <DocumentRow
                    key={doc.id}
                    doc={doc}
                    isLast={idx === results.length - 1}
                    accentColor={ACCENT_BY_CATEGORY[doc.categoryId] ?? '#3B7BFF'}
                  />
                ))}
              </View>
              <View style={styles.subtleSuggestions}>
                <View style={styles.subtleDivider} />
                <View style={styles.subtleSuggestionsBody}>
                  <Text style={styles.subtleSuggestionsLabel}>También prueba:</Text>
                  <View style={styles.subtleSuggestionsChips}>
                    {suggestions.map(s => (
                      <TouchableOpacity
                        key={s}
                        onPress={() => setQuery(s)}
                        activeOpacity={0.65}
                        style={styles.subtleChip}
                      >
                        <Text style={styles.subtleChipText}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="file-tray-outline" size={40} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>
                {interpretation || 'Sin resultados para tu búsqueda'}
              </Text>
              {interpretation ? null : (
                <Text style={styles.emptySub}>
                  Intenta con otras palabras o sé más específico
                </Text>
              )}
              <View style={styles.suggestionsRow}>
                <Text style={styles.suggestionsLabel}>Sugerencias de búsqueda:</Text>
                <View style={styles.suggestionsChips}>
                  {suggestions.map(s => (
                    <TouchableOpacity
                      key={s}
                      style={styles.suggestionChip}
                      onPress={() => setQuery(s)}
                      activeOpacity={0.75}
                    >
                      <Ionicons name="search-outline" size={12} color="#3B7BFF" />
                      <Text style={styles.suggestionText}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: 'rgba(59,123,255,0.07)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  android: { elevation: 2 },
});

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  interpretationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  interpretationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B7BFF',
  },
  resultCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  resultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 17,
  },
  suggestionsRow: {
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  suggestionsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EDF5',
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B7BFF',
  },
  subtleSuggestions: {
    gap: 0,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  subtleDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 10,
  },
  subtleSuggestionsBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  subtleSuggestionsLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  subtleSuggestionsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  subtleChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  subtleChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    ...CARD_SHADOW,
  },
  errorIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
  },
});
