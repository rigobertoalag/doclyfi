import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authStorage } from '../scripts/auth';
import type { PlanId } from '../src/constants/plans';

type UserStats = {
    docsCount: number;
    storageUsed: number;
    createdAt: string;
};

type UserPreferences = {
    notifications: boolean;
    language: string;
    theme: 'light' | 'dark';
};

type User = {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
    plan: PlanId;
    avatarUrl: string | null;
    emailVerified: boolean;
    preferences: UserPreferences;
    stats: UserStats;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (token: string, refreshToken: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Al iniciar la app, recuperar sesión guardada
    useEffect(() => {
        (async () => {
            try {
                const token = await authStorage.getToken();
                if (!token || authStorage.isTokenExpired(token)) {
                    await authStorage.clearSession();
                    return;
                }
                const savedUser = await authStorage.getUser<User>();
                if (savedUser) setUser(normalizeUser(savedUser));
            } catch {
                await authStorage.clearSession();
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const normalizeUser = (u: User): User => ({
        ...u,
        avatarUrl: u.avatarUrl ?? null,
        emailVerified: u.emailVerified ?? false,
        preferences: u.preferences ?? { notifications: true, language: 'es', theme: 'light' },
        stats: u.stats ?? { docsCount: 0, storageUsed: 0, createdAt: new Date().toISOString() },
    });

    const login = async (token: string, refreshToken: string, userData: User) => {
        const normalized = normalizeUser(userData);
        await authStorage.saveSession(token, refreshToken, normalized);
        setUser(normalized);
    };

    const updateUser = async (updates: Partial<User>) => {
        if (!user) return;
        const updated = normalizeUser({ ...user, ...updates });
        const token = await authStorage.getToken();
        const refreshToken = await authStorage.getRefreshToken();
        if (token && refreshToken) {
            await authStorage.saveSession(token, refreshToken, updated);
        }
        setUser(updated);
    };

    const logout = async () => {
        await authStorage.clearSession();
        setUser(null);
        router.replace('/(auth)/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            logout,
            updateUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext debe usarse dentro de AuthProvider');
    return ctx;
};