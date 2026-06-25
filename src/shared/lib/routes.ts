import { router } from 'expo-router';
import type { PurchaseType } from '@/modules/capture/constants/config';

// ─── Route map — single source of truth ──────────────────────────────────────
export const ROUTES = {
  // Public
  INDEX: '/' as const,
  LOGIN: '/(auth)/login' as const,
  REGISTER: '/(auth)/register' as const,

  // Main tabs
  DASHBOARD: '/(main)/dashboard' as const,
  DOCUMENTS: '/(main)/documents' as const,
  REPORTS: '/(main)/reports' as const,
  PROFILE: '/(main)/profile' as const,

  // Document detail
  DOCUMENT: (id: string) => `/document/${id}` as const,

  // Capture modals
  PURCHASE: (type: PurchaseType = 'warranty') =>
    ({ pathname: '/(modals)/purchase', params: { type } } as const),
  DEPOSITS: '/(modals)/deposits' as const,
  CONTRACTS: '/(modals)/contracts' as const,
  SERVICES: '/(modals)/services' as const,
  PLANS: '/(modals)/plans' as const,
} as const;

// ─── Convenience helpers ─────────────────────────────────────────────────────

/** Push a typed route — autocompleted params */
export function pushRoute(route: string | { pathname: string; params?: Record<string, any> }) {
  router.push(route as any);
}

export { router };
