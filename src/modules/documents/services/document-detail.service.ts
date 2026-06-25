import { DocumentDetail, DocumentProduct } from '@/modules/documents/types/document';
import { authStorage } from '../../../../scripts/auth';

const N8N_BASE = process.env.EXPO_PUBLIC_N8N_URL;

function deepParse(value: string): any {
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === 'string' ? deepParse(parsed) : parsed;
  } catch {
    return null;
  }
}

function parseProductsFromExtraFields(extraFields: { label: string; value: string }[]): DocumentProduct[] {
  const productosField = extraFields?.find(f => /producto/i.test(f.label));
  if (!productosField) return [];

  const raw = deepParse(productosField.value);
  if (!raw) return [];

  const items = Array.isArray(raw) ? raw : [raw];

  return items.map((i: any) => ({
    name:     i.descripcion ?? i.name ?? 'Producto',
    quantity: i.cantidad ?? i.quantity,
    price:    i.precio_total ?? i.price,
  }));
}

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

  const rawArray = await res.json();
  const raw = Array.isArray(rawArray) ? rawArray[0] : rawArray;

  const linkedDocs = (raw.linkedDocs ?? []).map((ld: any, idx: number) => ({
    id:        ld.id ?? `linked-${idx}`,
    name:      ld.name ?? 'Documento vinculado',
    subtitle:  ld.subtitle ?? '',
    isPrimary: ld.isPrimary ?? false,
  }));

  const doc: DocumentDetail = {
    ...raw,
    linkedDocs,
    items: raw.items ?? raw.products ?? parseProductsFromExtraFields(raw.extraFields ?? []),
  };

  return doc;
}