---
name: add-screen
description: Add an Expo Router screen that stays usable on web, iOS, and Android.
---

# Add a screen

1. Create `app/<route>.tsx`; nested directories create nested URL and navigation segments.
2. Export one default React component and use React Native primitives, never browser-only elements.
3. Register screen-specific header options in `app/_layout.tsx` when the route needs them.
4. Put reusable components outside `app/` and add `.web.tsx` or `.native.tsx` only for real platform differences.
5. Run `bun run verify` and resolve TypeScript and export failures on all three platforms.
6. Use only modules that ship in Expo Go (Expo SDK modules and existing dependencies).
