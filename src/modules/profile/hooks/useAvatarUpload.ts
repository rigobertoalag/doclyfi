import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { uploadAvatar } from '../services/profileService';

type AvatarState = {
    isUploading: boolean;
    error: string | null;
};

export function useAvatarUpload(onSuccess?: (avatarUrl: string) => void) {
    const [state, setState] = useState<AvatarState>({ isUploading: false, error: null });

    const upload = useCallback(async (uri: string) => {
        setState({ isUploading: true, error: null });
        try {
            const formData = new FormData();
            const filename = uri.split('/').pop() ?? 'avatar.jpg';
            const ext = filename.split('.').pop() ?? 'jpg';
            formData.append('file', {
                uri,
                name: filename,
                type: `image/${ext === 'png' ? 'png' : 'jpeg'}`,
            } as any);
            const result = await uploadAvatar(formData);
            onSuccess?.(result.avatarUrl);
            setState({ isUploading: false, error: null });
        } catch (e: any) {
            setState({ isUploading: false, error: e?.message ?? 'Error al actualizar foto de perfil' });
        }
    }, [onSuccess]);

    const pickFromGallery = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            setState({ isUploading: false, error: 'Permiso de galería denegado' });
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            quality: 0.8,
            allowsEditing: true,
            aspect: [1, 1],
        });
        if (!result.canceled && result.assets[0]) {
            await upload(result.assets[0].uri);
        }
    }, [upload]);

    const takePhoto = useCallback(async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            setState({ isUploading: false, error: 'Permiso de cámara denegado' });
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
            allowsEditing: true,
            aspect: [1, 1],
        });
        if (!result.canceled && result.assets[0]) {
            await upload(result.assets[0].uri);
        }
    }, [upload]);

    const clearError = useCallback(() => setState((prev) => ({ ...prev, error: null })), []);

    return { ...state, pickFromGallery, takePhoto, clearError };
}
