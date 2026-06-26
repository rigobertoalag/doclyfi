import { AISearchResponse, searchDocuments } from '@/services/ai-search.service';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';

export type SearchStatus = 'idle' | 'loading' | 'results' | 'error';

export interface UseAISearchResult {
  query: string;
  setQuery: (q: string) => void;
  results: AISearchResponse['results'];
  interpretation: string;
  status: SearchStatus;
  error: string | null;
  clear: () => void;
}

export function useAISearch(): UseAISearchResult {
  const { logout } = useAuthContext();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AISearchResponse['results']>([]);
  const [interpretation, setInterpretation] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setInterpretation('');
      setError(null);
      setStatus('idle');
      return;
    }

    const controller = new AbortController();
    const timeoutMs = 20000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const timer = setTimeout(async () => {
      setStatus('loading');
      setError(null);

      try {
        const response = await searchDocuments(query, controller.signal);
        if (!controller.signal.aborted) {
          setResults(response.results ?? []);
          setInterpretation(response.query_interpretation);
          setStatus('results');
        }
      } catch (e: any) {
        if (e.name === 'AbortError') return;
        if (e.message === 'SESSION_EXPIRED') {
          await logout();
          return;
        }
        setResults([]);
        setInterpretation('');
        setStatus('error');
        setError(e.message ?? 'AI_SEARCH_ERROR');
      }
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, logout]);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setInterpretation('');
    setStatus('idle');
    setError(null);
  }, []);

  return { query, setQuery, results, interpretation, status, error, clear };
}
