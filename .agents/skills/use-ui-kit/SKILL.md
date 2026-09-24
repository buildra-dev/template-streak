---
name: use-ui-kit
description: Build Expo screens with the local HeroUI Native adapters, Uniwind className styling, and calm, bold, or structured theme presets.
---

# Use the native UI kit

Read Design in `AGENTS.md`. Import the local components from `components/ui`, never directly from `heroui-native` in a route. This directory owns the provider and stylesheet as well as the component adapters, so a web-compatible fallback can replace it without rewriting application screens.

| Job | Local component | Native implementation |
| --- | --- | --- |
| Primary action | Button | HeroUI Button and Button.Label; use onPress and disabled |
| Grouped content | Card | HeroUI Card, Card.Title, and Card.Description |
| Short status or category | Chip | HeroUI Chip and Chip.Label |
| Supporting panel | Sheet | React Native Modal with a kit Card and close Button |

Compose layouts with React Native View and Text using Uniwind `className`, such as `flex-1 bg-background p-6` and `text-foreground`. Keep colors semantic and theme values in CSS; do not build a bespoke StyleSheet design system. For a control not yet wrapped, add its adapter inside `components/ui/` first and keep its public props usable on web, iOS, and Android. Use native TextInput for simple entry until a validated kit adapter is available. Preserve accessible labels, pressed/disabled states, safe-area spacing, and touch targets at least 44 points tall.

## Switch themes

Change the single import in `components/ui/theme.css` to `./themes/calm.css`, `./themes/bold.css`, or `./themes/structured.css`. Each file supplies light and dark background, foreground, surface, accent, accent-foreground, and radius tokens. Use the same tokens and component look in the three direction artboards; inline their CSS values and keep the artboard limits from the Buildra workflow. Use system fonts until a requested font is loaded through installed Expo APIs.

## Provider and platform checks

`app/_layout.tsx` imports the local stylesheet and wraps navigation in GestureHandlerRootView with flex 1, then UIProvider. UIProvider owns HeroUINativeProvider. Metro uses Uniwind's withUniwindConfig; the Expo SDK 57 Babel preset supplies the installed Worklets transform.

The dashboard preview and published output use react-native-web. HeroUI Native is not recommended for web; inspect the real web preview as well as Expo Go before adding more kit integrations. If web rendering fails, replace only `components/ui/` with Uniwind-styled React Native primitives, preserve the exported Button/Card/Chip/Sheet props and UIProvider, and remove the HeroUI style import in that directory's global.css. A later dependency cleanup can remove unused packages.

Run the unchanged `bun run verify` for TypeScript plus web, iOS, and Android exports. Do not run expo prebuild, create native project directories, or modify the runner-owned dev script, proxy URL, or preview port.
