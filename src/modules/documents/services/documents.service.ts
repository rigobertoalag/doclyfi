import { DocsResponse } from '@/modules/documents/types/document';
import { authStorage } from '../../../../scripts/auth';

const N8N_BASE = process.env.EXPO_PUBLIC_N8N_URL;

export type SortOption = 'Más recientes' | 'Más antiguos' | 'Mayor monto' | 'Menor monto' | 'A–Z';

const SORT_MAP: Record<SortOption, string> = {
    'Más recientes': 'recent',
    'Más antiguos': 'oldest',
    'Mayor monto': 'amount_desc',
    'Menor monto': 'amount_asc',
    'A–Z': 'name',
};

export interface FetchDocsParams {
    category?: string;
    sort?: SortOption;
    search?: string;
    limit?: number;
    offset?: number;
}

// ── Fetch con token desde authStorage ────────────────────────
async function fetchWithAuth(url: string): Promise<Response> {
    const token = await authStorage.getToken();

    // Si el token está expirado, no intentar la llamada
    if (!token || authStorage.isTokenExpired(token)) {
        throw new Error('SESSION_EXPIRED');
    }

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return res;
}

// ── Función principal ─────────────────────────────────────────
export async function fetchDocuments(params: FetchDocsParams = {}): Promise<DocsResponse> {
    const qs = new URLSearchParams();

    if (params.category && params.category !== 'all') {
        qs.set('category', params.category);
    }
    if (params.sort) qs.set('sort', SORT_MAP[params.sort] ?? 'recent');
    if (params.search) qs.set('search', params.search);
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.offset) qs.set('offset', String(params.offset));

    const url = `${N8N_BASE}/webhook/documents?${qs.toString()}`;

    let res: Response;
    try {
        res = await fetchWithAuth(url);
    } catch (e: any) {
        // SESSION_EXPIRED — el AuthContext.logout() lo maneja desde el hook
        throw new Error(e.message ?? 'FETCH_ERROR');
    }

    if (res.status === 401) {
        throw new Error('SESSION_EXPIRED');
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP_${res.status}`);
    }

    return res.json() as Promise<DocsResponse>;
}