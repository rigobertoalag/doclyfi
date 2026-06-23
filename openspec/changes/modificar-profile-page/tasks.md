## 1. Extended User type and AuthContext

- [x] 1.1 Add `avatarUrl`, `emailVerified`, `preferences`, and `stats` fields to the `User` type in `AuthContext`
- [x] 1.2 Fix `User.plan` type to use `PlanId` from `@/constants/plans` instead of `'free' | 'pro'`
- [x] 1.3 Add `avatarUrl` to the SecureStore session save/restore flow

## 2. API client multipart support

- [x] 2.1 Add `api.upload(path, formData)` method to `apiClient.ts` using `multipart/form-data`
- [x] 2.2 Ensure the upload method injects the Bearer token and handles 401 responses

## 3. Reusable profile components

- [x] 3.1 Create `src/components/profile/ProfileAvatar.tsx` — image display with fallback initial, tap-to-edit callback
- [x] 3.2 Create `src/components/profile/ProfileStatCard.tsx` — icon, label, value display card
- [x] 3.3 Create `src/components/profile/ProfileSectionCard.tsx` — collapsible card with header, expand/collapse animation
- [x] 3.4 Create `src/components/profile/ProfileMenuItem.tsx` — icon + label + chevron row (migrate from inline `MenuItem` in `index.tsx`)
- [x] 3.5 Create `src/components/profile/index.ts` — barrel export for all profile components

## 4. Stats service and hook

- [x] 4.1 Create `src/services/profileService.ts` with `fetchStats()`, `updateProfile()`, `changePassword()`, `uploadAvatar()` methods using `apiClient`
- [x] 4.2 Create `src/hooks/useUserStats.ts` — fetches stats from API, handles loading/error states
- [x] 4.3 Create `src/hooks/useAvatarUpload.ts` — camera/gallery permissions, picker launch, upload via `api.upload`, optimistic update

## 5. Profile redesign — index screen

- [x] 5.1 Rewrite `src/app/(main)/profile/index.tsx` with new sectioned layout (avatar, stats, menu, settings, footer)
- [x] 5.2 Integrate `useUserStats` for the stats section with loading skeleton and error/retry
- [x] 5.3 Integrate `ProfileAvatar` with `useAvatarUpload` for tap-to-change avatar
- [x] 5.4 Add settings section with notification toggle, language selector, theme toggle using `ProfileSectionCard`
- [x] 5.5 Add subscription section showing plan badge, usage progress bars, and upgrade CTA
- [x] 5.6 Add footer with app version (from `expo-constants`) and logout button
- [x] 5.7 Remove inline `PLAN_CONFIG` map — use `PLANS` from `@/constants/plans` instead

## 6. Edit profile — real API integration

- [x] 6.1 Update `edit.tsx` to call `profileService.updateProfile()` instead of mocked timeout
- [x] 6.2 Handle API validation errors and network errors in the edit screen UI

## 7. Change password — real API integration

- [x] 7.1 Update `security.tsx` to call `profileService.changePassword()` instead of mocked timeout
- [x] 7.2 Handle API errors (wrong current password, validation) in the security screen UI

## 8. Avatar upload flow

- [x] 8.1 Implement action sheet (bottom sheet) in profile with "Tomar foto", "Elegir de galería", "Cancelar"
- [x] 8.2 Wire `useAvatarUpload` to handle camera/gallery selection and upload
- [x] 8.3 Show error toast on upload failure with revert to previous avatar
