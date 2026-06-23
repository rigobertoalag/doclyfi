import { MOCK_OCR_CONTRACT } from '@/mocks/ocr';
import { UPCOMING_CONTRACTS, HISTORY_CONTRACTS, ContractStatus, ContractItem, HistoryItem } from '@/mocks/contracts';
import { CaptureFooter } from '@/components/capture/CaptureFooter';
import { CaptureHeader } from '@/components/capture/CaptureHeader';
import { CaptureInfoStrip } from '@/components/capture/CaptureInfoStrip';
import { CaptureSourceCard } from '@/components/capture/CaptureSourceCard';
import { CaptureTitleSection } from '@/components/capture/CaptureTitleSection';
import { OcrInfoCard } from '@/components/capture/OcrInfoCard';
import { LinkDocument, LinkedDocument } from '@/components/ui/capture/LinkDocument';
import { OcrField } from '@/constants/config';
import { useDocumentCapture } from '@/hooks/useDocumentCapture';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Platform, ScrollView, StyleSheet,
    Text,
    TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Config ───────────────────────────────────────────────────────────────────
const ACCENT = '#0D9488';
const ACCENT_BG = '#F0FDFA';
const ACCENT_BORDER = '#99F6E4';
const ACCENT_LIGHT = '#0F766E';

const CONTRACTS_CONFIG = {
    pill: '📋  Contratos',
    subtitle: 'Organiza, controla y da seguimiento a todos tus contratos.',
    captureTitle: 'Agregar contrato',
    captureSub: 'Escanea o sube tu contrato.',
    infoIcon: 'document-text-outline' as const,
    infoText: 'El OCR extraerá las partes, vigencia, montos y cláusulas principales del contrato.',
    accent: ACCENT,
    accentBg: ACCENT_BG,
    accentBorder: ACCENT_BORDER,
    accentLight: ACCENT_LIGHT,
    ctaIcon: 'document-lock-outline' as const,
    ctaLabel: 'Guardar contrato',
    ctaSub: 'Se registrará con vigencia y alertas de vencimiento',
} as const;

const STATUS_CONFIG: Record<ContractStatus, { label: string; color: string; bg: string; border: string }> = {
    active: { label: 'Activo', color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4' },
    expiring: { label: 'Por vencer', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    expired: { label: 'Vencido', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
    pending: { label: 'Pendiente', color: '#64748B', bg: '#F8FAFF', border: '#E2E8F0' },
};

type OcrReviewBannerProps = {
    accentColor: string;
    accentBg: string;
    accentBorder: string;
    fileName?: string;
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ContractsScreen() {
    const [search, setSearch] = useState('');
    const [linkedDoc, setLinkedDoc] = useState<LinkedDocument | null>(null);
    const [ocrFields, setOcrFields] = useState<OcrField[]>([]);
    const [showDetected, setShowDetected] = useState(true);
    // Ref al ScrollView y al nodo del banner OCR
    const scrollRef = useRef<ScrollView>(null);
    const ocrBannerY = useRef<number>(0);

    const { step, handleSource } = useDocumentCapture({
        runOcr: async (_uri) => {
            await delay(2500);
            setOcrFields(MOCK_OCR_CONTRACT);

            // ✅ Espera al siguiente frame para que el layout esté listo
            setTimeout(() => {
                scrollRef.current?.scrollTo({ y: ocrBannerY.current - 16, animated: true });
            }, 100);
        },
    });

    const handleFieldEdit = (id: string, value: string) =>
        setOcrFields(prev => prev.map(f => f.id === id ? { ...f, value } : f));

    const handleSave = () => {
        console.log('Contrato guardado →', ocrFields);
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

            {/* ── Header ─────────────────────────────────────────── */}
            <CaptureHeader onBack={() => router.dismiss()} />

            {/* ── Scroll ─────────────────────────────────────────── */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Title */}
                <CaptureTitleSection
                    pill={CONTRACTS_CONFIG.pill}
                    subtitle={CONTRACTS_CONFIG.subtitle}
                    accentColor={CONTRACTS_CONFIG.accent}
                    accentBg={CONTRACTS_CONFIG.accentBg}
                    accentBorder={CONTRACTS_CONFIG.accentBorder}
                />

                {/* Capture card */}
                <CaptureSourceCard
                    title={CONTRACTS_CONFIG.captureTitle}
                    subtitle={CONTRACTS_CONFIG.captureSub}
                    onSource={handleSource}
                    illustration={<ContractIllustration />}
                />

                <CaptureInfoStrip
                    icon={CONTRACTS_CONFIG.infoIcon}
                    text={CONTRACTS_CONFIG.infoText}
                    color={CONTRACTS_CONFIG.accent}
                    bg={CONTRACTS_CONFIG.accentBg}
                    border={CONTRACTS_CONFIG.accentBorder}
                />

                {/* OCR review */}
                {step === 'review' && (
                    <View
                        onLayout={(e) => {
                            // ✅ Guarda la posición Y del banner para el scroll
                            ocrBannerY.current = e.nativeEvent.layout.y;
                        }}
                    >
                        <OcrInfoCard fields={ocrFields} onEdit={handleFieldEdit} />
                        <LinkDocument
                            linked={linkedDoc}
                            accentColor={ACCENT}
                            onLink={() => setLinkedDoc({
                                id: 'doc_inv_01', name: 'Factura de servicios 2024.pdf',
                                type: 'invoice', typeLabel: '📄 Factura',
                            })}
                            onUnlink={() => setLinkedDoc(null)}
                        />

                        <OcrReviewBanner
                            accentColor={CONTRACTS_CONFIG.accent}
                            accentBg={CONTRACTS_CONFIG.accentBg}
                            accentBorder={CONTRACTS_CONFIG.accentBorder}
                        />

                        {/* Separador de cierre — marca el fin de la revisión */}
                        <View style={styles.reviewFooterNote}>
                            <Ionicons name="arrow-down-outline" size={13} color="#CBD5E1" />
                            <Text style={styles.reviewFooterNoteText}>
                                Tu historial y datos anteriores se muestran a continuación
                            </Text>
                            <Ionicons name="arrow-down-outline" size={13} color="#CBD5E1" />
                        </View>
                    </View>
                    // <>
                    //     <OcrInfoCard fields={ocrFields} onEdit={handleFieldEdit} />
                    //     <LinkDocument
                    //         linked={linkedDoc}
                    //         accentColor={ACCENT}
                    //         onLink={() => setLinkedDoc({
                    //             id: 'doc_inv_01', name: 'Factura de servicios 2024.pdf',
                    //             type: 'invoice', typeLabel: '📄 Factura',
                    //         })}
                    //         onUnlink={() => setLinkedDoc(null)}
                    //     />
                    // </>
                )}

                <View>
                    {/* Pagos del contrato */}
                    <ContractPaymentsCard />

                    {/* Resumen stats */}
                    <ContractStatsCard />

                    {/* Próximos por vencer */}
                    <View style={styles.card}>
                        <View style={styles.cardHeaderRow}>
                            <Text style={styles.cardTitle}>Próximos por vencer</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllLink}>Ver todos</Text>
                            </TouchableOpacity>
                        </View>
                        {UPCOMING_CONTRACTS.map((c, idx) => (
                            <UpcomingContractRow
                                key={c.id}
                                contract={c}
                                isLast={idx === UPCOMING_CONTRACTS.length - 1}
                            />
                        ))}
                    </View>
                    {/* Historial */}
                    <View style={styles.card}>
                        <View style={styles.cardHeaderRow}>
                            <Text style={styles.cardTitle}>Historial de contratos firmados</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllLink}>Ver todo</Text>
                            </TouchableOpacity>
                        </View>
                        {HISTORY_CONTRACTS.map((c, idx) => (
                            <HistoryContractRow
                                key={c.id}
                                contract={c}
                                isLast={idx === HISTORY_CONTRACTS.length - 1}
                            />
                        ))}
                    </View>
                </View>
                {/* Spacer dinámico */}
                <View style={{ height: step === 'review' ? 180 : 100 }} />
            </ScrollView>

            {/* ── Footer OCR — sobre todo el contenido ─────────── */}
            {step === 'review' && (
                <CaptureFooter
                    ctaLabel={CONTRACTS_CONFIG.ctaLabel}
                    ctaSubLabel={CONTRACTS_CONFIG.ctaSub}
                    ctaIcon={CONTRACTS_CONFIG.ctaIcon}
                    ctaColor={CONTRACTS_CONFIG.accent}
                    onCtaPress={handleSave}
                    secondaryActions={[
                        { label: 'Firmar digitalmente', icon: 'pencil-outline', color: ACCENT, onPress: () => { } },
                        { label: 'Compartir', icon: 'share-outline', onPress: () => { } },
                    ]}
                    onDiscard={() => router.dismiss()}
                    discardLabel="Descartar contrato"
                />
            )}
        </SafeAreaView>
    );
}

// ─── Contract payments card ───────────────────────────────────────────────────
function ContractPaymentsCard() {
    return (
        <View style={payStyles.card}>
            <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>Pagos del contrato</Text>
            </View>
            <Text style={payStyles.sub}>Seguimiento de depósitos recibidos y compromisos</Text>

            {/* Main amounts */}
            <View style={payStyles.mainRow}>
                <View style={payStyles.mainCol}>
                    <Text style={payStyles.mainLabel}>Recibidos</Text>
                    <Text style={[payStyles.mainAmount, { color: ACCENT }]}>$15,000.00</Text>
                    <Text style={payStyles.mainCount}>3 contratos</Text>
                </View>
                <View style={payStyles.divider} />
                <View style={payStyles.mainCol}>
                    <Text style={payStyles.mainLabel}>Comprometido</Text>
                    <Text style={[payStyles.mainAmount, { color: '#64748B' }]}>$8,000.00</Text>
                    <Text style={payStyles.mainCount}>Total 19</Text>
                </View>
            </View>

            {/* Progress bar */}
            <View style={payStyles.progressWrap}>
                <View style={payStyles.progressBg}>
                    <View style={[payStyles.progressFill, { width: '55.5%', backgroundColor: ACCENT }]} />
                </View>
            </View>

            {/* Detail row */}
            <View style={payStyles.detailRow}>
                {[
                    { label: 'Recibido', amount: '$9,000.00', color: ACCENT },
                    { label: 'Saldo', amount: '$4,300.00', color: '#F59E0B' },
                    { label: 'Próximo', amount: '$3,500.00', color: '#3B7BFF' },
                    { label: 'Pendiente', amount: '$3,500.00', color: '#EF4444' },
                ].map((item) => (
                    <View key={item.label} style={payStyles.detailCol}>
                        <Text style={payStyles.detailLabel}>{item.label}</Text>
                        <Text style={[payStyles.detailAmount, { color: item.color }]}>{item.amount}</Text>
                    </View>
                ))}
            </View>

            <View style={payStyles.noteRow}>
                <Ionicons name="information-circle-outline" size={13} color="#94A3B8" />
                <Text style={payStyles.noteText}>
                    Al agregar contratos automáticamente se crearán los depósitos y compromisos relacionados.
                </Text>
            </View>
        </View>
    );
}

// ─── Stats card ───────────────────────────────────────────────────────────────
function ContractStatsCard() {
    const stats = [
        { label: 'Contratos', value: '12', color: '#0F172A', bg: '#F8FAFF', border: '#E2E8F0' },
        { label: 'Por vencer', value: '4', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
        { label: 'Vencidos', value: '2', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
        { label: 'Total meses', value: '19', color: ACCENT, bg: ACCENT_BG, border: ACCENT_BORDER },
    ];

    return (
        <View style={statStyles.card}>
            <Text style={styles.cardTitle}>Resumen de contratos</Text>
            <View style={statStyles.grid}>
                {stats.map((s) => (
                    <View
                        key={s.label}
                        style={[statStyles.statBox, { backgroundColor: s.bg, borderColor: s.border }]}
                    >
                        <Text style={[statStyles.statValue, { color: s.color }]}>{s.value}</Text>
                        <Text style={statStyles.statLabel}>{s.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

// ─── Upcoming contract row ────────────────────────────────────────────────────
function UpcomingContractRow({ contract: c, isLast }: { contract: ContractItem; isLast: boolean }) {
    const dueColor = c.daysLeft <= 15 ? '#DC2626' : c.daysLeft <= 45 ? '#F59E0B' : '#64748B';
    return (
        <View style={[rowStyles.row, !isLast && rowStyles.rowBorder]}>
            <View style={[rowStyles.iconWrap, { backgroundColor: c.bg }]}>
                <Text style={rowStyles.iconEmoji}>{c.icon}</Text>
            </View>
            <View style={rowStyles.meta}>
                <Text style={rowStyles.title} numberOfLines={1}>{c.title}</Text>
                <Text style={rowStyles.company}>{c.company}</Text>
            </View>
            <View style={rowStyles.right}>
                <Text style={[rowStyles.daysLeft, { color: dueColor }]}>
                    En {c.daysLeft} días      {/* ✅ daysLeft */}
                </Text>
                <Text style={rowStyles.amount}>${c.amount.toLocaleString('es-MX')}</Text>
            </View>
            <TouchableOpacity style={rowStyles.menuBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="ellipsis-vertical" size={15} color="#CBD5E1" />
            </TouchableOpacity>
        </View>
    );
}

// ─── History contract row ─────────────────────────────────────────────────────
function HistoryContractRow({ contract: c, isLast }: { contract: HistoryItem; isLast: boolean }) {
    const isSigned = c.status === 'signed';
    return (
        <View style={[rowStyles.row, !isLast && rowStyles.rowBorder]}>
            <View style={[rowStyles.iconWrap, { backgroundColor: c.bg }]}>
                <Ionicons name="document-text-outline" size={17} color={c.color} />
            </View>
            <View style={rowStyles.meta}>
                <Text style={rowStyles.title} numberOfLines={1}>{c.title}</Text>
                <Text style={rowStyles.company}>{c.company}</Text>
            </View>
            <Text style={rowStyles.date}>{c.signedDate}</Text>
            <View style={[
                rowStyles.statusBadge,
                {
                    backgroundColor: isSigned ? ACCENT_BG : '#FEF2F2',
                    borderColor: isSigned ? ACCENT_BORDER : '#FECACA',
                },
            ]}>
                <Text style={[rowStyles.statusText, { color: isSigned ? ACCENT : '#DC2626' }]}>
                    {isSigned ? 'Firmado' : 'Expirado'}
                </Text>
            </View>
            <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="ellipsis-vertical" size={14} color="#CBD5E1" />
            </TouchableOpacity>
        </View>
    );
}

// ─── Contract illustration ────────────────────────────────────────────────────
function ContractIllustration() {
    return (
        <View style={illStyles.wrap}>
            <View style={illStyles.card}>
                <View style={illStyles.cornerTL} />
                <View style={illStyles.cornerBR} />

                {/* Header */}
                <View style={illStyles.headerStrip}>
                    <Ionicons name="document-text-outline" size={10} color={ACCENT} />
                    <Text style={illStyles.headerText}>CONTRATO</Text>
                </View>

                <Text style={illStyles.contractTitle}>Prestación{'\n'}de Servicios</Text>
                <View style={illStyles.divider} />

                {[
                    ['Empresa', 'ABC S.A.'],
                    ['Inicio', '10 may 24'],
                    ['Vence', '10 may 26'],
                ].map(([k, v]) => (
                    <View key={k} style={illStyles.row}>
                        <Text style={illStyles.rowKey}>{k}</Text>
                        <Text style={illStyles.rowVal}>{v}</Text>
                    </View>
                ))}

                <View style={illStyles.amountRow}>
                    <Text style={illStyles.amountLabel}>Valor</Text>
                    <Text style={illStyles.amountVal}>$27,000</Text>
                </View>

                {/* Signed badge */}
                <View style={illStyles.badge}>
                    <Ionicons name="shield-checkmark-outline" size={9} color={ACCENT} />
                    <Text style={illStyles.badgeText}>OCR completado</Text>
                </View>

                {/* Signature lines */}
                <View style={illStyles.signatures}>
                    <View style={illStyles.sigLine} />
                    <View style={illStyles.sigLine} />
                </View>
            </View>
        </View>
    );
}

export function OcrReviewBanner({
    accentColor, accentBg, accentBorder, fileName,
}: OcrReviewBannerProps) {
    return (
        <View style={styles.wrap}>
            {/* Banner principal */}
            <View style={[styles.banner, { backgroundColor: accentBg, borderColor: accentBorder }]}>
                <View style={[styles.iconWrap, { backgroundColor: accentColor }]}>
                    <Ionicons name="scan-outline" size={18} color="#FFFFFF" />
                </View>

                <View style={styles.textBlock}>
                    <View style={styles.titleRow}>
                        <Text style={[styles.title, { color: accentColor }]}>
                            Revisión del documento
                        </Text>
                        <View style={[styles.badge, { backgroundColor: accentColor }]}>
                            <Ionicons name="checkmark" size={9} color="#FFF" />
                            <Text style={styles.badgeText}>OCR completado</Text>
                        </View>
                    </View>
                    <Text style={styles.sub}>
                        {fileName
                            ? `Verifica los datos extraídos de "${fileName}" antes de guardar.`
                            : 'Verifica y edita los datos extraídos antes de guardar.'}
                    </Text>
                </View>
            </View>

            {/* Línea decorativa superior */}
            <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <View style={[styles.dividerDot, { backgroundColor: accentColor }]} />
                <View style={styles.dividerLine} />
            </View>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_SHADOW = Platform.select({
    ios: { shadowColor: 'rgba(13,148,136,0.07)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10 },
    android: { elevation: 2 },
});

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F8FAFF' },
    scrollContent: { padding: 16, gap: 12 },

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
        borderWidth: Platform.OS === 'ios' ? 0 : 1, borderColor: '#E2E8F0',
    },
    hdrBackLabel: { fontSize: 16, color: '#475569', fontWeight: '400' },
    logoAbsolute: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
    logoImg: { height: 45, width: 110 },
    hdrRight: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    hdrIconBtn: {
        width: 34, height: 34, borderRadius: 10, backgroundColor: '#FFFFFF',
        borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', position: 'relative',
    },
    notifDot: {
        position: 'absolute', top: 6, right: 7, width: 7, height: 7,
        borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#F8FAFF',
    },
    searchRow: { flexDirection: 'row', gap: 8 },
    searchBox: {
        flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E2E8F0',
        borderRadius: 12, paddingHorizontal: 12, height: 42, ...CARD_SHADOW,
    },
    searchInput: { flex: 1, fontSize: 13, color: '#0F172A' },
    filterBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: ACCENT_BORDER,
        borderRadius: 12, paddingHorizontal: 12, height: 42, ...CARD_SHADOW,
    },
    filterBtnText: { fontSize: 13, fontWeight: '600' },
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1,
        borderColor: '#E8EDF5', padding: 14, gap: 10, marginVertical: 10, ...CARD_SHADOW,
    },
    cardTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', letterSpacing: -0.1 },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    seeAllLink: { fontSize: 12, fontWeight: '600', color: ACCENT },
    fab: {
        position: 'absolute', bottom: 20, left: 20, right: 20,
        height: 52, backgroundColor: ACCENT,
        borderRadius: 16, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center', gap: 8,
        ...Platform.select({
            ios: { shadowColor: `${ACCENT}50`, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 14 },
            android: { elevation: 8 },
        }),
    },
    fabText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.2 },

    wrap: { gap: 12 },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E8EDF5',
    },
    dividerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: 14,
        borderWidth: 1.5,
        padding: 14,
        marginVertical: 10,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0,0.06)',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 1,
                shadowRadius: 8,
            },
            android: { elevation: 2 },
        }),
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    textBlock: { flex: 1, gap: 4 },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    title: {
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: -0.2,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.2,
    },
    sub: {
        fontSize: 11,
        color: '#64748B',
        lineHeight: 15,
        fontWeight: '400',
    },

    dimmed: {
        opacity: 0.35,          // ✅ atenúa el historial durante la revisión
        pointerEvents: 'none',  // desactiva interacción mientras se revisa
    },
    reviewFooterNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
    },
    reviewFooterNoteText: {
        fontSize: 11,
        color: '#CBD5E1',
        fontWeight: '500',
    },
});

// Detected card
const detStyles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E8EDF5',
        padding: 14, gap: 12, ...CARD_SHADOW,
    },
    header: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    iaBadge: { width: 24, height: 24, borderRadius: 8, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center' },
    iaBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
    title: { flex: 1, fontSize: 13, fontWeight: '700', color: '#0F172A' },
    mainInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    docIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: ACCENT_BG, alignItems: 'center', justifyContent: 'center' },
    mainText: { flex: 1 },
    contractTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
    contractCompany: { fontSize: 11, color: '#64748B' },
    fieldsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    field: { flex: 1, gap: 4 },
    fieldLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '500' },
    fieldVal: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
    statusPill: { backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
    statusPillText: { fontSize: 11, fontWeight: '700', color: '#D97706' },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    btnPrimary: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: ACCENT, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
    btnPrimaryText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
    btnSecondary: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F8FAFF', borderWidth: 1, borderColor: '#E2E8F0' },
    btnSecText: { fontSize: 11, fontWeight: '600', color: '#64748B' },
});

// Payments card
const payStyles = StyleSheet.create({
    card: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E8EDF5', padding: 14, gap: 10, marginVertical: 10, ...CARD_SHADOW },
    sub: { fontSize: 11, color: '#94A3B8', marginTop: -4 },
    mainRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    mainCol: { flex: 1, gap: 3 },
    mainLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
    mainAmount: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
    mainCount: { fontSize: 10, color: '#64748B' },
    divider: { width: 1, height: 48, backgroundColor: '#F1F5F9' },
    progressWrap: { gap: 4 },
    progressBg: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
    detailCol: { alignItems: 'center', gap: 3 },
    detailLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '500' },
    detailAmount: { fontSize: 11, fontWeight: '700' },
    noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: '#F8FAFF', borderRadius: 10, padding: 10 },
    noteText: { flex: 1, fontSize: 10, color: '#94A3B8', lineHeight: 14 },
});

// Stats
const statStyles = StyleSheet.create({
    card: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E8EDF5', padding: 14, gap: 12, marginVertical: 10, ...CARD_SHADOW },
    grid: { flexDirection: 'row', gap: 8 },
    statBox: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: 'center', gap: 4 },
    statValue: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
    statLabel: { fontSize: 10, color: '#64748B', fontWeight: '500', textAlign: 'center' },
});

// Row
const rowStyles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F8FAFF' },
    iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    iconEmoji: { fontSize: 18 },
    meta: { flex: 1, minWidth: 0, gap: 2 },
    title: { fontSize: 12, fontWeight: '700', color: '#1E293B' },
    company: { fontSize: 10, color: '#94A3B8' },
    right: { alignItems: 'flex-end', gap: 2, flexShrink: 0 },
    daysLeft: { fontSize: 10, fontWeight: '700' },
    amount: { fontSize: 11, fontWeight: '600', color: '#64748B' },
    menuBtn: { padding: 2 },
    date: { fontSize: 10, color: '#94A3B8', flexShrink: 0 },
    statusBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20, borderWidth: 1, flexShrink: 0 },
    statusText: { fontSize: 10, fontWeight: '700' },
});

// Illustration
const illStyles = StyleSheet.create({
    wrap: { width: 96, flexShrink: 0 },
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: ACCENT_BORDER,
        padding: 7, position: 'relative', gap: 2,
        ...Platform.select({
            ios: { shadowColor: `${ACCENT}25`, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 10 },
            android: { elevation: 4 },
        }),
    },
    cornerTL: { position: 'absolute', top: 4, left: 4, width: 10, height: 10, borderTopWidth: 2, borderLeftWidth: 2, borderColor: ACCENT, borderRadius: 2 },
    cornerBR: { position: 'absolute', bottom: 4, right: 4, width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: ACCENT, borderRadius: 2 },
    headerStrip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
    headerText: { fontSize: 9, fontWeight: '800', color: ACCENT, letterSpacing: 0.5 },
    contractTitle: { fontSize: 7, fontWeight: '700', color: '#0F172A', textAlign: 'center', lineHeight: 10 },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 2 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    rowKey: { fontSize: 6, color: '#94A3B8' },
    rowVal: { fontSize: 6, fontWeight: '600', color: '#1E293B' },
    amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3, paddingTop: 3, borderTopWidth: 1, borderTopColor: ACCENT_BORDER, borderStyle: 'dashed' },
    amountLabel: { fontSize: 7, fontWeight: '700', color: '#0F172A' },
    amountVal: { fontSize: 8, fontWeight: '800', color: ACCENT },
    badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, backgroundColor: ACCENT_BG, borderRadius: 6, paddingVertical: 3, borderWidth: 1, borderColor: ACCENT_BORDER },
    badgeText: { fontSize: 7, fontWeight: '700', color: ACCENT },
    signatures: { flexDirection: 'row', gap: 6, marginTop: 2 },
    sigLine: { flex: 1, height: 1.5, backgroundColor: '#E2E8F0', borderRadius: 1, marginTop: 4 },
});

function delay(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}