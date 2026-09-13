// firebase's package.json "exports" map for the "./auth" subpath doesn't
// surface React Native-specific types, even though the runtime module it
// re-exports (@firebase/auth) does provide this function for RN — see
// node_modules/@firebase/auth/dist/rn/index.js. This augments the public
// types to match what's actually available at runtime.
import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
