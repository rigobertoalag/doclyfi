import { DocumentDetail } from '@/types/document';
import { authStorage } from '../../scripts/auth';

const N8N_BASE = process.env.EXPO_PUBLIC_N8N_URL;

export async function fetchDocumentDetail(id: string): Promise<DocumentDetail> {
  const token = await authStorage.getToken();

  if (!token || authStorage.isTokenExpired(token)) {
    throw new Error('SESSION_EXPIRED');
  }

  const res = await fetch(
    `${N8N_BASE}/webhook/document-detail?id=${encodeURIComponent(id)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (res.status === 401) throw new Error('SESSION_EXPIRED');
  if (res.status === 404) throw new Error('DOCUMENT_NOT_FOUND');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP_${res.status}`);
  }

  return res.json() as Promise<DocumentDetail>;
}