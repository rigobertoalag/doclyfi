import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';

// ─── 1. Interfaz real del Backend ──────────────────────────────────────────────
export type ApiDocument = {
  title: string;
  document_type: string;
  created_at: string;
  vencimiento: string | null;
};

// ─── 2. Configs actualizadas para los tipos de tu BD ──────────────────────────
// Agregamos "shortName" para las 3 letricas que van dentro del ícono
const EXT_CONFIG: Record<string, { bg: string; border: string; shadow: string; color: string; emoji: string; shortName: string }> = {
  ticket:   { bg: '#FFFBEB', border: '#FDE68A', shadow: 'rgba(245,158,11,0.15)', color: '#D97706', emoji: '🧾', shortName: 'TCK' },
  contract: { bg: '#F0FDF4', border: '#BBF7D0', shadow: 'rgba(34,197,94,0.15)', color: '#16A34A', emoji: '🤝', shortName: 'CTR' },
  // Puedes dejar los anteriores por si a futuro agregas subida de archivos directos
  PDF:      { bg: '#FEF2F2', border: '#FECACA', shadow: 'rgba(239,68,68,0.15)',  color: '#DC2626', emoji: '📄', shortName: 'PDF' },
};
const EXT_DEFAULT = { bg: '#F8FAFF', border: '#E2E8F0', shadow: 'rgba(0,0,0,0.08)', color: '#64748B', emoji: '📎', shortName: 'DOC' };

type ExpiryStatus = 'urgent' | 'warning' | 'ok' | 'none';

// ─── Configs por estado de vencimiento ───────────────────────────────────────
const EXPIRY_CONFIG: Record<ExpiryStatus, { bg: string; border: string; color: string }> = {
  urgent:  { bg: '#FEF2F2', border: '#FECACA', color: '#DC2626' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', color: '#B45309' },
  ok:      { bg: '#F0FDF4', border: '#BBF7D0', color: '#16A34A' },
  none:    { bg: '#F8FAFF', border: '#E2E8F0', color: '#64748B' },
};

// ─── Funciones Auxiliares para formatear la data ──────────────────────────────
const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getExpiryInfo = (vencimiento: string | null): { status: ExpiryStatus, label: string } => {
  if (!vencimiento) return { status: 'none', label: 'Sin vigencia' };
  
  const vDate = new Date(vencimiento);
  const today = new Date();
  const diffTime = vDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { status: 'urgent', label: 'Vencido' };
  if (diffDays <= 30) return { status: 'warning', label: `Vence en ${diffDays} d` };
  return { status: 'ok', label: 'Vigente' };
};

// ─── Componente Principal ─────────────────────────────────────────────────────
type RecentDocumentsProps = {
  docs?: ApiDocument[];
  onSeeAll?: () => void;
  onDocPress?: (doc: ApiDocument) => void;
  onDocOptions?: (doc: ApiDocument) => void;
};

export function RecentDocuments({
  docs = [], // Agregamos fallback a array vacío por seguridad
  onSeeAll,
  onDocPress,
  onDocOptions,
}: RecentDocumentsProps) {
  if (docs.length === 0) return null; // Evita renderizar la tarjeta vacía si no hay docs

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Documentos recientes</Text>
        <TouchableOpacity
          style={styles.seeAllBtn}
          onPress={onSeeAll ?? (() => router.push('/(main)/dashboard'))}
        >
          <Text style={styles.seeAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {docs.map((doc, idx) => (
        <DocRow
          key={doc.created_at + idx} // Usamos fecha + index ya que tu JSON no trae 'id'
          doc={doc}
          isLast={idx === docs.length - 1}
          onPress={() => onDocPress?.(doc)}
          onOptions={() => onDocOptions?.(doc)}
        />
      ))}
    </View>
  );
}

// ─── DocRow ───────────────────────────────────────────────────────────────────
type DocRowProps = {
  doc: ApiDocument;
  isLast: boolean;
  onPress: () => void;
  onOptions: () => void;
};

function DocRow({ doc, isLast, onPress, onOptions }: DocRowProps) {
  // Mapeamos los datos del backend
  const ext = EXT_CONFIG[doc.document_type] ?? EXT_DEFAULT;
  const expiryInfo = getExpiryInfo(doc.vencimiento);
  const expiryStyles = EXPIRY_CONFIG[expiryInfo.status];
  const formattedDate = formatDate(doc.created_at);

  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* File icon */}
      <View
        style={[
          styles.fileIcon,
          { backgroundColor: ext.bg, borderColor: ext.border },
          Platform.OS === 'ios' && { shadowColor: ext.shadow },
        ]}
      >
        <Text style={[styles.fileExt, { color: ext.color }]}>{ext.shortName}</Text>
        <View style={styles.fileEmojiStrip}>
          <Text style={styles.fileEmoji}>{ext.emoji}</Text>
        </View>
      </View>

      {/* Meta */}
      <View style={styles.meta}>
        {/* Cambiamos doc.name por doc.title */}
        <Text style={styles.docName} numberOfLines={1}>{doc.title}</Text> 
        <View style={styles.subRow}>
          {/* Capitalizamos el tipo de documento (ej. "ticket" -> "Ticket") */}
          <Text style={styles.subText}>
            {doc.document_type}
          </Text>
          <View style={styles.subDot} />
          <Text style={styles.subText}>{formattedDate}</Text>
        </View>
      </View>

      {/* Expiry badge */}
      <View style={[styles.badge, { backgroundColor: expiryStyles.bg, borderColor: expiryStyles.border }]}>
        <Text style={[styles.badgeText, { color: expiryStyles.color }]}>
          {expiryInfo.label}
        </Text>
      </View>

      {/* Options */}
      <TouchableOpacity
        style={styles.optBtn}
        onPress={onOptions}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="ellipsis-vertical" size={15} color="#CBD5E1" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(59,123,255,0.08)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: { elevation: 3 },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B7BFF',
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  // File icon
  fileIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  fileExt: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  fileEmojiStrip: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileEmoji: {
    fontSize: 8,
  },

  // Meta
  meta: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  docName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.1,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  subText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  subDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
  },

  // Badge
  badge: {
    flexShrink: 0,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  // Options
  optBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});