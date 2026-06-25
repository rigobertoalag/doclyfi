## Context

The Doclyfi app needs AI-powered search to let users find documents using natural language queries. Currently, search is limited to simple text matching against document names and category filtering. The backend exposes a webhook endpoint (`/webhook/ai-search`) that accepts a query and returns AI-interpreted results via Mistral.

The app uses Expo Router with React Native, native `fetch` for HTTP, and stores auth tokens via `authStorage`. There is no existing API service layer — each feature manages its own fetch logic. The OCR feature has a similar pattern (mock) that this can learn from.

## Goals / Non-Goals

**Goals:**
- Provide a natural language search mode accessible from the existing DocumentsScreen
- Enable query interpretation so users see what the AI understood
- Handle all error states gracefully: expired session, short query, timeout, parse failure
- Reuse existing UI components (DocumentRow) and design tokens
- Maintain smooth UX with debounce, loading states, and request cancellation

**Non-Goals:**
- Not replacing the existing text-based search — AI mode is a parallel feature
- Not implementing backend logic — only client-side integration
- Not modifying existing document filtering, sorting, or category logic
- No new external dependencies

## Decisions

1. **Native fetch over axios** — Project has no axios dependency and uses fetch elsewhere. Keeps bundle small and consistent.

2. **AbortController for cancellation** — Each search request gets its own AbortController. When the query changes while a request is in flight (before debounce fires), the previous request is aborted. This prevents stale responses from showing incorrect results.

3. **600ms debounce** — Balances responsiveness with not hammering the API on every keystroke. Users typing quickly will naturally batch character changes into a single request.

4. **Service layer separation** — `ai-search.service.ts` handles only HTTP concerns: token validation, fetch, error mapping. The hook (`useAISearch.ts`) handles state management, debounce, and lifecycle. This separation makes the service testable independently and the hook reusable across screens.

5. **Design system via StyleSheet.create** — Project uses NativeWind/Tailwind for most styles, but the design system specified requires specific colors, border radii, and shadows that are easier to maintain consistently via StyleSheet. This is acceptable as the component is self-contained.

6. **Session expiry via throw + parent handler** — When the token is expired, the service throws `SESSION_EXPIRED`. The hook catches it and calls `logout()` from `AuthContext`. This avoids coupling the service layer to navigation/auth context.

7. **Rotating placeholder via `useEffect` + `Animated.Value`** — Placeholder rotation uses a simple interval with fade transitions for smooth animation. Three-second interval gives users time to read each example without feeling rushed.

## Risks / Trade-offs

- **AI_TIMEOUT (504) — 20s client timeout** → N8N webhooks can be slow (cold start). 20s timeout may need tuning. The user sees a clear error message and can retry.
- **AbortController race condition** → If the user types very quickly, multiple aborts could fire. Mitigated by always creating a new controller each request and never reusing aborted controllers.
- **Placeholder animation performance** → Frequent re-renders from interval + Animated could cause jank on low-end Android. Mitigated by using `useNativeDriver` for opacity transitions.
- **No API layer standardization** → This creates a pattern others will follow. Future refactors should extract common fetch logic (token handling, error mapping) into a shared utility.
