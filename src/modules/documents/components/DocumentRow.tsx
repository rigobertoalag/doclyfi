import { DocItem } from '@/modules/documents/types/document';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type DocStatus = 'active' | 'expiring' | 'expired' | 'paid' | 'pending' | 'processed';
type FileType = 'PDF' | 'IMG' | 'DOC' | 'XLS';

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; border: string }> = {
  active: { label: 'Activo', color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4' },
  expiring: { label: 'Por vencer', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  expired: { label: 'Vencido', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  paid: { label: 'Pagado', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  pending: { label: 'Pendiente', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  processed: { label: 'Procesado', color: '#3B7BFF', bg: '#EFF6FF', border: '#BFDBFE' },
};

const FILE_TYPE_CONFIG: Record<FileType, { color: string; bg: string }> = {
  PDF: { color: '#DC2626', bg: '#FEF2F2' },
  IMG: { color: '#7C3AED', bg: '#FDF4FF' },
  DOC: { color: '#2563EB', bg: '#EFF6FF' },
  XLS: { color: '#16A34A', bg: '#F0FDF4' },
};

export function DocumentRow({ doc, isLast, accentColor }: {
  doc: DocItem; isLast: boolean; accentColor: string;
}) {
  const status = STATUS_CONFIG[doc.status];
  const fileConf = FILE_TYPE_CONFIG[doc.fileType];

  return (
    <TouchableOpacity
      style={[styles.docRow, !isLast && styles.docRowBorder]}
      activeOpacity={0.75}
      onPress={() => router.push(`/document/${doc.id}`)}
    >
      {/* <View style={styles.docIconOuter}>
        <View style={[styles.docIconInner, { backgroundColor: fileConf.bg }]}>
          <Text style={styles.docEmoji}>{doc.icon}</Text>
        </View>
        <View style={[styles.fileTypeBadge, { backgroundColor: fileConf.bg, borderColor: fileConf.color + '30' }]}>
          <Text style={[styles.fileTypeText, { color: fileConf.color }]}>{doc.fileType}</Text>
        </View>
      </View> */}

      {/* ── Miniatura ── */}
      <View style={styles.docIconOuter}>
        {doc.thumbnailUrl ? (
          <Image
            source={{ uri: doc.thumbnailUrl }}
            // style={styles.docThumb}
            style={[styles.docThumb, { backgroundColor: fileConf.bg }]}
            contentFit="cover"
            transition={150}
            // placeholder={{ color: fileConf.bg }}
          />
        ) : (
          // Fallback si aún no tiene archivo
          <View style={[styles.docThumb, {
            backgroundColor: fileConf.bg,
            alignItems: 'center',
            justifyContent: 'center',
          }]}>
            <Ionicons name="document-outline" size={20} color={fileConf.color} />
          </View>
        )}
        <View style={[styles.fileTypeBadge, {
          backgroundColor: fileConf.bg,
          borderColor: `${fileConf.color}30`,
        }]}>
          <Text style={[styles.fileTypeText, { color: fileConf.color }]}>
            {doc.fileType}
          </Text>
        </View>
      </View>

      <View style={styles.docMeta}>
        <Text style={styles.docName} numberOfLines={1} ellipsizeMode="tail">{doc.name}</Text>
        <View style={styles.docSubRow}>
          <Text style={styles.docProvider} numberOfLines={1} ellipsizeMode="tail">{doc.provider}</Text>
          <Text style={styles.docDot}>·</Text>
          <Text style={styles.docDate}>{doc.date}</Text>
        </View>
        <View style={styles.docBottomRow}>
          {doc.amount !== null && doc.amount > 0 && (
            <Text style={[styles.docAmount, { color: accentColor }]}>
              ${doc.amount.toLocaleString('es-MX')}
            </Text>
          )}
          <Text style={styles.docSize}>{doc.fileSize}</Text>
        </View>
      </View>

      <View style={styles.docRight}>
        <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.border }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
        <TouchableOpacity
          style={styles.menuBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="ellipsis-vertical" size={15} color="#CBD5E1" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  docRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F8FAFF' },
  docIconOuter: { position: 'relative', flexShrink: 0 },
  docThumb: {
    width: 42, height: 42, borderRadius: 10, overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  docEmoji: { fontSize: 20 },
  fileTypeBadge: {
    position: 'absolute', bottom: -3, right: -4,
    paddingHorizontal: 4, paddingVertical: 1,
    borderRadius: 5, borderWidth: 1,
  },
  fileTypeText: { fontSize: 7, fontWeight: '800', letterSpacing: 0.2 },
  docMeta: { flex: 1, minWidth: 0, gap: 2 },
  docName: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  docSubRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  docProvider: { fontSize: 11, color: '#64748B', flexShrink: 1 },
  docDot: { fontSize: 11, color: '#CBD5E1' },
  docDate: { fontSize: 11, color: '#94A3B8' },
  docBottomRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 1 },
  docAmount: { fontSize: 14, fontWeight: '800' },
  docSize: { fontSize: 10, color: '#CBD5E1' },
  docRight: { alignItems: 'flex-end', gap: 6, flexShrink: 0 },
  statusBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  statusText: { fontSize: 10, fontWeight: '700' },
  menuBtn: { padding: 2 },
});
