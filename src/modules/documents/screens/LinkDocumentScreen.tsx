import { CaptureHeader } from '@/shared/components/CaptureHeader';
import { DocCategory, LINKABLE_DOCS, LinkableDoc, SOURCE_NAMES } from '@/modules/documents/mocks/documents';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Platform, ScrollView, StyleSheet,
    Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Category filter config ───────────────────────────────────────────────────
const FILTERS: { id: LinkableDoc['category'] | 'all'; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'warranty', label: 'Compras' },
    { id: 'invoice', label: 'Facturas' },
    { id: 'deposit', label: 'Depósitos' },
    { id: 'services', label: 'Servicios' },
    { id: 'contracts', label: 'Legal' },
];

const CATEGORY_BADGE: Record<Exclude<LinkableDoc['category'], 'all'>, {
    label: string; color: string; bg: string;
}> = {
    warranty: { label: 'GARANTÍA', color: '#3B7BFF', bg: '#EFF6FF' },
    invoice: { label: 'FACTURA', color: '#C2410C', bg: '#FFF7ED' },
    deposit: { label: 'DEPÓSITO', color: '#7C3AED', bg: '#FDF4FF' },
    services: { label: 'SERVICIO', color: '#0EA5E9', bg: '#F0F9FF' },
    contracts: { label: 'LEGAL', color: '#0D9488', bg: '#F0FDFA' },
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function LinkDocumentsScreen() {
    const { sourceId } = useLocalSearchParams<{ sourceId: string }>();
    const sourceName = SOURCE_NAMES[sourceId ?? ''] ?? 'Documento principal';

    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState<DocCategory>('all');
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const filtered = useMemo(() => {
        return LINKABLE_DOCS.filter(doc => {
            const matchCat = activeFilter === 'all' || doc.category === activeFilter;
            const matchSearch = !search.trim() ||
                doc.name.toLowerCase().includes(search.toLowerCase()) ||
                doc.provider.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [activeFilter, search]);

    const toggleSelect = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleLink = () => {
        if (selected.size === 0) return;
        const linked = LINKABLE_DOCS.filter(d => selected.has(d.id));
        console.log('Vincular →', linked.map(d => d.id));
        // TODO: llamar API y volver
        router.dismiss();
    };

    const hasSelection = selected.size > 0;

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

            {/* ── Header ─────────────────────────────────────────── */}
            <CaptureHeader onBack={() => router.dismiss()} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Intro ─────────────────────────────────────────── */}
                <View style={styles.introSection}>
                    <Text style={styles.headerTitle}>Añadir Vínculos</Text>
                    <Text style={styles.introText}>
                        Selecciona los documentos que deseas relacionar con:
                    </Text>
                    <View style={styles.sourcePill}>
                        <Ionicons name="document-attach-outline" size={14} color="#3B7BFF" />
                        <Text style={styles.sourcePillText}>{sourceName}</Text>
                    </View>
                </View>

                {/* ── Search ───────────────────────────────────────── */}
                <View style={styles.searchBox}>
                    <Ionicons name="search-outline" size={16} color="#94A3B8" />
                    <TextInput
                        style={styles.searchInput}
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Buscar documentos..."
                        placeholderTextColor="#94A3B8"
                        returnKeyType="search"
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Ionicons name="close-circle" size={16} color="#CBD5E1" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── Category filters ──────────────────────────────── */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                >
                    {FILTERS.map(f => {
                        const isActive = activeFilter === f.id;
                        return (
                            <TouchableOpacity
                                key={f.id}
                                onPress={() => setActiveFilter(f.id)}
                                style={[styles.filterChip, isActive && styles.filterChipActive]}
                                activeOpacity={0.75}
                            >
                                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                                    {f.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* ── Document list ─────────────────────────────────── */}
                {filtered.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={32} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>Sin resultados</Text>
                        <Text style={styles.emptySub}>
                            Intenta con otro término o cambia el filtro de categoría.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.docList}>
                        {filtered.map(doc => {
                            const isSelected = selected.has(doc.id);
                            const badge = CATEGORY_BADGE[doc.category];
                            return (
                                <TouchableOpacity
                                    key={doc.id}
                                    style={[
                                        styles.docRow,
                                        isSelected && styles.docRowSelected,
                                    ]}
                                    onPress={() => toggleSelect(doc.id)}
                                    activeOpacity={0.75}
                                >
                                    {/* Checkbox */}
                                    <View style={[
                                        styles.checkbox,
                                        isSelected && styles.checkboxActive,
                                    ]}>
                                        {isSelected && (
                                            <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                                        )}
                                    </View>

                                    {/* File icon */}
                                    <View style={[styles.docIcon, { backgroundColor: doc.iconBg }]}>
                                        <Text style={styles.docEmoji}>{doc.icon}</Text>
                                    </View>

                                    {/* Content */}
                                    <View style={styles.docContent}>
                                        <Text style={styles.docName} numberOfLines={1}>
                                            {doc.name}
                                        </Text>
                                        <Text style={styles.docMeta}>
                                            {doc.provider} · {doc.date}
                                        </Text>
                                        <View style={styles.docFooterRow}>
                                            <View style={[styles.catBadge, { backgroundColor: badge.bg }]}>
                                                <Text style={[styles.catBadgeText, { color: badge.color }]}>
                                                    {badge.label}
                                                </Text>
                                            </View>
                                            {doc.amount !== null && (
                                                <Text style={[styles.docAmount, { color: doc.iconColor }]}>
                                                    ${doc.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* Spacer para el footer */}
                <View style={{ height: 90 }} />
            </ScrollView>

            {/* ── Sticky footer ─────────────────────────────────── */}
            <View style={styles.footer}>
                <View style={styles.footerTop}>
                    <Text style={[styles.footerCount, hasSelection && styles.footerCountActive]}>
                        {selected.size} {selected.size === 1 ? 'seleccionado' : 'seleccionados'}
                    </Text>
                    <Text style={styles.footerHint}>
                        {hasSelection
                            ? `${selected.size} archivo${selected.size > 1 ? 's' : ''} listo${selected.size > 1 ? 's' : ''} para vincular`
                            : 'Toque los archivos para vincular'}
                    </Text>
                </View>

                <View style={styles.footerActions}>
                    <TouchableOpacity
                        style={[styles.linkBtn, !hasSelection && styles.linkBtnDisabled]}
                        onPress={handleLink}
                        disabled={!hasSelection}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="link-outline" size={15} color={hasSelection ? '#FFFFFF' : '#94A3B8'} />
                        <Text style={[styles.linkBtnText, !hasSelection && styles.linkBtnTextDisabled]}>
                            Vincular{'\n'}Seleccionados
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => router.dismiss()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close-outline" size={16} color="#DC2626" />
                        <Text style={styles.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F8FAFF' },
    scrollContent: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderBottomColor: '#E8EDF5',
        gap: 10,
    },
    hdrBack: {
        width: 34, height: 34, borderRadius: 10,
        backgroundColor: '#F8FAFF', borderWidth: 1, borderColor: '#E2E8F0',
        alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 17, fontWeight: '700', color: '#0F172A', letterSpacing: -0.3,
    },
    hdrIconBtn: {
        width: 34, height: 34, borderRadius: 10,
        backgroundColor: '#F8FAFF', borderWidth: 1, borderColor: '#E2E8F0',
        alignItems: 'center', justifyContent: 'center',
    },

    // Intro
    introSection: { gap: 10 },
    introText: { fontSize: 13, color: '#64748B', lineHeight: 18 },
    sourcePill: {
        flexDirection: 'row', alignItems: 'center', gap: 7,
        alignSelf: 'flex-start',
        backgroundColor: '#EFF6FF', borderWidth: 1.5, borderColor: '#BFDBFE',
        borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
    },
    sourcePillText: { fontSize: 13, fontWeight: '700', color: '#3B7BFF' },

    // Search
    searchBox: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E2E8F0',
        borderRadius: 12, paddingHorizontal: 12, height: 44,
        ...Platform.select({
            ios: { shadowColor: 'rgba(0,0,0,0.05)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6 },
            android: { elevation: 1 },
        }),
    },
    searchInput: { flex: 1, fontSize: 14, color: '#0F172A' },

    // Filters
    filterRow: { gap: 8, paddingVertical: 2 },
    filterChip: {
        paddingHorizontal: 14, paddingVertical: 8,
        borderRadius: 20, backgroundColor: '#F1F5F9',
        borderWidth: 1, borderColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: '#3B7BFF',
        borderColor: '#3B7BFF',
    },
    filterChipText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
    filterChipTextActive: { color: '#FFFFFF' },

    // Doc list
    docList: {
        backgroundColor: '#FFFFFF', borderRadius: 16,
        borderWidth: 1, borderColor: '#E8EDF5',
        overflow: 'hidden',
        ...Platform.select({
            ios: { shadowColor: 'rgba(59,123,255,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8 },
            android: { elevation: 2 },
        }),
    },
    docRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 14, paddingVertical: 14,
        gap: 12,
        borderBottomWidth: 1, borderBottomColor: '#F8FAFF',
    },
    docRowSelected: {
        backgroundColor: '#F0F9FF',
        borderBottomColor: '#E0F2FE',
    },

    // Checkbox
    checkbox: {
        width: 22, height: 22, borderRadius: 6,
        borderWidth: 2, borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    },
    checkboxActive: {
        backgroundColor: '#3B7BFF',
        borderColor: '#3B7BFF',
    },

    // Doc icon
    docIcon: {
        width: 42, height: 42, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    },
    docEmoji: { fontSize: 20 },

    // Doc content
    docContent: { flex: 1, minWidth: 0, gap: 3 },
    docName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
    docMeta: { fontSize: 11, color: '#94A3B8' },
    docFooterRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
    catBadge: {
        paddingHorizontal: 7, paddingVertical: 3,
        borderRadius: 6,
    },
    catBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
    docAmount: { fontSize: 13, fontWeight: '700' },

    // Empty
    emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
    emptyTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
    emptySub: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 18 },

    // Footer
    footer: {
        marginHorizontal: 4, marginBottom: 4,
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        gap: 10,
        ...Platform.select({
            ios: { shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 1, shadowRadius: 12 },
            android: { elevation: 8 },
        }),
    },
    footerTop: { gap: 2, marginBottom: 4 },
    footerCount: { fontSize: 12, fontWeight: '700', color: '#CBD5E1' },
    footerCountActive: { color: '#0F172A' },
    footerHint: { fontSize: 10, color: '#94A3B8', lineHeight: 14 },
    footerActions: {
        flexDirection: 'column', gap: 8,
    },
    cancelBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
        paddingVertical: 12,
        borderRadius: 14, borderWidth: 1.5, borderColor: '#FECACA',
        backgroundColor: '#FEF2F2',
    },
    cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#DC2626' },
    linkBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
        backgroundColor: '#3B7BFF', borderRadius: 14,
        paddingVertical: 13,
        ...Platform.select({
            ios: { shadowColor: 'rgba(59,123,255,0.35)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 10 },
            android: { elevation: 4 },
        }),
    },
    linkBtnDisabled: {
        backgroundColor: '#F1F5F9',
        shadowColor: 'transparent',
        elevation: 0,
    },
    linkBtnText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF', lineHeight: 17, textAlign: 'center' },
    linkBtnTextDisabled: { color: '#94A3B8' },
});