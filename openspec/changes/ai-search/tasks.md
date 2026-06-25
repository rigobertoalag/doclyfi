## 1. AI Search Service

- [ ] 1.1 Create `src/services/ai-search.service.ts` with `AISearchResponse` type and `searchDocuments(query: string)` function
- [ ] 1.2 Implement token reading via `authStorage.getToken()` and expiry validation via `authStorage.isTokenExpired(token)` — throw `SESSION_EXPIRED` if expired
- [ ] 1.3 Implement GET request to `{EXPO_PUBLIC_N8N_URL}/webhook/ai-search?q={query}` with `Authorization: Bearer` header using native fetch
- [ ] 1.4 Add AbortController with 20-second client timeout
- [ ] 1.5 Map HTTP status responses: 401→SESSION_EXPIRED, 400→QUERY_TOO_SHORT, 504→AI_TIMEOUT, 422→AI_PARSE_ERROR

## 2. useAISearch Hook

- [ ] 2.1 Create `src/hooks/useAISearch.ts` with state: `query`, `results`, `interpretation`, `status`, `error`
- [ ] 2.2 Implement `setQuery` with 600ms debounce (useRef timeout + AbortController ref)
- [ ] 2.3 Skip search when query length < 3 characters (set status to `'idle'`)
- [ ] 2.4 Cancel previous request via AbortController on new query
- [ ] 2.5 Handle `SESSION_EXPIRED` by calling `logout()` from `AuthContext` without updating state
- [ ] 2.6 Handle other errors by setting `status: 'error'` and `error` message
- [ ] 2.7 Implement `clear()` to reset all state to initial values

## 3. AISearchBar Component

- [ ] 3.1 Create `src/components/search/AISearchBar.tsx` with StyleSheet design system tokens
- [ ] 3.2 Implement animated placeholder rotation every 3 seconds with fade transitions
- [ ] 3.3 Add 3-dot bouncing loading animation when status === 'loading'
- [ ] 3.4 Add X close button that calls `clear()` and `onClose()` with collapse animation
- [ ] 3.5 Accept props: `onClose`, `query`, `setQuery`, `status`

## 4. AISearchResults Component

- [ ] 4.1 Create `src/components/search/AISearchResults.tsx` with StyleSheet design tokens
- [ ] 4.2 Render interpretation chip (background #EFF6FF, border #BFDBFE, text #3B7BFF)
- [ ] 4.3 Render results list using `DocumentRow` with `accentColor` by `categoryId`
- [ ] 4.4 Render empty state with icon, title, subtitle, and suggestion chips
- [ ] 4.5 Render error state with human-readable messages per error type

## 5. Integration in DocumentsScreen

- [ ] 5.1 Add `useAISearch` hook and `aiMode` state to DocumentsScreen
- [ ] 5.2 Add "IA" button next to existing search bar (background #EFF6FF, border #BFDBFE, color #3B7BFF)
- [ ] 5.3 Conditionally render AISearchBar (aiMode=true) or normal search bar (aiMode=false)
- [ ] 5.4 Conditionally render AISearchResults (aiMode=true) or normal content (aiMode=false)
- [ ] 5.5 Hide category chips and sort row when aiMode is true
- [ ] 5.6 Wire `onClose` to set aiMode false and call `clear()`
