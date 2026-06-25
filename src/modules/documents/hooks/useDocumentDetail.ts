// hooks/useDocumentDetail.ts

import { fetchDocumentDetail } from '@/modules/documents/services/document-detail.service';
import { DocumentDetail } from '@/modules/documents/types/document';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../../context/AuthContext';

export function useDocumentDetail(id: string) {
  const { logout } = useAuthContext();

  const [data,    setData]    = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchDocumentDetail(id);
        if (!cancelled) setData(result);
      } catch (e: any) {
        if (cancelled) return;
        if (e.message === 'SESSION_EXPIRED') { await logout(); return; }
        setError(e.message ?? 'ERROR_DESCONOCIDO');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  return { data, loading, error };
}