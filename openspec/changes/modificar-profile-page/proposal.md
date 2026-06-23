## Why

The current profile page is bare-bones — it shows basic info (name, email, plan) with mocked edit and password screens. Users cannot see their real usage stats, manage subscription, or access the app reliably. The profile is a core part of the app experience and needs a complete refresh to match the planned design and support real backend integration.

## What Changes

- Redesign profile screen with user stats (documents processed, storage used, account age)
- Add real settings section: notifications, language, theme toggle
- Implement proper avatar with photo upload (camera/gallery via existing `useDocumentCapture` pattern)
- Wire edit profile to real API via existing `apiClient`
- Wire change password to real API via existing `apiClient`
- Add subscription management section (current plan, usage, upgrade CTA)
- Show account verification status and resend verification option
- Add app version and logout in a footer section
- Extract reusable profile components (ProfileAvatar, ProfileMenuItem, ProfileStats, ProfileSettingsSection)

## Capabilities

### New Capabilities
- `profile-redesign`: Redesigned profile screen layout with stats, settings, and subscription info
- `avatar-upload`: Avatar image upload using camera/gallery with crop
- `profile-api-integration`: Wire edit profile and change password to real API endpoints
- `subscription-management`: Display current plan, usage quotas, and upgrade options

### Modified Capabilities
None — no existing specs to modify.

## Impact

- `src/app/(main)/profile/` — rewrite `index.tsx`, update `edit.tsx` and `security.tsx`
- `src/components/profile/` — new reusable component directory
- `context/AuthContext.tsx` — may need to extend user type with avatar, stats, verification fields
- `src/constants/plans.ts` — may need usage-quota constants
- `apiClient.ts` — leveraged for real API calls (no changes expected)
- `src/app/(main)/_layout.tsx` — tab bar icon or label changes if needed
