import { api } from '../../scripts/apiClient';

export type UserStats = {
    docsCount: number;
    storageUsed: number;
    createdAt: string;
};

export type UpdateProfilePayload = {
    fullName?: string;
    phone?: string | null;
};

export type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
};

export async function fetchStats(): Promise<UserStats> {
    return api.get<UserStats>('user/stats');
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<void> {
    await api.put('auth/profile', payload);
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
    await api.put('auth/password', payload);
}

export async function uploadAvatar(formData: FormData): Promise<{ avatarUrl: string }> {
    return api.upload<{ avatarUrl: string }>('auth/avatar', formData);
}
