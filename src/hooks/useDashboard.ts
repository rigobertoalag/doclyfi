import { useCallback, useEffect, useState } from 'react';
import { api } from '../../scripts/apiClient';

type DashboardData = {
    user: { fullName: string; plan: string };
    stats: {
        totalDocuments: number;
        warrantyCount: number;
        expiringSoon: number;
    };
    financial: {
        monthlyPaid: number;
        monthlyPending: number;
    };
    recentDocuments: any[];
};

export function useDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await api.get<DashboardData>('dashboard');
            setData(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, []);

    return { data, isLoading, error, refetch: fetchDashboard };
}