## Why

Users can currently only search documents by simple text matching and category filters. They need natural language search to find documents contextually (e.g., "cafés comprados en Liverpool", "facturas de luz del año pasado"). Adding AI-powered search with query interpretation (via Mistral) will dramatically improve document discoverability and user experience.

## What Changes

- New **`services/ai-search.service.ts`** — backend integration for AI search API calls with timeout, token validation, and specific error handling
- New **`hooks/useAISearch.ts`** — React hook managing search state, debounce (600ms), AbortController for request cancellation, and session expiry handling
- New **`AISearchBar` component** — expandable search bar with animated placeholder (rotating examples), loading animation, and slide-to-close
- New **`AISearchResults` component** — displays query interpretation chip, document results list (reusing `DocumentRow`), empty state with suggestion chips, and error states
- **Integration in `DocumentsScreen`** — AI mode toggle button next to existing search bar, conditional rendering of AI search bar and results, hidden category/sort rows during AI mode

## Capabilities

### New Capabilities
- `ai-search-service`: API integration layer for AI document search with authentication, error mapping, and timeout handling
- `ai-search-hook`: React hook for AI search state management with debounce, abort, and session expiry
- `ai-search-bar`: Expandable search bar component with animated placeholder and loading indicator
- `ai-search-results`: Results display component with interpretation chip, document list, empty state, and error states
- `ai-search-integration`: Integration of AI search mode into the existing DocumentsScreen

### Modified Capabilities

None — all capabilities are new additions.

## Impact

- New service file: `src/services/ai-search.service.ts`
- New hook file: `src/hooks/useAISearch.ts`
- New component files: `src/components/search/AISearchBar.tsx`, `src/components/search/AISearchResults.tsx`
- Modified file: `src/app/(main)/documents.tsx` (DocumentsScreen)
- No breaking changes to existing search, filtering, or data fetching
- No new dependencies required (uses native `fetch`, `@expo/vector-icons/Ionicons`)
