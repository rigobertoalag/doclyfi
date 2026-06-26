import { DocItem, CategoryId, FileType } from '@/modules/documents/types/document';
import { authStorage } from '../../scripts/auth';

const N8N_BASE = process.env.EXPO_PUBLIC_N8N_URL;

const CATEGORY_MAP: Record<number, CategoryId> = {
  1: 'warranty',
  2: 'invoice',
  3: 'deposit',
  4: 'services',
  5: 'contracts',
};

function mapRawItem(raw: any): DocItem {
  return {
    id: String(raw.id ?? ''),
    name: raw.name ?? '',
    provider: raw.provider ?? '',
    date: raw.date ?? '',
    amount: raw.ticketTotal ?? raw.amount ?? null,
    fileType: (raw.fileType as FileType) ?? 'PDF',
    fileSize: raw.fileSize != null ? String(raw.fileSize) + ' KB' : '0 KB',
    thumbnailUrl: raw.thumbnailUrl ?? null,
    status: raw.status ?? 'active',
    categoryId: CATEGORY_MAP[raw.categoryId] ?? 'warranty',
  };
}

function extractResults(raw: any) {
  const data = Array.isArray(raw) ? raw[0] : raw;
  const body = data.body ?? data;
  return {
    query_interpretation: body.query_interpretation ?? '',
    results: (body.results ?? []).map(mapRawItem),
    total: body.total ?? 0,
  };
}

export interface AISearchResponse {
  query_interpretation: string;
  results: DocItem[];
  total: number;
}

export async function searchDocuments(
  query: string,
  signal?: AbortSignal,
): Promise<AISearchResponse> {
  const token = await authStorage.getToken();

  if (!token || authStorage.isTokenExpired(token)) {
    throw new Error('SESSION_EXPIRED');
  }

  const url = `${N8N_BASE}/webhook/ai-search?q=${encodeURIComponent(query)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
  } catch (e: any) {
    if (e.name === 'AbortError') throw e;
    throw new Error('AI_SEARCH_ERROR');
  }

  if (res.status === 401) throw new Error('SESSION_EXPIRED');

  if (res.status === 400) {
    let raw: any;
    try {
      raw = await res.json();
    } catch {
      throw new Error('AI_PARSE_ERROR');
    }
    return extractResults(raw);
  }

  if (res.status === 504) throw new Error('AI_TIMEOUT');
  if (res.status === 422) throw new Error('AI_PARSE_ERROR');

  if (!res.ok) {
    throw new Error('AI_SEARCH_ERROR');
  }

  let raw: any;
  try {
    raw = await res.json();
  } catch {
    throw new Error('AI_PARSE_ERROR');
  }

  return extractResults(raw);
}
