## Context

The profile page is currently a single-screen layout with inline components, mocked edit/security screens, and no real API integration. The `AuthContext` holds a minimal `User` type (`id`, `fullName`, `email`, `phone`, `plan: 'free' | 'pro'`) while the plans system uses `'free' | 'premium' | 'premium_plus'` — a type mismatch. The app already has a working `apiClient` with token refresh and an `expo-image-picker` / `expo-document-picker` pattern via `useDocumentCapture`.

## Goals / Non-Goals

**Goals:**
- Redesign profile index screen with stats card, settings sections, and subscription status
- Extract reusable components into `src/components/profile/`
- Wire edit profile and change password to real backend endpoints via `apiClient`
- Add avatar upload using camera/gallery (reuse `useDocumentCapture` pattern)
- Display usage quotas and upgrade CTA based on current plan
- Fix `User.plan` type mismatch to align with `PlanId` from plans constants
- Add settings toggles for notifications, language, theme

**Non-Goals:**
- Not building a real subscription/payment flow (navigates to existing plans modal)
- Not building avatar cropping (leveraging `allowsEditing` from `expo-image-picker`)
- Not implementing push notifications infrastructure (just toggling preference)
- Not building a multi-language system (just language selection UI)

## Decisions

1. **Use `apiClient` for real API calls** — edit profile and change password will use `api.put('auth/profile', body)` and `api.put('auth/password', body)` respectively. This reuses existing token refresh, error handling, and 401 redirect logic.
2. **Extend `User` type in `AuthContext`** — add `avatarUrl`, `stats` (docsCount, storageUsed, createdAt), `preferences` (notifications, language, theme), and `emailVerified`. Fix `plan` type to `PlanId` from `@/constants/plans`.
3. **Reusable profile components** — create `ProfileAvatar`, `ProfileStatCard`, `ProfileSectionCard`, `ProfileMenuItem` in `src/components/profile/`. Each follows the existing component conventions (functional, typed, no comments).
4. **Avatar upload via `ImagePicker.launchImageLibraryAsync`** — reuse the camera/gallery approach from `useDocumentCapture` but without OCR. A separate `useAvatarUpload` hook handles permission request, picker launch, upload via `api.post('auth/avatar')`, and optimistic update of `user.avatarUrl`.
5. **Settings section as expandable cards** — use collapsible `ProfileSectionCard` components to group settings. Avoid adding a third-party accordion library; use local state with `LayoutAnimation` for expand/collapse.
6. **Usage stats from dedicated endpoint** — `api.get('user/stats')` returns document count, storage used (bytes), and account creation date. Displayed as stat cards on top of the profile.
7. **Plan badge reflects real `PlanId`** — reuse the existing `PLANS` constant from `@/constants/plans` for badge styling, removing the inline `PLAN_CONFIG` map.

## Risks / Trade-offs

- **[Risk] Backend API endpoints don't exist yet** — the design assumes `auth/profile`, `auth/password`, `auth/avatar`, and `user/stats` will exist at the n8n webhook URL. **Mitigation**: abstract API calls behind a `profileService` module that can be mocked during development; keep mocked fallback until endpoints are ready.
- **[Risk] Avatar upload adds complexity** — image upload requires multipart form data, which `apiClient` currently doesn't support (it sends JSON). **Mitigation**: add a `api.upload` method or handle the upload directly with fetch + form-data.
- **[Trade-off] Settings are local-only initially** — notification/language/theme preferences are stored in `User.preferences` but only persisted locally via `updateUser`. Server sync is deferred to avoid scope creep.
