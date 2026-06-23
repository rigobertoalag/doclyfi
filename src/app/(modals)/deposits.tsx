import { CaptureFooter } from '@/components/capture/CaptureFooter';
import { CaptureHeader } from '@/components/capture/CaptureHeader';
import { CaptureInfoStrip } from '@/components/capture/CaptureInfoStrip';
import { CaptureSourceCard } from '@/components/capture/CaptureSourceCard';
import { CaptureTitleSection } from '@/components/capture/CaptureTitleSection';
import { DepositIllustration } from '@/components/capture/DepositIllustration';
import { DepositType, DepositTypeSelector } from '@/components/capture/DepositTypeSelector';
import { OcrInfoCard } from '@/components/capture/OcrInfoCard';
import { LinkDocument, LinkedDocument } from '@/components/ui/capture/LinkDocument';
import { MOCK_OCR_DEPOSIT } from '@/mocks/ocr';
import { DEPOSIT_CONFIG, OcrField } from '@/constants/config';
import { useDocumentCapture } from '@/hooks/useDocumentCapture';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DepositsScreen() {
    const [ocrFields, setOcrFields] = useState<OcrField[]>([]);
    const [depositType, setDepositType] = useState<DepositType | null>(null);
    const [linkedDoc, setLinkedDoc] = useState<LinkedDocument | null>(null);

    const { step, handleSource } = useDocumentCapture({
        runOcr: async (_uri) => {
            await delay(2500);
            setOcrFields(MOCK_OCR_DEPOSIT);
        },
    });

    const handleFieldEdit = (id: string, value: string) => {
        setOcrFields(prev => prev.map(f => f.id === id ? { ...f, value } : f));
    };

    const handleSave = () => {
        if (!depositType) return;
        const payload = {
            fields: ocrFields,
            depositType,
            linkedDocumentId: linkedDoc?.id ?? null,
            savedAt: new Date().toISOString(),
        };
        console.log('Depósito guardado →', payload);
        // TODO: documentsApi.upload(payload)
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

            <CaptureHeader onBack={() => router.dismiss()} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <CaptureTitleSection
                    pill={DEPOSIT_CONFIG.pill}
                    subtitle={DEPOSIT_CONFIG.subtitle}
                    accentColor={DEPOSIT_CONFIG.accent}
                    accentBg={DEPOSIT_CONFIG.accentBg}
                    accentBorder={DEPOSIT_CONFIG.accentBorder}
                />

                <CaptureSourceCard
                    title={DEPOSIT_CONFIG.captureTitle}
                    subtitle={DEPOSIT_CONFIG.captureSub}
                    onSource={handleSource}
                    illustration={<DepositIllustration />}
                />

                <CaptureInfoStrip
                    icon={DEPOSIT_CONFIG.infoIcon}
                    text={DEPOSIT_CONFIG.infoText}
                    color={DEPOSIT_CONFIG.accent}
                    bg={DEPOSIT_CONFIG.accentBg}
                    border={DEPOSIT_CONFIG.accentBorder}
                />

                {step === 'review' && (
                    <>

                        <OcrInfoCard
                            fields={ocrFields}
                            onEdit={handleFieldEdit}
                        />
                        {/* Tipo de depósito — selección requerida antes de guardar */}
                        <DepositTypeSelector
                            value={depositType}
                            onChange={setDepositType}
                        />

                        <LinkDocument
                            linked={linkedDoc}
                            accentColor={DEPOSIT_CONFIG.accent}
                            onLink={() => setLinkedDoc({
                                id: 'doc_xyz789',
                                name: 'Contrato de servicios Mayo 2024.pdf',
                                type: 'contract',
                                typeLabel: '📋 Contrato',
                            })}
                            onUnlink={() => setLinkedDoc(null)}
                        />

                        <View style={styles.ocrNote}>
                            <Text style={styles.ocrNoteIcon}>✨</Text>
                            <Text style={styles.ocrNoteText}>
                                <Text style={styles.ocrNoteStrong}>Datos extraídos con OCR. </Text>
                                Revisa y edita antes de guardar.
                            </Text>
                        </View>

                        <View style={{ height: 170 }} />

                        {/* Spacer para el footer flotante */}
                        <View style={{ height: 170 }} />
                    </>
                )}
            </ScrollView>

            {step === 'review' && (
                <CaptureFooter
                    ctaLabel={DEPOSIT_CONFIG.ctaLabel}
                    ctaSubLabel={DEPOSIT_CONFIG.ctaSub}
                    ctaIcon={DEPOSIT_CONFIG.ctaIcon}
                    ctaColor={DEPOSIT_CONFIG.accent}
                    onCtaPress={handleSave}
                    secondaryActions={[
                        {
                            label: 'Enviar recibo',
                            icon: 'send-outline',
                            color: DEPOSIT_CONFIG.accent,
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

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F8FAFF' },
    scrollContent: { padding: 16, gap: 12, paddingBottom: 24 },
    ocrNote: {
        backgroundColor: '#F8FAFF', borderWidth: 1, borderColor: '#E8EDF5',
        borderRadius: 12, padding: 12,
        flexDirection: 'row', alignItems: 'flex-start', gap: 7,
    },
    ocrNoteIcon: { fontSize: 13, marginTop: 1 },
    ocrNoteText: { flex: 1, fontSize: 11, color: '#64748B', fontWeight: '500', lineHeight: 16 },
    ocrNoteStrong: { fontWeight: '700', color: '#0F172A' },
});

function delay(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}