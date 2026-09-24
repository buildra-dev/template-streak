# Expo project instructions

This project started from Buildra's Streak template: a habit tracker whose screens live in
`src/screens/`, its components in `src/components/`, and its look in `src/theme.ts` (colours,
Bricolage Grotesque and DM Sans). Keep extending that look for Streak's own screens; the rules
below still hold for everything else, and the UI kit in `components/ui/` is available for new work.

## Stack

- Expo SDK 54, React Native 0.81, React 19.1, TypeScript, and Expo Router 6 file routes.

## Preview

The person sees the app natively in Expo Go on their own phone, loaded from this workspace's Metro through Buildra's preview host. The dashboard's phone frames show the web build of the same code. Both reload when files change.

## Native rules

- Use only packages whose native code ships inside Expo Go: Expo SDK modules (`expo-*`), React Native core, and packages already in `package.json`.
- Never add a package that needs custom native code or a config plugin that changes native projects, and never run `expo prebuild`.
- Never create or edit `ios/` or `android/` directories; they must not exist.
- Pin new packages to the versions Expo SDK 54 expects; `npx expo install <pkg>` chooses them.
- Use `window`, `document`, and other DOM APIs only inside `Platform.OS === 'web'` branches.
- Use React Native components with Uniwind `className` styling; CSS files configure theme tokens and utilities, never DOM layouts.

## Design

Use HeroUI Native through the local `components/ui/` adapters with Uniwind `className` utilities. Follow `.agents/skills/use-ui-kit/SKILL.md`. Do not create a bespoke StyleSheet design system or import the web Radix/shadcn kit.

`components/ui/global.css` loads the styling system; `components/ui/theme.css` selects exactly one preset from `components/ui/themes/`. `calm` uses teal accent `oklch(0.45 0.08 190)` and 14px radius; `bold` uses violet `oklch(0.48 0.22 285)` and 16px radius; `structured` uses slate `oklch(0.208 0.042 265.755)` and 10px radius. Each preset carries contrasting light and dark values. Change the preset import after the person chooses a direction.

Use system fonts unless a requested font is loaded through installed Expo APIs. Use an installed icon component; emoji only when requested. Keep every HeroUI import and stylesheet inside `components/ui/`, including its provider, so replacing that directory can supply Uniwind-only Button, Card, Chip, and Sheet components. Application screens import only the local adapters. Keep both Expo Go and the dashboard's web preview usable.

## Verification

`bun run verify` type-checks and exports web, iOS, and Android bundles. All three must pass before handing off. The iOS and Android exports need no native toolchain.

## File map

- `app/_layout.tsx` owns the root navigation stack inside GestureHandlerRootView and the local UIProvider (HeroUINativeProvider).
- `components/ui/` owns the kit adapters, provider, stylesheet, and preset themes.
- `app/index.tsx` is the first screen; additional files below `app/` become routes.
- `scripts/dev.mjs` maps injected `PORT` and `HOST` to Expo CLI options.
- `app.json` owns Expo metadata; `wrangler.jsonc` publishes the `dist/` web export.
- `.expo/native-check` is the ignored iOS and Android verification output.

## Development server ownership

The runner owns and supervises `bun run dev`; never start, restart, or kill it yourself, even after a crash, because the runner restarts it automatically. Never delete build caches to un-stick a slow build. Verification builds may share CPU with the development server, so allow for slower completion.

## Rules

- Never edit `scripts/dev.mjs`, `EXPO_PACKAGER_PROXY_URL`, or `.dsh-template.json` `preview.port`.
- Never edit a generated lockfile by hand.
- Keep the web export static and do not fetch remote files during build.
- Keep scripts and exported JavaScript runnable through plain Bun or Node.
