import { CaptureHeader } from '@/components/capture/CaptureHeader';
import { useDocumentDetail } from '@/hooks/useDocumentDetail';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert, Platform, ScrollView, StyleSheet,
    Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────
type DocStatus = 'active' | 'expiring' | 'expired' | 'paid' | 'pending' | 'processed';
type DocCategory = 'warranty' | 'invoice' | 'deposit' | 'services' | 'contracts';
type FileType = 'PDF' | 'IMG' | 'DOC' | 'XLS';

type LinkedDoc = {
    id: string;
    name: string;
    subtitle: string;
    isPrimary: boolean;
    thumbnail?: string;
};

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<DocCategory, {
    label: string; icon: string; color: string; bg: string; border: string;
}> = {
    warranty: { label: 'Compras c/Garantía', icon: 'shield-checkmark-outline', color: '#3B7BFF', bg: '#EFF6FF', border: '#BFDBFE' },
    invoice: { label: 'Archivado', icon: 'documents-outline', color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
    deposit: { label: 'Depósitos', icon: 'arrow-down-circle-outline', color: '#7C3AED', bg: '#FDF4FF', border: '#E9D5FF' },
    services: { label: 'Servicios', icon: 'flash-outline', color: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD' },
    contracts: { label: 'Contratos', icon: 'document-text-outline', color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4' },
};

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string }> = {
    active: { label: 'Activo', color: '#FFFFFF', bg: '#0D9488' },
    expiring: { label: 'Por Vencer', color: '#FFFFFF', bg: '#D97706' },
    expired: { label: 'Vencido', color: '#FFFFFF', bg: '#DC2626' },
    paid: { label: 'Pago Realizado', color: '#FFFFFF', bg: '#16A34A' },
    pending: { label: 'Pendiente', color: '#FFFFFF', bg: '#F59E0B' },
    processed: { label: 'Procesado', color: '#FFFFFF', bg: '#3B7BFF' },
};

const FILE_TYPE_CONFIG: Record<FileType, { color: string; bg: string; icon: string }> = {
    PDF: { color: '#DC2626', bg: '#FEF2F2', icon: 'document-outline' },
    IMG: { color: '#7C3AED', bg: '#FDF4FF', icon: 'image-outline' },
    DOC: { color: '#2563EB', bg: '#EFF6FF', icon: 'document-outline' },
    XLS: { color: '#16A34A', bg: '#F0FDF4', icon: 'grid-outline' },
};



// ─── Screen ───────────────────────────────────────────────────────────────────
export default function DocumentDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    // ── Fuente de datos real — reemplaza MOCK_DOCUMENTS ───────
    const { data: doc, loading, error } = useDocumentDetail(id ?? '');

    // ── useState SIEMPRE antes de cualquier return condicional ─
    const [linkedDocs, setLinkedDocs] = useState<typeof doc extends null ? [] : typeof doc['linkedDocs']>([]);

    // Sincronizar linkedDocs cuando lleguen los datos
    useEffect(() => {
        if (doc?.linkedDocs) {
            setLinkedDocs(doc.linkedDocs);
        }
    }, [doc?.linkedDocs]);

    // ── Estado de carga ───────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
                <CaptureHeader onBack={() => router.dismiss()} />
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" color="#3B7BFF" />
                    <Text style={styles.loadingText}>Cargando documento...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // ── Error o no encontrado ─────────────────────────────────
    if (error || !doc) {
        return (
            <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
                <CaptureHeader onBack={() => router.dismiss()} />
                <View style={styles.loadingWrap}>
                    <Ionicons name="cloud-offline-outline" size={40} color="#CBD5E1" />
                    <Text style={styles.errorTitle}>
                        {error === 'DOCUMENT_NOT_FOUND'
                            ? 'Documento no encontrado'
                            : 'No se pudo cargar el documento'}
                    </Text>
                    <TouchableOpacity onPress={() => router.dismiss()}>
                        <Text style={styles.errorBack}>Volver a documentos</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // ── A partir de aquí todo igual que antes ─────────────────
    const cat = CATEGORY_CONFIG[doc.category as DocCategory];
    const status = STATUS_CONFIG[doc.status as DocStatus];
    const file = FILE_TYPE_CONFIG[doc.fileType as FileType];

    const handleUnlink = (docId: string) => {
        Alert.alert('Desvincular', '¿Deseas desvincular este documento?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Desvincular',
                style: 'destructive',
                onPress: () => setLinkedDocs(prev => prev.filter(d => d.id !== docId)),
            },
        ]);
    };

    const handleLinkNew = () => {
        router.push({ pathname: '/document/LinkDocument', params: { sourceId: doc.id } });
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

            <CaptureHeader onBack={() => router.dismiss()} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Document header card ──────────────────────────── */}
                <View style={styles.headerCard}>
                    <View style={styles.headerCardTop}>
                        {/* Icon */}
                        <View style={[styles.docIconWrap, { backgroundColor: cat.bg }]}>
                            <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                        </View>

                        {/* Title */}
                        <View style={styles.headerCardText}>
                            <Text style={styles.docTitle}>{doc.title}</Text>
                            <Text style={styles.docSubtitle}>{doc.subtitle}</Text>
                        </View>

                        {/* Status badge */}
                        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                            <Text style={[styles.statusText, { color: status.color }]}>
                                {status.label.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    {/* Amount block */}
                    <View style={[styles.amountBlock, { borderColor: cat.border }]}>
                        <Text style={styles.amountLabel}>MONTO TOTAL</Text>
                        <Text style={[styles.amountValue, { color: cat.color }]}>
                            {doc.amount !== null
                                ? `$${doc.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} ${doc.currency}`
                                : 'Sin monto'}
                        </Text>
                        <Text style={styles.amountDate}>{doc.date}</Text>
                    </View>

                    {/* Quick actions */}
                    <View style={styles.quickActions}>
                        <QuickAction icon="eye-outline" label="Ver archivo" color={cat.color} />
                        <QuickAction icon="download-outline" label="Descargar" color={cat.color} />
                        <QuickAction icon="pencil-outline" label="Editar" color={cat.color} />
                        <QuickAction icon="trash-outline" label="Eliminar" color="#EF4444" />
                    </View>
                </View>

                {/* ── Detailed info ─────────────────────────────────── */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>INFORMACIÓN DETALLADA</Text>

                    {/* Main fields — 2 column grid */}
                    <View style={styles.fieldsGrid}>
                        <InfoField
                            label="Categoría"
                            value={cat.label}
                            icon={cat.icon}
                            iconColor={cat.color}
                            iconBg={cat.bg}
                        />
                        <InfoField
                            label="Proveedor"
                            value={doc.provider}
                            icon="business-outline"
                            iconColor="#3B7BFF"
                            iconBg="#EFF6FF"
                        />
                        <InfoField
                            label="Identificador"
                            value={doc.identifier}
                            icon="pricetag-outline"
                            iconColor="#64748B"
                            iconBg="#F8FAFF"
                        />
                        <InfoField
                            label="Formato"
                            value={`${doc.fileType} (${doc.fileSize})`}
                            icon={file.icon}
                            iconColor={file.color}
                            iconBg={file.bg}
                        />
                    </View>

                    {/* Divider */}
                    {doc.extraFields.length > 0 && <View style={styles.divider} />}

                    {/* Extra fields — specific to document type */}
                    {doc.extraFields.length > 0 && (
                        <View style={styles.fieldsGrid}>
                            {doc.extraFields.map(f => (
                                <InfoField
                                    key={f.label}
                                    label={f.label}
                                    value={f.value}
                                    icon={f.icon}
                                    iconColor={f.iconColor}
                                    iconBg={f.iconColor + '15'}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* ── Linked documents ──────────────────────────────── */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionLabel}>
                            DOCUMENTOS VINCULADOS ({linkedDocs.length})
                        </Text>
                        {linkedDocs.length > 0 && (
                            <TouchableOpacity onPress={handleLinkNew}>
                                <Text style={[styles.addMoreLink, { color: cat.color }]}>
                                    + Agregar
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {linkedDocs.length === 0 ? (
                        <View style={styles.noLinkedDocs}>
                            <Ionicons name="link-outline" size={24} color="#CBD5E1" />
                            <Text style={styles.noLinkedTitle}>Sin documentos vinculados</Text>
                            <Text style={styles.noLinkedSub}>
                                Vincula facturas, contratos o recibos relacionados con este documento.
                            </Text>
                        </View>
                    ) : (
                        linkedDocs.map((ld, idx) => (
                            <LinkedDocRow
                                key={ld.id}
                                doc={ld}
                                accentColor={cat.color}
                                isLast={idx === linkedDocs.length - 1}
                                onUnlink={() => handleUnlink(ld.id)}
                            />
                        ))
                    )}
                </View>

                {/* ── Timeline / Activity ───────────────────────────── */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>ACTIVIDAD</Text>
                    <View style={styles.timeline}>
                        {[
                            { icon: 'scan-outline', color: '#3B7BFF', label: 'Documento escaneado con OCR', date: doc.date },
                            { icon: 'checkmark-circle-outline', color: '#16A34A', label: 'Datos verificados y guardados', date: doc.date },
                            { icon: 'link-outline', color: '#7C3AED', label: `${linkedDocs.length} documentos vinculados`, date: doc.date },
                        ].map((event, idx, arr) => (
                            <View key={idx} style={styles.timelineRow}>
                                <View style={styles.timelineLeft}>
                                    <View style={[styles.timelineDot, { backgroundColor: event.color + '18', borderColor: event.color + '30' }]}>
                                        <Ionicons name={event.icon as any} size={13} color={event.color} />
                                    </View>
                                    {idx < arr.length - 1 && <View style={styles.timelineLine} />}
                                </View>
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineLabel}>{event.label}</Text>
                                    <Text style={styles.timelineDate}>{event.date}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Spacer for sticky button */}
                <View style={{ height: 80 }} />
            </ScrollView>

            {/* ── Sticky CTA ─────────────────────────────────────── */}
            <View style={styles.stickyFooter}>
                <TouchableOpacity
                    style={[styles.ctaBtn, { backgroundColor: cat.color }]}
                    onPress={handleLinkNew}
                    activeOpacity={0.85}
                >
                    <Ionicons name="link-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.ctaBtnText}>Vincular nuevo documento</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// ─── Quick action button ──────────────────────────────────────────────────────
function QuickAction({ icon, label, color }: { icon: string; label: string; color: string }) {
    return (
        <TouchableOpacity style={styles.quickAction} activeOpacity={0.75}>
            <View style={[styles.quickActionIcon, { backgroundColor: color + '12' }]}>
                <Ionicons name={icon as any} size={17} color={color} />
            </View>
            <Text style={[styles.quickActionLabel, { color: color === '#EF4444' ? '#EF4444' : '#475569' }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

// ─── Info field ───────────────────────────────────────────────────────────────
function InfoField({ label, value, icon, iconColor, iconBg }: {
    label: string; value: string;
    icon: string; iconColor: string; iconBg: string;
}) {
    return (
        <View style={styles.infoField}>
            <Text style={styles.infoFieldLabel}>{label}</Text>
            <View style={styles.infoFieldValue}>
                <View style={[styles.infoFieldIcon, { backgroundColor: iconBg }]}>
                    <Ionicons name={icon as any} size={13} color={iconColor} />
                </View>
                <Text style={styles.infoFieldText} numberOfLines={1}>{value}</Text>
            </View>
        </View>
    );
}

// ─── Linked document row ──────────────────────────────────────────────────────
function LinkedDocRow({ doc, accentColor, isLast, onUnlink }: {
    doc: LinkedDoc; accentColor: string;
    isLast: boolean; onUnlink: () => void;
}) {
    return (
        <TouchableOpacity
            style={[styles.linkedRow, !isLast && styles.linkedRowBorder]}
            activeOpacity={0.75}
        >
            {/* Thumbnail placeholder */}
            <View style={styles.linkedThumb}>
                <Ionicons name="document-outline" size={18} color="#94A3B8" />
            </View>

            {/* Info */}
            <View style={styles.linkedMeta}>
                {doc.isPrimary && (
                    <View style={[styles.primaryBadge, { backgroundColor: accentColor }]}>
                        <Text style={styles.primaryBadgeText}>PRINCIPAL</Text>
                    </View>
                )}
                <Text style={styles.linkedName}>{doc.name}</Text>
                <Text style={styles.linkedSub}>{doc.subtitle}</Text>
            </View>

            <View style={styles.linkedRight}>
                <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                <TouchableOpacity
                    onPress={onUnlink}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.unlinkBtn}
                >
                    <Ionicons name="close-circle-outline" size={16} color="#FDA4AF" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_SHADOW = Platform.select({
    ios: { shadowColor: 'rgba(59,123,255,0.07)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10 },
    android: { elevation: 2 },
});

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F8FAFF' },
    scrollContent: { padding: 16, gap: 12 },

    // Header card
    headerCard: {
        backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1,
        borderColor: '#E8EDF5', padding: 16, gap: 14, ...CARD_SHADOW,
    },
    headerCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    docIconWrap: {
        width: 48, height: 48, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    headerCardText: { flex: 1, gap: 3 },
    docTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3, lineHeight: 22 },
    docSubtitle: { fontSize: 12, color: '#64748B' },
    statusBadge: {
        paddingHorizontal: 10, paddingVertical: 5,
        borderRadius: 8, alignSelf: 'flex-start', flexShrink: 0,
    },
    statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },

    // Amount block
    amountBlock: {
        alignItems: 'center', paddingVertical: 18,
        borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed',
        backgroundColor: '#FAFBFF',
        gap: 4,
    },
    amountLabel: { fontSize: 11, fontWeight: '600', color: '#94A3B8', letterSpacing: 1 },
    amountValue: { fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
    amountDate: { fontSize: 12, color: '#94A3B8', marginTop: 2 },

    // Quick actions
    quickActions: { flexDirection: 'row', justifyContent: 'space-around' },
    quickAction: { alignItems: 'center', gap: 6 },
    quickActionIcon: {
        width: 44, height: 44, borderRadius: 13,
        alignItems: 'center', justifyContent: 'center',
    },
    quickActionLabel: { fontSize: 11, fontWeight: '500' },

    // Section
    section: {
        backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1,
        borderColor: '#E8EDF5', padding: 14, gap: 12, ...CARD_SHADOW,
    },
    sectionLabel: {
        fontSize: 11, fontWeight: '700', color: '#94A3B8',
        letterSpacing: 0.8,
    },
    sectionHeaderRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    addMoreLink: { fontSize: 12, fontWeight: '700' },
    divider: { height: 1, backgroundColor: '#F1F5F9' },

    // Fields grid
    fieldsGrid: {
        flexDirection: 'row', flexWrap: 'wrap', gap: 0,
    },
    infoField: {
        width: '50%',
        paddingVertical: 8,
        paddingRight: 12,
        gap: 6,
    },
    infoFieldLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
    infoFieldValue: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    infoFieldIcon: {
        width: 22, height: 22, borderRadius: 6,
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    infoFieldText: { fontSize: 13, fontWeight: '600', color: '#1E293B', flex: 1 },

    // Linked docs
    noLinkedDocs: {
        alignItems: 'center', paddingVertical: 20, gap: 6,
    },
    noLinkedTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
    noLinkedSub: { fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 16 },
    linkedRow: {
        flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10,
    },
    linkedRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F8FAFF' },
    linkedThumb: {
        width: 52, height: 52, borderRadius: 10,
        backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, borderWidth: 1, borderColor: '#E2E8F0',
    },
    linkedMeta: { flex: 1, minWidth: 0, gap: 4 },
    primaryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 7, paddingVertical: 3,
        borderRadius: 6,
    },
    primaryBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.4 },
    linkedName: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
    linkedSub: { fontSize: 11, color: '#94A3B8' },
    linkedRight: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0 },
    unlinkBtn: { padding: 2 },

    // Timeline
    timeline: { gap: 0 },
    timelineRow: { flexDirection: 'row', gap: 12, minHeight: 44 },
    timelineLeft: { alignItems: 'center', width: 28 },
    timelineDot: {
        width: 28, height: 28, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, flexShrink: 0,
    },
    timelineLine: { flex: 1, width: 1.5, backgroundColor: '#F1F5F9', marginVertical: 3 },
    timelineContent: { flex: 1, paddingTop: 5, paddingBottom: 10 },
    timelineLabel: { fontSize: 12, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
    timelineDate: { fontSize: 11, color: '#94A3B8' },

    // Sticky footer
    stickyFooter: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1, borderTopColor: '#E8EDF5',
        padding: 16,
        ...Platform.select({
            ios: { shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 1, shadowRadius: 12 },
            android: { elevation: 8 },
        }),
    },
    ctaBtn: {
        height: 52, borderRadius: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    },
    ctaBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.2 },
    loadingWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '500',
    },
    errorTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center',
    },
    errorBack: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3B7BFF',
        marginTop: 4,
    },
});