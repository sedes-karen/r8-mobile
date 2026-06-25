This file is in English to aid agent understanding. Code in English, respond to the user and comment in Spanish.

## Project overview
R8 Mobile — React Native + Expo app for a music promos platform.
Three roles: unauthenticated, Artist, Label. Spanish-speaking team, academic project.

## Tech stack
- Expo SDK 54, React >=19.1, React Native >0.81.0
- TypeScript strict mode
- React Navigation v7 (native-stack, static API)
- npm (package manager, lockfile present)

## Setup & development
- Install: `npm ci`
- Clear cache: `npx expo start --clear`
- Start dev server: `npm start` (the user runs this, not you)
- Android: `npm run android` (the user runs this, not you)
- iOS (macOS only): `npm run ios` (the user runs this, not you)
- Web (quick UI testing): `npm run web` (the user runs this, not you; but if you have browser control tools, inform the user and help them)

## Architecture
- **Atomic Design**: `src/components/atoms/` → `molecules/` → `organisms/` → `screens/`
- **Screens by role**: `screens/Auth/`, `screens/Artist/`, `screens/Label/`
- **Design tokens**: `src/constants/design.ts` (colors, spacing, fontSizes, etc. Use those instead of literals in styles)
- **Auth context**: `src/features/auth/info.tsx` — `AuthInfoProvider` + hooks (`useIsAuthenticated`, `useIsArtist`, `useIsLabel`, `useIsNotAuthenticated`)
- **API service layer**: `src/services/api/`
- **Types**: `src/types/`
- **Navigation**: `src/navigation/index.tsx` — static stack per role, conditional rendering via `if:` on RootStack

## Naming conventions
- Screen exports: `{Role}{Feature}{ScreenName}Screen` (e.g. `LabelReleasesListScreen`, `ArtistPromosPlayerScreen`, note that it is mostly determined by the file path / "route" on the navigation stack)
- File names: PascalCase matching the component export for components and screens, lowercase otherwise
- Design token keys: lowercase, semantic (e.g. `primary`, `md`, `bold`)

## Navigation rules
- Add new screens to `src/navigation/index.tsx` inside the correct stack
- Follow strong hierarchical organization based on UX choices (ask the user if it is unclear)
- Role gating handled via `if:` on RootStack screens (no manual guards needed)
- Nested stacks allowed (e.g. Label > Releases > Promos)

## Important notes
- No test runner or linter configured yet
- All screen files are currently placeholder templates (though navigation works, given links to the screen that's being worked on exist)
- API contract: `docs/REFERENCIA_API_R8.md`
- Atomic design guide: `docs/ATOMIC_DESIGN.md`
- Per-team functional specs: `docs/EQUIPO_*_FUNCIONAL.md`
