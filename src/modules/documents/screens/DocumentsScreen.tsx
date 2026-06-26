import { AISearchBar } from '@/components/search/AISearchBar';
import { AISearchResults } from '@/components/search/AISearchResults';
import { DocumentRow } from '@/modules/documents/components/DocumentRow';
import { useAISearch } from '@/hooks/useAISearch';
import { useDocuments } from '@/modules/documents/hooks/useDocuments';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Platform, ScrollView, StyleSheet,
    Text, TouchableOpacity, View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Categories config ────────────────────────────────────────────────────────
const CATEGORIES = [
    { id: 'all', label: 'Todos', icon: 'apps-outline', color: '#0F172A', accent: '#3B7BFF', bg: '#EFF6FF', border: '#BFDBFE' },
    { id: 'warranty', label: 'Compras c/Garantía', icon: 'shield-checkmark-outline', color: '#3B7BFF', accent: '#3B7BFF', bg: '#EFF6FF', border: '#BFDBFE' },
    { id: 'invoice', label: 'Archivado', icon: 'documents-outline', color: '#C2410C', accent: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
    { id: 'deposit', label: 'Depósitos', icon: 'arrow-down-circle-outline', color: '#7C3AED', accent: '#7C3AED', bg: '#FDF4FF', border: '#E9D5FF' },
    { id: 'services', label: 'Servicios', icon: 'flash-outline', color: '#0EA5E9', accent: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD' },
    { id: 'contracts', label: 'Contratos', icon: 'document-text-outline', color: '#0D9488', accent: '#0D9488', bg: '#F0FDFA', border: '#99F6E4' },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = ['Más recientes', 'Más antiguos', 'Mayor monto', 'Menor monto', 'A–Z'] as const;
type SortOption = typeof SORT_OPTIONS[number];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function DocumentsScreen() {
    const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
    const [sortBy, setSortBy] = useState<SortOption>('Más recientes');
    const [showSort, setShowSort] = useState(false);
    const aiSearch = useAISearch();

    const activeCat = CATEGORIES.find(c => c.id === activeCategory)!;

    const { data, loading, reload } = useDocuments(activeCategory, sortBy, '');

    const docs = data?.docs ?? [];
    const totals = data?.totals ?? {};
    const filtered = docs;

    const grouped = CATEGORIES.filter(c => c.id !== 'all').map(cat => ({
        category: cat,
        docs: filtered.filter(d => d.categoryId === cat.id),
    })).filter(g => g.docs.length > 0);

    const isSearching = aiSearch.query.length >= 3;

    return (
        <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Title ────────────────────────────────────────── */}
                    <View style={styles.titleRow}>
                        <View style={styles.titleLeft}>
                            <Text style={styles.screenTitle}>Documentos</Text>
                            <Text style={styles.screenSubtitle}>
                                Visualiza y gestiona todos tus documentos
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.helpBtn}>
                            <Ionicons name="help-circle-outline" size={16} color="#3B7BFF" />
                            <Text style={styles.helpBtnText}>¿Cómo funciona?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── Upload CTA banner ─────────────────────────────── */}
                    <TouchableOpacity style={styles.ctaBanner} activeOpacity={0.85}>
                        <View style={styles.ctaIconWrap}>
                            <Ionicons name="cloud-upload-outline" size={22} color="#FFFFFF" />
                        </View>
                        <View style={styles.ctaText}>
                            <Text style={styles.ctaTitle}>Subir nuevo documento</Text>
                            <Text style={styles.ctaSub}>Escanea o sube un documento y clasifícalo</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>

                    {/* ── Search ──────────────────────────────────────────── */}
                    <AISearchBar
                        query={aiSearch.query}
                        setQuery={aiSearch.setQuery}
                        status={aiSearch.status}
                    />

                    {/* ── Category filter chips ─────────────────────────── */}
                    {!isSearching && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.catChips}
                    >
                        {CATEGORIES.map(cat => {
                            const isActive = activeCategory === cat.id;
                            const count = cat.id === 'all'
                                ? (data?.total ?? 0)
                                : (totals[cat.id] ?? 0);
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    onPress={() => setActiveCategory(cat.id)}
                                    style={[
                                        styles.catChip,
                                        isActive && { backgroundColor: cat.bg, borderColor: cat.border },
                                    ]}
                                    activeOpacity={0.75}
                                >
                                    <Ionicons
                                        name={cat.icon as any}
                                        size={13}
                                        color={isActive ? cat.color : '#94A3B8'}
                                    />
                                    <Text style={[
                                        styles.catChipText,
                                        isActive && { color: cat.color },
                                    ]}>
                                        {cat.label}
                                    </Text>
                                    {count > 0 && (
                                        <View style={[
                                            styles.catChipCount,
                                            { backgroundColor: isActive ? cat.accent : '#E2E8F0' },
                                        ]}>
                                            <Text style={[
                                                styles.catChipCountText,
                                                { color: isActive ? '#FFF' : '#64748B' },
                                            ]}>
                                                {count}
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    )}

                    {/* ── AI Results / Sort + docs ──────────────────────── */}
                    {isSearching ? (
                        <AISearchResults
                            interpretation={aiSearch.interpretation}
                            results={aiSearch.results}
                            status={aiSearch.status}
                            error={aiSearch.error}
                            query={aiSearch.query}
                            setQuery={aiSearch.setQuery}
                        />
                    ) : (
                    <>
                    <View style={styles.sortRow}>
                        <Text style={styles.sortCount}>
                            {activeCategory === 'all'
                                ? `Documentos principales y sus vinculados (${filtered.length})`
                                : `${activeCat.label} (${filtered.length})`
                            }
                        </Text>
                        <TouchableOpacity
                            style={styles.sortBtn}
                            onPress={() => setShowSort(v => !v)}
                        >
                            <Text style={styles.sortLabel}>Ordenar por:</Text>
                            <Text style={styles.sortValue}>{sortBy}</Text>
                            <Ionicons name="chevron-down" size={13} color="#3B7BFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Sort dropdown */}
                    {showSort && (
                        <View style={styles.sortDropdown}>
                            {SORT_OPTIONS.map(opt => (
                                <TouchableOpacity
                                    key={opt}
                                    style={[styles.sortOpt, sortBy === opt && styles.sortOptActive]}
                                    onPress={() => { setSortBy(opt); setShowSort(false); }}
                                >
                                    <Text style={[styles.sortOptText, sortBy === opt && styles.sortOptTextActive]}>
                                        {opt}
                                    </Text>
                                    {sortBy === opt && (
                                        <Ionicons name="checkmark" size={14} color="#3B7BFF" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* ── Document sections ─────────────────────────────── */}
                    {activeCategory === 'all' ? (
                        // Grouped by category
                        grouped.map(({ category: cat, docs }) => (
                            <View key={cat.id} style={styles.section}>
                                {/* Section header */}
                                <View style={styles.sectionHeader}>
                                    <View style={[styles.sectionIconWrap, { backgroundColor: cat.bg }]}>
                                        <Ionicons name={cat.icon as any} size={15} color={cat.color} />
                                    </View>
                                    <Text style={styles.sectionTitle}>{cat.label}</Text>
                                    <View style={[styles.sectionCount, { backgroundColor: cat.bg, borderColor: cat.border }]}>
                                        <Text style={[styles.sectionCountText, { color: cat.color }]}>
                                            {docs.length}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.sectionSeeAll}
                                        onPress={() => setActiveCategory(cat.id)}
                                    >
                                        <Text style={[styles.seeAllText, { color: cat.color }]}>Ver todos</Text>
                                        <Ionicons name="chevron-forward" size={12} color={cat.color} />
                                    </TouchableOpacity>
                                </View>

                                {/* Document cards — show max 3 */}
                                {docs.slice(0, 3).map((doc, idx) => (
                                    <DocumentRow
                                        key={doc.id}
                                        doc={doc}
                                        isLast={idx === Math.min(docs.length, 3) - 1}
                                        accentColor={cat.color}
                                    />
                                ))}

                                {docs.length > 3 && (
                                    <TouchableOpacity
                                        style={[styles.showMoreBtn, { borderColor: cat.border }]}
                                        onPress={() => setActiveCategory(cat.id)}
                                    >
                                        <Text style={[styles.showMoreText, { color: cat.color }]}>
                                            Ver {docs.length - 3} documentos más
                                        </Text>
                                        <Ionicons name="chevron-down" size={13} color={cat.color} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))
                    ) : (
                        // Single category list
                        <View style={styles.section}>
                            {filtered.length === 0 ? (
                                <EmptyState category={activeCat} />
                            ) : (
                                filtered.map((doc, idx) => (
                                    <DocumentRow
                                        key={doc.id}
                                        doc={doc}
                                        isLast={idx === filtered.length - 1}
                                        accentColor={activeCat.color}
                                    />
                                ))
                            )}
                        </View>
                    )}
                    </>
                    )}

                    {/* ── How it works footer ───────────────────────────── */}
                    {!isSearching && (
                    <View style={styles.footerCards}>
                        <View style={styles.footerCard}>
                            <View style={styles.footerCardIcon}>
                                <Ionicons name="link-outline" size={18} color="#3B7BFF" />
                            </View>
                            <Text style={styles.footerCardTitle}>¿Cómo vincular documentos?</Text>
                            <Text style={styles.footerCardSub}>
                                Selecciona un documento principal y después busca o elige el que deseas vincular.
                            </Text>
                            <TouchableOpacity>
                                <Text style={styles.footerCardLink}>Ver guía rápida →</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerCard}>
                            <View style={[styles.footerCardIcon, { backgroundColor: '#F0FDF4' }]}>
                                <Ionicons name="shield-checkmark-outline" size={18} color="#16A34A" />
                            </View>
                            <Text style={styles.footerCardTitle}>Tus datos siempre seguros</Text>
                            <Text style={styles.footerCardSub}>
                                Toda la información está cifrada y protegida bajo los más altos estándares de seguridad.
                            </Text>
                            <TouchableOpacity>
                                <Text style={[styles.footerCardLink, { color: '#16A34A' }]}>
                                    Más información →
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    )}
                    <View style={{ height: 24 }} />
                </ScrollView>
            </SafeAreaView>
        </Animated.View>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ category: cat }: { category: typeof CATEGORIES[number] }) {
    return (
        <View style={styles.emptyState}>
            <View style={[styles.emptyIconWrap, { backgroundColor: cat.bg }]}>
                <Ionicons name={cat.icon as any} size={28} color={cat.color} />
            </View>
            <Text style={styles.emptyTitle}>Sin documentos en {cat.label}</Text>
            <Text style={styles.emptySub}>
                Aún no has subido documentos en esta categoría. Puedes agregar uno desde el botón de escaneo.
            </Text>
            <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: cat.bg, borderColor: cat.border }]}>
                <Ionicons name="add" size={15} color={cat.color} />
                <Text style={[styles.emptyBtnText, { color: cat.color }]}>
                    Agregar en {cat.label}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_SHADOW = Platform.select({
    ios: { shadowColor: 'rgba(59,123,255,0.07)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10 },
    android: { elevation: 2 },
});

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F8FAFF' },
    scrollContent: { padding: 16, gap: 14 },

    // Title
    titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
    titleLeft: { flex: 1 },
    screenTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 3 },
    screenSubtitle: { fontSize: 12, color: '#64748B', lineHeight: 17 },
    helpBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#EFF6FF', borderRadius: 20, borderWidth: 1, borderColor: '#BFDBFE',
        paddingHorizontal: 10, paddingVertical: 6, flexShrink: 0,
    },
    helpBtnText: { fontSize: 11, fontWeight: '600', color: '#3B7BFF' },

    // CTA Banner
    ctaBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: '#3B7BFF', borderRadius: 16, padding: 16,
        ...Platform.select({
            ios: { shadowColor: 'rgba(59,123,255,0.35)', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 14 },
            android: { elevation: 6 },
        }),
    },
    ctaIconWrap: {
        width: 42, height: 42, borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    ctaText: { flex: 1 },
    ctaTitle: { fontSize: 15, fontWeight: '800', color: '#FFFFFF', marginBottom: 2, letterSpacing: -0.2 },
    ctaSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)', lineHeight: 15 },

    // Search
    aiBar: { marginBottom: 0 },

    // Category chips
    catChips: { gap: 7, paddingVertical: 2 },
    catChip: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        paddingHorizontal: 12, paddingVertical: 8,
        borderRadius: 20, borderWidth: 1.5, borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    catChipText: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },
    catChipCount: {
        minWidth: 18, height: 18, borderRadius: 9,
        alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
    },
    catChipCountText: { fontSize: 10, fontWeight: '700' },

    // Sort
    sortRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sortCount: { fontSize: 12, fontWeight: '600', color: '#64748B', flex: 1 },
    sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    sortLabel: { fontSize: 12, color: '#94A3B8' },
    sortValue: { fontSize: 12, fontWeight: '600', color: '#3B7BFF' },
    sortDropdown: {
        backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E8EDF5',
        overflow: 'hidden', marginTop: -8, ...CARD_SHADOW,
    },
    sortOpt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: '#F8FAFF' },
    sortOptActive: { backgroundColor: '#EFF6FF' },
    sortOptText: { fontSize: 13, color: '#475569', fontWeight: '500' },
    sortOptTextActive: { color: '#3B7BFF', fontWeight: '700' },

    // Section
    section: {
        backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1,
        borderColor: '#E8EDF5', overflow: 'hidden', ...CARD_SHADOW,
    },
    sectionHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 14, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: '#F8FAFF',
    },
    sectionIconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    sectionTitle: { flex: 1, fontSize: 13, fontWeight: '700', color: '#0F172A', letterSpacing: -0.1 },
    sectionCount: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
    sectionCountText: { fontSize: 11, fontWeight: '700' },
    sectionSeeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    seeAllText: { fontSize: 12, fontWeight: '600' },
    showMoreBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
        paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F8FAFF',
        borderStyle: 'dashed',
    },
    showMoreText: { fontSize: 12, fontWeight: '600' },

    // Empty state
    emptyState: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 24, gap: 10 },
    emptyIconWrap: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
    emptySub: { fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 17 },
    emptyBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5,
        marginTop: 4,
    },
    emptyBtnText: { fontSize: 13, fontWeight: '600' },

    // Footer cards
    footerCards: { flexDirection: 'row', gap: 10 },
    footerCard: {
        flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1,
        borderColor: '#E8EDF5', padding: 14, gap: 6, ...CARD_SHADOW,
    },
    footerCardIcon: {
        width: 34, height: 34, borderRadius: 10, backgroundColor: '#EFF6FF',
        alignItems: 'center', justifyContent: 'center', marginBottom: 2,
    },
    footerCardTitle: { fontSize: 12, fontWeight: '700', color: '#0F172A', lineHeight: 16 },
    footerCardSub: { fontSize: 11, color: '#64748B', lineHeight: 15 },
    footerCardLink: { fontSize: 11, fontWeight: '700', color: '#3B7BFF', marginTop: 2 },
});