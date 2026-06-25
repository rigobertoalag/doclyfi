import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

export type CaptureStep = 'capture' | 'processing' | 'review' | 'done' | 'error';
export type CaptureSource = 'camera' | 'gallery' | 'pdf';

export type UseDocumentCaptureOptions<T> = {
    runOcr: (imageUri: string) => Promise<T>; // cada pantalla pasa su propio parser
};

export function useDocumentCapture<T>({ runOcr }: UseDocumentCaptureOptions<T>) {
    const [step, setStep]         = useState<CaptureStep>('capture');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [ocrData, setOcrData]   = useState<T | null>(null);
    const [error, setError]       = useState<string | null>(null);

    const handleSource = useCallback(async (sourceId: CaptureSource) => {
        let uri: string | null = null;

        if (sourceId === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') return;
            const result = await ImagePicker.launchCameraAsync({ quality: 0.9, allowsEditing: true, aspect: [3, 4] });
            if (!result.canceled) uri = result.assets[0].uri;

        } else if (sourceId === 'gallery') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') return;
            const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.9, allowsEditing: true, aspect: [3, 4] });
            if (!result.canceled) uri = result.assets[0].uri;

        } else {
            const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true });
            if (!result.canceled && result.assets.length > 0) uri = result.assets[0].uri;
        }

        if (!uri) return;

        setImageUri(uri);
        setStep('processing');
        setError(null);

        try {
            const data = await runOcr(uri);
            setOcrData(data);
            setStep('review');
        } catch (e: any) {
            setError(e?.message ?? 'Error al procesar el documento');
            setStep('error');
        }
    }, [runOcr]);

    const reset = useCallback(() => {
        setStep('capture');
        setImageUri(null);
        setOcrData(null);
        setError(null);
    }, []);

    return { step, imageUri, ocrData, error, handleSource, reset };
}