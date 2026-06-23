import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { authStorage } from './auth';

const BASE_URL = process.env.EXPO_PUBLIC_N8N_URL;

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
    code?: string;
};

async function request<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    // ── 1. Obtener token ──────────────────────────────────────
    let token = await authStorage.getToken();

    // ── 2. Renovar si está expirado ───────────────────────────
    if (token && authStorage.isTokenExpired(token)) {
        token = await refreshAccessToken();
        // Si no se pudo renovar, redirige al login
        if (!token) {
            await authStorage.clearSession();
            router.replace('/(auth)/login');
            throw new Error('Sesión expirada');
        }
    }

    // ── 3. Hacer la petición con el header Authorization ──────
    const response = await fetch(`${BASE_URL}/webhook/${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    // ── 4. Sesión inválida en el servidor ─────────────────────
    if (response.status === 401) {
        await authStorage.clearSession();
        router.replace('/(auth)/login');
        throw new Error('No autorizado');
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message ?? 'Error en el servidor');
    }

    return data.data as T;
}

// ── Renovar access token con refresh token ────────────────────
async function refreshAccessToken(): Promise<string | null> {
    try {
        const refreshToken = await authStorage.getRefreshToken();
        if (!refreshToken) return null;

        const res = await fetch(`${BASE_URL}/webhook/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) return null;

        // Guardar el nuevo token
        await SecureStore.setItemAsync('doclyfi_token', data.token);
        return data.token;
    } catch {
        return null;
    }
}

// ── Upload multipart (para imágenes, PDFs, etc.) ──────────────
async function uploadFile<T>(path: string, formData: FormData): Promise<T> {
    let token = await authStorage.getToken();

    if (token && authStorage.isTokenExpired(token)) {
        token = await refreshAccessToken();
        if (!token) {
            await authStorage.clearSession();
            router.replace('/(auth)/login');
            throw new Error('Sesión expirada');
        }
    }

    const response = await fetch(`${BASE_URL}/webhook/${path}`, {
        method: 'POST',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    });

    if (response.status === 401) {
        await authStorage.clearSession();
        router.replace('/(auth)/login');
        throw new Error('No autorizado');
    }

    const data: ApiResponse<T> = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message ?? 'Error en el servidor');
    }

    return data.data as T;
}

// ── Métodos públicos del cliente ──────────────────────────────
export const api = {
    get: <T>(path: string) => request<T>(path, { method: 'GET' }),
    post: <T>(path: string, body: object) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(path: string, body: object) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
    upload: <T>(path: string, formData: FormData) => uploadFile<T>(path, formData),
};