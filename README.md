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
- Cloudinary for hosting photos and voice notes (Firebase Storage now
  requires a paid plan even for free-tier usage, so it isn't used)
- `expo-image-picker` / `expo-camera` for photos, `expo-audio` for voice notes

## Getting started

```bash
npm install
npx expo start
```

Firebase auth/Firestore work out of the box: the project's client-side
config is checked into `src/lib/firebase.ts` (these values aren't secret —
Firebase's security comes from Firestore rules, not from hiding them). To
point at a different Firebase project instead, copy `.env.example` to
`.env` and fill in your own keys; any `EXPO_PUBLIC_FIREBASE_*` var there
overrides the default.

### Firebase setup

1. In the Firebase console, enable **Authentication** (Email/Password) and
   create a **Firestore Database**.
2. Firestore collections used: `memories` (one doc per plan, keyed by a
   generated id) and `rooms` (one doc per shared co-design session).
3. Skip **Storage** — it now requires the paid Blaze plan even for free-tier
   usage, so this app uses Cloudinary instead (see below).

### Cloudinary setup

Photos and voice notes upload to Cloudinary instead of Firebase Storage.

1. Create a free account at [cloudinary.com](https://cloudinary.com) (no
   card required).
2. Note your **Cloud name** from the dashboard.
3. Go to Settings > Upload > Upload presets > Add upload preset, set
   **Signing Mode** to **Unsigned**, and note its name.
4. Copy `.env.example` to `.env` and fill in:
   ```
   EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset-name
   ```
   For EAS builds, add the same two as environment variables on the
   project's `expo.dev` dashboard.

Until Cloudinary is configured, photo/voice-note uploads will throw an
error instead of silently failing, so this step isn't optional once you're
testing those features.

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

`eas.json` ships with three profiles:

- `development` — a debug dev-client build (use this if Expo Go can't run the
  app's native modules)
- `preview` — an installable `.apk` you can hand to anyone, no store account
  needed on the receiving end
- `production` — an `.aab` for a real Play Store submission

To get an installable build on your phone:

```bash
npm install -g eas-cli
eas login              # creates a free Expo account if you don't have one
eas build --platform android --profile preview
```

That prints a build page URL; once it finishes, the page has a QR code and a
direct APK download link. Scan it (or download and open the APK) on an
Android phone with "install unknown apps" allowed for your browser.

The first time you run this in a fresh clone, `eas build` will ask to link
the project to an EAS project id (it can create one for you automatically,
or run `eas init` first) and to generate/upload an Android keystore. Say yes
to both, EAS manages the keystore for you.

For a real store submission later:

```bash
eas build --platform android --profile production
eas submit --platform android
```
