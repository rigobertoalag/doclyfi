import { useCallback, useEffect, useState } from 'react';
import { fetchStats, type UserStats } from '../services/profileService';

type StatsState = {
    data: UserStats | null;
    isLoading: boolean;
    error: string | null;
};

export function useUserStats() {
    const [state, setState] = useState<StatsState>({ data: null, isLoading: true, error: null });

    const load = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const data = await fetchStats();
            setState({ data, isLoading: false, error: null });
        } catch (e: any) {
            setState({ data: null, isLoading: false, error: e?.message ?? 'Error al cargar estadísticas' });
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    return { ...state, retry: load };
}
