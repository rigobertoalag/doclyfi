import { CaptureFooter } from "@/modules/capture/components/CaptureFooter";
import { CaptureHeader } from "@/shared/components/CaptureHeader";
import { CaptureInfoStrip } from "@/modules/capture/components/CaptureInfoStrip";
import { CaptureSourceCard } from "@/modules/capture/components/CaptureSourceCard";
import { CaptureTitleSection } from "@/modules/capture/components/CaptureTitleSection";
import { OcrInfoCard } from "@/modules/capture/components/OcrInfoCard";
import { TicketIllustration } from "@/modules/capture/components/TicketIllustration";
import { AlertConfig, ExpiryAlerts } from "@/modules/capture/components/ExpiryAlerts";
import { LinkDocument, LinkedDocument } from "@/modules/capture/components/LinkDocument";
import { Product, ProductsSection } from "@/modules/capture/components/ProductsSection";
import { MOCK_OCR_NO_WARRANTY, MOCK_OCR_WARRANTY } from "@/modules/capture/mocks/ocr";
import { MOCK_PRODUCTS } from "@/modules/capture/mocks/products";
import { OcrField, PURCHASE_CONFIG, PurchaseType } from "@/modules/capture/constants/config";
import { useDocumentCapture } from "@/modules/capture/hooks/useDocumentCapture";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PurchaseScreen() {
    const { type } = useLocalSearchParams<{ type: PurchaseType }>();
    const cfg = PURCHASE_CONFIG[type ?? 'warranty'];

    // ✅ Solo lógica específica de compras
    const [ocrFields, setOcrFields] = useState<OcrField[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [alertConfig, setAlertConfig] = useState<AlertConfig>({ selectedDays: 30, customDate: null });
    const [linkedDoc, setLinkedDoc] = useState<LinkedDocument | null>(null);

    // ✅ Hook genérico — solo le pasas tu parser de OCR
    const { step, handleSource, reset } = useDocumentCapture({
        runOcr: async (_uri) => {
            await delay(2500);
            setOcrFields(type === 'warranty' ? MOCK_OCR_WARRANTY : MOCK_OCR_NO_WARRANTY);
            setProducts(MOCK_PRODUCTS);
        },
    });

    const handleSave = () => {
        const payload = {
            fields: ocrFields,
            products,
            total: products.reduce((s, p) => s + p.price * p.quantity, 0),
            documentType: type,
            savedAt: new Date().toISOString(),
            linkedDocumentId: linkedDoc?.id ?? null,
        };
        console.log('Payload →', payload);
    };

    const visibleFields = ocrFields.filter(f => !f.warrantyOnly || type === 'warranty');

    const handleFieldEdit = (id: string, value: string) => {
        setOcrFields(prev => prev.map(f => f.id === id ? { ...f, value } : f));
    };


    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <CaptureHeader onBack={() => router.dismiss()} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <CaptureTitleSection
                    pill={cfg.pill}
                    subtitle={cfg.subtitle}
                    accentColor={cfg.accent}
                    accentBg={cfg.accentBg}
                    accentBorder={cfg.accentBorder}
                />

                {/* ✅ Componente genérico — solo cambia la ilustración */}
                <CaptureSourceCard
                    title={cfg.captureTitle}
                    subtitle="Escanea o sube tu comprobante."
                    onSource={handleSource}
                    illustration={<TicketIllustration type={type ?? 'warranty'} accentColor={cfg.accent} />}
                />

                <CaptureInfoStrip
                    icon={cfg.infoIcon}
                    text={cfg.infoText}
                    color={cfg.accent}
                    bg={cfg.accentBg}
                    border={cfg.accentBorder}
                />

                {step === 'review' && (
                    <>
                        {/* Secciones específicas de compras */}
                        <OcrInfoCard fields={visibleFields} onEdit={handleFieldEdit} />
                        <ProductsSection products={products} accentColor={cfg.accent} onChange={setProducts} />
                        {type === 'warranty' && <ExpiryAlerts value={alertConfig} onChange={setAlertConfig} accentColor={cfg.accent} />}
                        <LinkDocument
                            linked={linkedDoc}
                            accentColor={cfg.accent}
                            onLink={() => setLinkedDoc({
                                id: 'doc_abc123',
                                name: 'Factura MediaMarkt Mayo 2024.pdf',
                                type: 'invoice',
                                typeLabel: '📄 Factura',
                            })}
                            onUnlink={() => setLinkedDoc(null)}
                        />
                        <View style={{ height: 170 }} />
                    </>
                )}
            </ScrollView>

            {step === 'review' && (
                <CaptureFooter
                    ctaLabel={cfg.ctaLabel}
                    ctaSubLabel={cfg.ctaSub}
                    ctaIcon={cfg.ctaIcon}
                    ctaColor={cfg.accent}
                    onCtaPress={handleSave}
                    secondaryActions={[
                        { label: 'Facturar ahora', icon: 'receipt-outline', color: '#3B7BFF', onPress: () => { } },
                        { label: 'Enviar a contador', icon: 'send-outline', onPress: () => { } },
                    ]}
                    onDiscard={() => router.dismiss()}
                    discardLabel="Descartar ticket"
                />
            )}
        </SafeAreaView>
    );
}

function delay(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F8FAFF' },
    scrollContent: { padding: 16, gap: 12, paddingBottom: 24 },

})