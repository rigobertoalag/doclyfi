import * as SecureStore from 'expo-secure-store';

const KEYS = {
    token: 'doclyfi_token',
    refresh: 'doclyfi_refresh_token',
    user: 'doclyfi_user',
} as const;

export const authStorage = {
    async saveSession(token: string, refreshToken: string, user: object) {
        await Promise.all([
            SecureStore.setItemAsync(KEYS.token, token),
            SecureStore.setItemAsync(KEYS.refresh, refreshToken),
            SecureStore.setItemAsync(KEYS.user, JSON.stringify(user)),
        ]);
    },

    async getToken(): Promise<string | null> {
        return SecureStore.getItemAsync(KEYS.token);
    },

    async getRefreshToken(): Promise<string | null> {
        return SecureStore.getItemAsync(KEYS.refresh);
    },

    async getUser<T>(): Promise<T | null> {
        const raw = await SecureStore.getItemAsync(KEYS.user);
        return raw ? JSON.parse(raw) : null;
    },

    async clearSession() {
        await Promise.all([
            SecureStore.deleteItemAsync(KEYS.token),
            SecureStore.deleteItemAsync(KEYS.refresh),
            SecureStore.deleteItemAsync(KEYS.user),
        ]);
    },

    // Decodifica el payload del JWT sin verificar firma (solo en cliente)
    decodeToken(token: string): Record<string, any> | null {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch {
            return null;
        }
    },

    isTokenExpired(token: string): boolean {
        const decoded = this.decodeToken(token);
        if (!decoded?.exp) return true;
        return decoded.exp < Math.floor(Date.now() / 1000);
    },
};