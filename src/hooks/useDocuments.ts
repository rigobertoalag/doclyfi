// hooks/useDocuments.ts

import { FetchDocsParams, fetchDocuments, SortOption } from '@/services/documents.service';
import { DocsResponse } from '@/types/document';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';

interface UseDocumentsResult {
    data: DocsResponse | null;
    loading: boolean;
    error: string | null;
    reload: () => void;
}

export function useDocuments(
    category: string,
    sort: SortOption,
    search: string,
): UseDocumentsResult {
    const { logout } = useAuthContext();

    const [data, setData] = useState<DocsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ── Debounce búsqueda — evita llamada por cada tecla ─────
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => setDebouncedSearch(search), 400);
        return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
    }, [search]);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params: FetchDocsParams = {
                category: category === 'all' ? undefined : category,
                sort,
                search: debouncedSearch || undefined,
                limit: 50,
                offset: 0,
            };
            const result = await fetchDocuments(params);
            setData(result);

        } catch (e: any) {
            // Sesión expirada — redirigir al login via AuthContext
            if (e.message === 'SESSION_EXPIRED') {
                await logout();
                return;
            }
            setError(e.message ?? 'Error al cargar documentos');
        } finally {
            setLoading(false);
        }
    }, [category, sort, debouncedSearch, logout]);

    useEffect(() => { load(); }, [load]);

    return { data, loading, error, reload: load };
}