# Doclyfi — Expo mobile app

## Stack
- Expo SDK **54** (not 55 — use https://docs.expo.dev/versions/v54.0.0/)
- expo-router **6** (file-based routing), React Native **0.81.5**, NativeWind **4**
- React 19, TypeScript 5.9, `@/*` → `./src/*`, `@/assets/*` → `./assets/*`

## Commands
- `npm start` — dev server
- `npm run android` / `npm run ios` / `npm run web`
- `npm run lint` — `expo lint` (default Expo ESLint)
- No test or typecheck scripts exist

## Project structure
- Routes: `src/app/` — groups `(auth)/` (login, register), `(main)/` (dashboard, documents)
- Capture screens (modals): `src/app/contracts.tsx`, `deposits.tsx`, `services.tsx`, `purchase.tsx`
- Reusable capture pattern: `CaptureSourceCard → useDocumentCapture → OcrInfoCard → CaptureFooter`
- Components: `src/components/ui/` (shared), `src/components/capture/` (capture flow)
- `src/hooks/useDocumentCapture.ts` — generic image picker / camera / PDF + OCR orchestrator

## Known gotchas
- **Tailwind content paths are wrong** — `tailwind.config.js` references `./app/` but source is in `./src/`. NativeWind classes may not resolve.
- **Auth is mocked** — no real auth hook or backend yet
- **OCR is mocked** — all `MOCK_OCR_*` data in `src/constants/config.ts`; real OCR (Mistral) not wired
- **No API layer** yet — no services/, no api/ directory
- **Custom tab bar** with FAB lives in `(main)/_layout.tsx`
- VS Code: install `expo.vscode-expo-tools`, auto-fix + organize imports on save
- `.claude/settings.json` enables `expo@claude-plugins-official`
