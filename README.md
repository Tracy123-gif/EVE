# EVE

A React Native (Expo) app for planning dates, solo plans, and bucket-list
memories on a collage-style canvas, then flipping them open on the day
itself.

## Stack

- Expo + React Native + TypeScript
- `@shopify/react-native-skia` for the canvas background, `react-native-gesture-handler`
  + `react-native-reanimated` for drag/pinch/rotate on canvas elements
- React Navigation (native stack + drawer)
- Zustand for state
- Firebase (Auth, Firestore) for accounts, saved memories, and shared rooms
- `expo-image-picker` / `expo-camera` for photos, `expo-av` for voice notes

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your Firebase project keys
npx expo start
```

### Firebase setup

1. Create a Firebase project, enable **Authentication** (Email/Password, and
   Google if you want it) and **Firestore**.
2. Copy your web app config into `.env` (see `.env.example`). These are
   `EXPO_PUBLIC_*` variables, inlined at build time — no extra config needed.
3. For Google sign-in, also set `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`,
   `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`, and/or `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
   from a Google Cloud OAuth client. Without these the Google button is hidden
   and email/password auth still works.
4. Firestore collections used: `memories` (one doc per plan, keyed by a
   generated id) and `rooms` (one doc per shared co-design session).

Until `.env` is filled in, the app still runs and every screen renders, but
auth/save actions will show a friendly "Firebase isn't configured" message
instead of crashing.

### Fonts

The design brief calls for Futura (functional UI) and Hangyaboly (whimsical/
handwritten text), but both require paid commercial licenses to embed in an
app bundle. This build uses the suggested free substitutes instead:
**Jost** for UI text and **Caveat** for the whimsical/handwritten voice
(`src/theme/theme.ts`). Swap these for the licensed fonts later if you
purchase them — everything reads from `theme.fonts`.

### Assets

- `assets/icons/*.svg` — the functional icon set, imported as components via
  `react-native-svg-transformer` (see `src/components/Icon.tsx`).
- `assets/stickers/*.png` — the sticker pack, exposed as a flat list in
  `src/lib/stickers.ts` (the source pack has no category metadata, so the
  Editor's asset picker currently shows them in one grid).

## What's implemented

- Auth (email/password + optional Google), onboarding, mode selection
- Canvas editor: place/drag/pinch-resize/rotate stickers, photos, and text;
  background picker (static + animated gradients), camera/library import,
  music attachment (reference only, playback happens on the reveal screen)
- Details screen (date, note, prep checklist) as the second page of a
  swipeable two-page create flow, autosaved to Firestore
- Shared "room" flow: create with a join code, join by code, realtime
  join/ready listeners, a merge-style reveal ceremony
- Date-gated Flip/Reveal screen (photos, reflection text, a capped voice
  note, a celebration animation on first completion)
- Calendar, Scrapbook (book spread), and Gallery (shuffleable stack) views
- Settings and Profile screens

## What's stubbed or left for later (see the original build roadmap)

- Background removal via remove.bg (needs a Cloud Function holding the API
  key — no backend project is included here)
- Push notification scheduling exists as a helper (`src/lib/notifications.ts`)
  but isn't wired into the countdown/resurfacing UX yet
- Final designed sticker/background art, store listing assets, and the Play
  Store submission steps (Phase 6-7 of the roadmap) are unstarted

## EAS Build

```bash
npm install -g eas-cli
eas login
eas build --platform android
eas submit --platform android
```
