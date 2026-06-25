import { CaptureFooter } from '@/modules/capture/components/CaptureFooter';
import { CaptureHeader } from '@/shared/components/CaptureHeader';
import { CaptureInfoStrip } from '@/modules/capture/components/CaptureInfoStrip';
import { CaptureSourceCard } from '@/modules/capture/components/CaptureSourceCard';
import { CaptureTitleSection } from '@/modules/capture/components/CaptureTitleSection';
import { OcrInfoCard } from '@/modules/capture/components/OcrInfoCard';
import { LinkDocument, LinkedDocument } from '@/modules/capture/components/LinkDocument';
import { MOCK_OCR_SERVICES } from '@/modules/capture/mocks/ocr';
import { FilterTab, Month, MONTHS, PAYMENT_HISTORY, SERVICE_CATEGORIES, ServiceItem, SERVICES_BY_MONTH } from '@/modules/capture/mocks/services';
import { OcrField, SERVICES_CONFIG } from '@/modules/capture/constants/config';
import { useDocumentCapture } from '@/modules/capture/hooks/useDocumentCapture';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform, ScrollView, StyleSheet,
    Text,
    TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ServicesScreen() {
    const [search, setSearch] = useState('');
    const [activeMonth, setActiveMonth] = useState<Month>('Marzo 2026');
    const [filterTab, setFilterTab] = useState<FilterTab>('all');
    const [sendToAccountant, setSendToAccountant] = useState(false);
    const [linkedDoc, setLinkedDoc] = useState<LinkedDocument | null>(null);
    const [showDetected, setShowDetected] = useState(true);
    const [ocrFields, setOcrFields] = useState<OcrField[]>([]);

    const services = SERVICES_BY_MONTH[activeMonth] ?? [];
    const filtered = services.filter(s => {
        const matchSearch = !search.trim() ||
            s.provider.toLowerCase().includes(search.toLowerCase()) ||
            s.category.toLowerCase().includes(search.toLowerCase());
        const matchFilter =
            filterTab === 'all' ||
            (filterTab === 'pending' && s.status === 'pending') ||
            (filterTab === 'paid' && s.status === 'paid');
        return matchSearch && matchFilter;
    });
    const { step, handleSource } = useDocumentCapture({
        runOcr: async (_uri) => {
            await delay(2500);
            setOcrFields(MOCK_OCR_SERVICES);
        },
    });
    const handleFieldEdit = (id: string, value: string) => {
        setOcrFields(prev => prev.map(f => f.id === id ? { ...f, value } : f));
    };
    const handleSave = () => {
        // if (!depositType) return;
        // const payload = {
        //     fields: ocrFields,
        //     depositType,
        //     linkedDocumentId: linkedDoc?.id ?? null,
        //     savedAt: new Date().toISOString(),
        // };
        console.log('Depósito guardado →');
        // TODO: documentsApi.upload(payload)
    };

    const paidTotal = services.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.amount, 0);
    const pendingTotal = services.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0);
    const total = paidTotal + pendingTotal;

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

            {/* ── Header ─────────────────────────────────────────── */}
            {/* <View style={styles.header}>
                <TouchableOpacity
                    style={styles.hdrBtn}
                    onPress={() => router.dismiss()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
                        size={Platform.OS === 'ios' ? 20 : 22}
                        color="#475569"
                    />
                    {Platform.OS === 'ios' && <Text style={styles.hdrBackLabel}>Volver</Text>}
                </TouchableOpacity>

                <View style={styles.logoAbsolute} pointerEvents="none">
                    <Image
                        source={require('@/assets/doclyfi_images/logo_no_background.png')}
                        style={styles.logoImg}
                        contentFit="contain"
                    />
                </View>
            </View> */}
            <CaptureHeader onBack={() => router.dismiss()} />

            {/* ── Scroll — NO contiene el footer ─────────────────── */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <CaptureTitleSection
                    pill={SERVICES_CONFIG.pill}
                    subtitle={SERVICES_CONFIG.subtitle}
                    accentColor={SERVICES_CONFIG.accent}
                    accentBg={SERVICES_CONFIG.accentBg}
                    accentBorder={SERVICES_CONFIG.accentBorder}
                />

                <CaptureSourceCard
                    title={SERVICES_CONFIG.captureTitle}
                    subtitle={SERVICES_CONFIG.captureSub}
                    onSource={handleSource}
                    illustration={<ServiceIllustration />}
                />

                <CaptureInfoStrip
                    icon={SERVICES_CONFIG.infoIcon}
                    text={SERVICES_CONFIG.infoText}
                    color={SERVICES_CONFIG.accent}
                    bg={SERVICES_CONFIG.accentBg}
                    border={SERVICES_CONFIG.accentBorder}
                />

                {step === 'review' && (
                    <>

                        <OcrInfoCard
                            fields={ocrFields}
                            onEdit={handleFieldEdit}
                        />

                        <LinkDocument
                            linked={linkedDoc}
                            accentColor={SERVICES_CONFIG.accent}
                            onLink={() => setLinkedDoc({
                                id: 'doc_xyz789',
                                name: 'Contrato de servicios Mayo 2024.pdf',
                                type: 'contract',
                                typeLabel: '📋 Contrato',
                            })}
                            onUnlink={() => setLinkedDoc(null)}
                        />
                    </>
                )}

                {/* ── Resumen mensual ─────────────────────────────── */}
                <View style={styles.summaryRow}>
                    <View style={[styles.card, { flex: 1.4 }]}>
                        <Text style={styles.cardTitle}>Resumen de este mes</Text>
                        <View style={styles.summaryContent}>
                            <View style={styles.summaryStats}>
                                <Text style={styles.statLabel}>Pagados</Text>
                                <Text style={[styles.statAmount, { color: '#16A34A' }]}>
                                    ${paidTotal.toLocaleString('es-MX')}.00
                                </Text>
                                <Text style={styles.statCount}>
                                    {services.filter(s => s.status === 'paid').length} servicios
                                </Text>
                            </View>
                            <DonutChart paid={paidTotal} pending={pendingTotal} total={total} />
                            <View style={[styles.summaryStats, { alignItems: 'flex-end' }]}>
                                <Text style={styles.statLabel}>Pendientes</Text>
                                <Text style={[styles.statAmount, { color: '#EF4444' }]}>
                                    ${pendingTotal.toLocaleString('es-MX')}.00
                                </Text>
                                <Text style={styles.statCount}>
                                    {services.filter(s => s.status === 'pending').length} servicios
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.card, { flex: 1, gap: 8 }]}>
                        <View style={styles.nextDueHeader}>
                            <Text style={styles.cardTitle}>Próximo vencimiento</Text>
                            <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
                        </View>
                        <Text style={styles.nextDueName}>CFE - Luz</Text>
                        <Text style={styles.nextDueSub}>Vence en</Text>
                        <Text style={styles.nextDueDays}>5 días</Text>
                        <TouchableOpacity style={styles.nextDueLink}>
                            <Text style={styles.nextDueLinkText}>Ver pendientes</Text>
                            <Ionicons name="chevron-forward" size={11} color="#3B7BFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Categorías ──────────────────────────────────── */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Categorías de servicios</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.catsRow}
                    >
                        {SERVICE_CATEGORIES.map(cat => (
                            <TouchableOpacity key={cat.id} style={styles.catItem} activeOpacity={0.75}>
                                <View style={[styles.catIconWrap, { backgroundColor: cat.bg }]}>
                                    <Ionicons name={cat.icon as any} size={20} color={cat.color} />
                                </View>
                                <Text style={styles.catLabel}>{cat.label}</Text>
                                {cat.pending > 0 && (
                                    <Text style={[styles.catStat, { color: '#EF4444' }]}>
                                        {cat.pending} pendiente{cat.pending > 1 ? 's' : ''}
                                    </Text>
                                )}
                                <Text style={styles.catStatPaid}>
                                    {cat.paid} pagado{cat.paid > 1 ? 's' : ''}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* ── Tabs + lista ─────────────────────────────────── */}
                <View style={styles.card}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.monthTabs}
                    >
                        {MONTHS.map(month => (
                            <TouchableOpacity
                                key={month}
                                onPress={() => setActiveMonth(month)}
                                style={[styles.monthTab, activeMonth === month && styles.monthTabActive]}
                            >
                                <Text style={[styles.monthTabText, activeMonth === month && styles.monthTabTextActive]}>
                                    {month}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.filterPills}>
                        {([
                            { id: 'all', label: 'Todos' },
                            { id: 'pending', label: `Pendientes (${services.filter(s => s.status === 'pending').length})` },
                            { id: 'paid', label: `Pagados (${services.filter(s => s.status === 'paid').length})` },
                        ] as { id: FilterTab; label: string }[]).map(f => (
                            <TouchableOpacity
                                key={f.id}
                                onPress={() => setFilterTab(f.id)}
                                style={[
                                    styles.filterPill,
                                    filterTab === f.id && {
                                        backgroundColor: f.id === 'pending' ? '#FEF2F2' : f.id === 'paid' ? '#F0FDF4' : '#EFF6FF',
                                        borderColor: f.id === 'pending' ? '#FECACA' : f.id === 'paid' ? '#BBF7D0' : '#BFDBFE',
                                    },
                                ]}
                            >
                                <Text style={[
                                    styles.filterPillText,
                                    filterTab === f.id && {
                                        color: f.id === 'pending' ? '#DC2626' : f.id === 'paid' ? '#16A34A' : '#3B7BFF',
                                    },
                                ]}>
                                    {f.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {filtered.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>📭</Text>
                            <Text style={styles.emptyText}>Sin servicios para este filtro</Text>
                        </View>
                    ) : (
                        filtered.map((svc, idx) => (
                            <ServiceRow
                                key={svc.id}
                                service={svc}
                                isLast={idx === filtered.length - 1}
                            />
                        ))
                    )}
                </View>

                {/* ── PRO ─────────────────────────────────────────── */}
                <View style={styles.proCard}>
                    <View style={styles.proLeft}>
                        <View style={styles.proHeader}>
                            <Ionicons name="sparkles" size={14} color="#3B7BFF" />
                            <Text style={styles.proTitle}>Predicción inteligente</Text>
                            <View style={styles.proBadge}>
                                <Text style={styles.proBadgeText}>PRO</Text>
                            </View>
                        </View>
                        <Text style={styles.proDesc}>
                            Detectamos que pagas Netflix cada mes.{'\n'}
                            Hemos creado el próximo pago como pendiente.
                        </Text>
                    </View>
                    <View style={styles.proRight}>
                        <View style={[styles.proServiceIcon, { backgroundColor: '#FEF2F2' }]}>
                            <Text style={{ fontSize: 18 }}>N</Text>
                        </View>
                        <View style={styles.proDetails}>
                            <View>
                                <Text style={styles.proDetailLabel}>Próximo pago</Text>
                                <Text style={styles.proDetailVal}>20 ABR 2026</Text>
                            </View>
                            <View>
                                <Text style={styles.proDetailLabel}>Monto estimado</Text>
                                <Text style={styles.proDetailVal}>$219.00</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.proLink}>Ver detalle</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: step === 'review' ? 180 : 24 }} />
            </ScrollView>

            {/* ✅ CaptureFooter FUERA del ScrollView — flota sobre todo el contenido */}
            {step === 'review' && (
                <CaptureFooter
                    ctaLabel={SERVICES_CONFIG.ctaLabel}
                    ctaSubLabel={SERVICES_CONFIG.ctaSub}
                    ctaIcon={SERVICES_CONFIG.ctaIcon}
                    ctaColor={SERVICES_CONFIG.accent}
                    onCtaPress={handleSave}
                    secondaryActions={[
                        {
                            label: 'Enviar recibo',
                            icon: 'send-outline',
                            color: SERVICES_CONFIG.accent,
                            onPress: () => console.log('Enviar recibo'),
                        },
                        {
                            label: 'Compartir',
                            icon: 'share-outline',
                            onPress: () => console.log('Compartir'),
                        },
                    ]}
                    onDiscard={() => router.dismiss()}
                    discardLabel="Descartar comprobante"
                />
            )}

        </SafeAreaView>
    );
}

// ─── Service illustration ─────────────────────────────────────────────────────
function ServiceIllustration() {
    return (
        <View style={illStyles.wrap}>
            <View style={illStyles.card}>
                <View style={illStyles.cornerTL} />
                <View style={illStyles.cornerBR} />
                <Text style={illStyles.brand}>CFE</Text>
                <Text style={illStyles.brandSub}>Comisión Federal{'\n'}de Electricidad</Text>
                <View style={illStyles.divider} />
                <Text style={illStyles.amountLabel}>Total a pagar</Text>
                <Text style={illStyles.amount}>$1,250.00</Text>
                <View style={illStyles.divider} />
                <View style={illStyles.row}><Text style={illStyles.key}>Periodo:</Text><Text style={illStyles.val}>MAR 2026</Text></View>
                <View style={illStyles.row}><Text style={illStyles.key}>Vence:</Text><Text style={illStyles.val}>05 ABR 2026</Text></View>
                <View style={illStyles.barcode}>
                    {[14, 10, 14, 9, 12, 14, 9, 14, 10, 12, 14, 9, 12, 14, 10, 14].map((h, i) => (
                        <View key={i} style={[illStyles.bar, { height: h }]} />
                    ))}
                </View>
            </View>
        </View>
    );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ paid, pending, total }: { paid: number; pending: number; total: number }) {
    const SIZE = 64;
    const STROKE = 8;
    const R = (SIZE - STROKE) / 2;
    const CIRC = 2 * Math.PI * R;
    const paidPct = total > 0 ? paid / total : 0;
    const pendingPct = total > 0 ? pending / total : 0;

    return (
        <View style={donutStyles.wrap}>
            <Svg width={SIZE} height={SIZE}>
                {/* Background track */}
                <Circle cx={SIZE / 2} cy={SIZE / 2} r={R}
                    stroke="#F1F5F9" strokeWidth={STROKE} fill="none" />
                {/* Paid arc */}
                <Circle cx={SIZE / 2} cy={SIZE / 2} r={R}
                    stroke="#16A34A" strokeWidth={STROKE} fill="none"
                    strokeDasharray={`${CIRC * paidPct} ${CIRC * (1 - paidPct)}`}
                    strokeDashoffset={CIRC / 4}
                    strokeLinecap="round"
                />
                {/* Pending arc */}
                <Circle cx={SIZE / 2} cy={SIZE / 2} r={R}
                    stroke="#EF4444" strokeWidth={STROKE} fill="none"
                    strokeDasharray={`${CIRC * pendingPct} ${CIRC * (1 - pendingPct)}`}
                    strokeDashoffset={CIRC / 4 - CIRC * paidPct}
                    strokeLinecap="round"
                />
            </Svg>
            <View style={donutStyles.center}>
                <Text style={donutStyles.label}>Total</Text>
                <Text style={donutStyles.value}>${(total / 1000).toFixed(1)}k</Text>
            </View>
        </View>
    );
}

// ─── Service row ──────────────────────────────────────────────────────────────
function ServiceRow({ service: s, isLast }: { service: ServiceItem; isLast: boolean }) {
    const dueColor = s.dueInDays <= 5 ? '#DC2626' : s.dueInDays <= 12 ? '#F59E0B' : '#64748B';
    return (
        <View style={[rowStyles.row, !isLast && rowStyles.rowBorder]}>
            <View style={[rowStyles.iconWrap, { backgroundColor: s.bg }]}>
                <Ionicons name={s.icon as any} size={18} color={s.color} />
            </View>
            <View style={rowStyles.meta}>
                <Text style={rowStyles.provider}>{s.provider}</Text>
                <Text style={rowStyles.category}>{s.category}</Text>
                {s.status === 'pending' && (
                    <Text style={[rowStyles.due, { color: dueColor }]}>
                        Vence en {s.dueInDays} días
                    </Text>
                )}
                <Text style={rowStyles.amount}>${s.amount.toLocaleString('es-MX')}.00</Text>
            </View>
            {s.status === 'pending' ? (
                <>
                    <TouchableOpacity style={rowStyles.payBtn}>
                        <Text style={rowStyles.payBtnText}>Pagar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={rowStyles.viewBtn}>
                        <Text style={rowStyles.viewBtnText}>Ver</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <View style={rowStyles.paidBadge}>
                    <Text style={rowStyles.paidBadgeText}>Pagado</Text>
                </View>
            )}
            <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="ellipsis-vertical" size={15} color="#CBD5E1" />
            </TouchableOpacity>
        </View>
    );
}

// ─── History row ──────────────────────────────────────────────────────────────
function HistoryRow({ item: h, isLast }: { item: typeof PAYMENT_HISTORY[0]; isLast: boolean }) {
    const isPaid = h.status === 'paid';
    return (
        <View style={[rowStyles.row, !isLast && rowStyles.rowBorder]}>
            <View style={[rowStyles.iconWrap, { backgroundColor: h.bg }]}>
                <Ionicons name={h.icon as any} size={16} color={h.color} />
            </View>
            <View style={rowStyles.meta}>
                <Text style={rowStyles.provider}>{h.provider}</Text>
                <Text style={rowStyles.category}>{h.category}</Text>
            </View>
            <Text style={rowStyles.histDate}>{h.date}</Text>
            <Text style={rowStyles.histAmount}>${h.amount.toLocaleString('es-MX')}.00</Text>
            <View style={[
                rowStyles.statusBadge,
                { backgroundColor: isPaid ? '#F0FDF4' : '#FFFBEB', borderColor: isPaid ? '#BBF7D0' : '#FDE68A' },
            ]}>
                <Text style={[rowStyles.statusBadgeText, { color: isPaid ? '#16A34A' : '#B45309' }]}>
                    {isPaid ? 'Pagado' : 'Pendiente'}
                </Text>
            </View>
            <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="ellipsis-vertical" size={14} color="#CBD5E1" />
            </TouchableOpacity>
        </View>
    );
}

// ─── Helper sub-component ─────────────────────────────────────────────────────
function DetectedFieldCol({
    label, value, valueColor, valueBg, valueBorder, isPill,
}: {
    label: string; value: string;
    valueColor?: string; valueBg?: string; valueBorder?: string; isPill?: boolean;
}) {
    return (
        <View style={{ gap: 2 }}>
            <Text style={styles.detectedFieldLabel}>{label}</Text>
            {isPill ? (
                <View style={[styles.detectedPill, { backgroundColor: valueBg, borderColor: valueBorder }]}>
                    <Text style={[styles.detectedPillText, { color: valueColor }]}>{value}</Text>
                </View>
            ) : (
                <Text style={[styles.detectedFieldVal, valueColor ? { color: valueColor } : null]}>{value}</Text>
            )}
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
    scrollContent: { padding: 16, gap: 12 },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 10,
        backgroundColor: '#F8FAFF', borderBottomWidth: 1, borderBottomColor: '#E0E2E4',
        position: 'relative',
    },
    hdrBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 2, minWidth: 70,
        paddingVertical: 4, paddingHorizontal: Platform.OS === 'ios' ? 0 : 6,
        borderRadius: Platform.OS === 'ios' ? 0 : 8,
        backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#F8FAFF',
        borderWidth: Platform.OS === 'ios' ? 0 : 1, borderColor: '#F8FAFF',
    },
    hdrBackLabel: { fontSize: 16, color: '#475569', fontWeight: '400' },
    logoAbsolute: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
    logoImg: { height: 45, width: 110 },
    hdrRight: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    hdrIconBtn: {
        width: 34, height: 34, borderRadius: 10,
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
        alignItems: 'center', justifyContent: 'center', position: 'relative',
    },
    notifDot: {
        position: 'absolute', top: 6, right: 7,
        width: 7, height: 7, borderRadius: 4,
        backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#F8FAFF',
    },

    // Title
    titleSection: { gap: 3 },
    screenTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
    screenSubtitle: { fontSize: 12, color: '#64748B', lineHeight: 17 },

    // Search
    searchRow: { flexDirection: 'row', gap: 8 },
    searchBox: {
        flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E2E8F0',
        borderRadius: 12, paddingHorizontal: 12, height: 42,
        ...CARD_SHADOW,
    },
    searchInput: { flex: 1, fontSize: 13, color: '#0F172A' },
    filterBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#BFDBFE',
        borderRadius: 12, paddingHorizontal: 12, height: 42,
        ...CARD_SHADOW,
    },
    filterBtnText: { fontSize: 13, fontWeight: '600', color: '#3B7BFF' },

    // Capture card
    captureCard: {
        backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E8EDF5',
        padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12,
        ...CARD_SHADOW,
    },
    captureLeft: { flex: 1 },
    captureTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 3 },
    captureSub: { fontSize: 11, color: '#94A3B8', marginBottom: 14 },
    sourceRow: { flexDirection: 'row', gap: 10 },
    srcBtn: { alignItems: 'center', gap: 5 },
    srcIcon: {
        width: 44, height: 44, borderRadius: 13, borderWidth: 1,
        alignItems: 'center', justifyContent: 'center',
    },
    srcLabel: { fontSize: 10, fontWeight: '600', color: '#64748B' },

    // Detected card
    detectedCard: {
        backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E8EDF5',
        padding: 14, gap: 12, ...CARD_SHADOW,
    },
    detectedHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    detectedBadge: {
        width: 24, height: 24, borderRadius: 8,
        backgroundColor: '#3B7BFF', alignItems: 'center', justifyContent: 'center',
    },
    detectedBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
    detectedTitle: { flex: 1, fontSize: 13, fontWeight: '700', color: '#0F172A' },
    detectedClose: { padding: 2 },
    detectedFields: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    detectedField: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    serviceIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    detectedFieldLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '500', marginBottom: 2 },
    detectedFieldVal: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
    detectedFieldSub: { fontSize: 11, color: '#64748B' },
    detectedPill: {
        paddingHorizontal: 8, paddingVertical: 3,
        borderRadius: 20, borderWidth: 1,
    },
    detectedPillText: { fontSize: 11, fontWeight: '700' },
    detectedActions: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
    detectedActPrimary: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: '#3B7BFF', borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 8,
    },
    detectedActPrimaryText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
    detectedActSecondary: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 10, paddingVertical: 8,
        borderRadius: 10, backgroundColor: '#F8FAFF',
        borderWidth: 1, borderColor: '#E2E8F0',
    },
    detectedActSecText: { fontSize: 11, fontWeight: '600', color: '#64748B' },

    // Summary
    summaryRow: { flexDirection: 'row', gap: 10 },
    summaryContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
    summaryStats: { gap: 3, flex: 1 },
    statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '500' },
    statAmount: { fontSize: 13, fontWeight: '800', letterSpacing: -0.3 },
    statCount: { fontSize: 10, color: '#64748B' },
    nextDueHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    nextDueName: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
    nextDueSub: { fontSize: 10, color: '#94A3B8' },
    nextDueDays: { fontSize: 20, fontWeight: '800', color: '#EF4444', letterSpacing: -0.5 },
    nextDueLink: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
    nextDueLinkText: { fontSize: 11, fontWeight: '600', color: '#3B7BFF' },

    // Categories
    catsRow: { gap: 6, paddingVertical: 4 },
    catItem: { alignItems: 'center', gap: 4, minWidth: 58 },
    catIconWrap: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
    catLabel: { fontSize: 11, fontWeight: '600', color: '#0F172A' },
    catStat: { fontSize: 9, fontWeight: '600' },
    catStatPaid: { fontSize: 9, color: '#94A3B8' },

    // Month tabs
    monthTabs: { gap: 4, paddingBottom: 10 },
    monthTab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: 'transparent' },
    monthTabActive: { borderColor: '#3B7BFF' },
    monthTabText: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },
    monthTabTextActive: { color: '#3B7BFF' },
    filterPills: { flexDirection: 'row', gap: 6, marginBottom: 10 },
    filterPill: {
        paddingHorizontal: 10, paddingVertical: 5,
        borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F8FAFF',
    },
    filterPillText: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },

    // Empty
    emptyState: { alignItems: 'center', paddingVertical: 24, gap: 6 },
    emptyIcon: { fontSize: 28 },
    emptyText: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },

    // PRO card
    proCard: {
        backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1.5, borderColor: '#BFDBFE',
        padding: 14, gap: 10, ...CARD_SHADOW,
    },
    proLeft: { gap: 4 },
    proHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    proTitle: { fontSize: 13, fontWeight: '700', color: '#3B7BFF', flex: 1 },
    proBadge: {
        backgroundColor: '#F59E0B', borderRadius: 6,
        paddingHorizontal: 6, paddingVertical: 2,
    },
    proBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
    proDesc: { fontSize: 11, color: '#64748B', lineHeight: 16 },
    proRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    proServiceIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    proServiceName: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
    proServiceCat: { fontSize: 10, color: '#94A3B8' },
    proDetails: { flex: 1, gap: 4 },
    proDetailLabel: { fontSize: 9, color: '#94A3B8' },
    proDetailVal: { fontSize: 11, fontWeight: '700', color: '#0F172A' },
    proLink: { fontSize: 11, fontWeight: '700', color: '#3B7BFF' },

    // Accountant
    accountantRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    accountantLeft: { flex: 1, gap: 10 },
    accountantActions: { flexDirection: 'row', gap: 8 },
    accountantBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    accountantBtnText: { fontSize: 12, fontWeight: '600', color: '#3B7BFF' },

    // Shared card
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1,
        borderColor: '#E8EDF5', padding: 14, gap: 10, ...CARD_SHADOW,
    },
    cardTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', letterSpacing: -0.1 },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    seeAllLink: { fontSize: 12, fontWeight: '600', color: '#3B7BFF' },
});

const rowStyles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F8FAFF' },
    iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    meta: { flex: 1, minWidth: 0, gap: 1 },
    provider: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
    category: { fontSize: 10, color: '#94A3B8' },
    due: { fontSize: 10, fontWeight: '600' },
    amount: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginTop: 2 },
    payBtn: {
        backgroundColor: '#3B7BFF', borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 6,
    },
    payBtnText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
    viewBtn: {
        borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6,
        borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F8FAFF',
    },
    viewBtnText: { fontSize: 11, fontWeight: '600', color: '#475569' },
    paidBadge: {
        backgroundColor: '#F0FDF4', borderRadius: 8,
        paddingHorizontal: 8, paddingVertical: 5,
        borderWidth: 1, borderColor: '#BBF7D0',
    },
    paidBadgeText: { fontSize: 11, fontWeight: '700', color: '#16A34A' },
    histDate: { fontSize: 10, color: '#94A3B8', flexShrink: 0 },
    histAmount: { fontSize: 12, fontWeight: '700', color: '#0F172A', flexShrink: 0 },
    statusBadge: {
        paddingHorizontal: 7, paddingVertical: 3,
        borderRadius: 20, borderWidth: 1, flexShrink: 0,
    },
    statusBadgeText: { fontSize: 10, fontWeight: '700' },
});

const illStyles = StyleSheet.create({
    wrap: { width: 100, flexShrink: 0 },
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#BFDBFE',
        padding: 8, position: 'relative', gap: 3,
        ...Platform.select({
            ios: { shadowColor: 'rgba(0,0,0,0.12)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 10 },
            android: { elevation: 4 },
        }),
    },
    cornerTL: { position: 'absolute', top: 4, left: 4, width: 10, height: 10, borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#3B7BFF', borderRadius: 2 },
    cornerBR: { position: 'absolute', bottom: 4, right: 4, width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#3B7BFF', borderRadius: 2 },
    brand: { fontSize: 12, fontWeight: '800', color: '#16A34A', textAlign: 'center', letterSpacing: 0.5 },
    brandSub: { fontSize: 7, color: '#64748B', textAlign: 'center', lineHeight: 10 },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 2 },
    amountLabel: { fontSize: 7, color: '#94A3B8', textAlign: 'center' },
    amount: { fontSize: 12, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    key: { fontSize: 6, color: '#94A3B8' },
    val: { fontSize: 6, fontWeight: '600', color: '#0F172A' },
    barcode: { flexDirection: 'row', justifyContent: 'center', gap: 1.5, marginTop: 4, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    bar: { width: 1.5, backgroundColor: '#1E293B', borderRadius: 1 },
});

const donutStyles = StyleSheet.create({
    wrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
    center: { position: 'absolute', alignItems: 'center' },
    label: { fontSize: 7, color: '#94A3B8', fontWeight: '500' },
    value: { fontSize: 10, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
});

function delay(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}