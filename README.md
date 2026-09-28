# Mv Prayer App

<p align="center">
  <img src="assets/images/icon.png" width="128" alt="Mv Prayer App icon" />
</p>

Offline prayer times for the Maldives, island by island. Built with Expo, HeroUI Native, and Uniwind.

The app reads a bundled SQLite database of prayer schedules and shows the times for the selected island. It defaults to Malé and works entirely offline.

## Features

- **Island schedules** — prayer times for 205 islands, selectable from a bottom sheet sorted by atoll
- **Next prayer countdown** — a live card counting down to the upcoming prayer
- **7-day strip** — browse the surrounding week, with a shortcut back to today
- **Sunrise and sunset** alongside the five daily prayers
- **Upcoming prayer highlighted** in the schedule list
- **Offline by default** — the schedule ships in `assets/db/salat.db`, no network calls
- **Light appearance throughout**

## Tech stack

- [Expo](https://expo.dev) SDK 57, React Native 0.86, React 19
- [Expo Router](https://docs.expo.dev/router/introduction) (stack + typed routes)
- [HeroUI Native](https://heroui.com/docs/native) and [Uniwind](https://docs.uniwind.dev) (Tailwind CSS v4 for React Native)
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) for the bundled database
- [dayjs](https://day.js.org), [@gorhom/bottom-sheet](https://gorhom.github.io/react-native-bottom-sheet/), [react-native-svg](https://github.com/software-mansion/react-native-svg), [lucide-react-native](https://lucide.dev)
- TypeScript (strict), React Compiler, ESLint + Prettier, pnpm

## Requirements

- Node.js 20+
- pnpm 10+
- **Android builds:** Android SDK and a JDK between **17 and 21** (JDK 24+ fails the Android Gradle Plugin prefab step)
- **iOS builds:** macOS with Xcode (no iOS release is published yet)

## Getting started

```bash
pnpm install
pnpm start
```

Then press `a` for Android, `i` for iOS, or scan the QR code with a development build. To launch straight into Android, use `pnpm android`.

## Scripts

| Script                              | Description                     |
| ----------------------------------- | ------------------------------- |
| `pnpm start`                        | Start the Expo dev server       |
| `pnpm android` / `pnpm ios`         | Start and open on Android / iOS |
| `pnpm lint` / `pnpm lint:fix`       | Run ESLint                      |
| `pnpm format` / `pnpm format:check` | Run Prettier                    |
| `pnpm typecheck`                    | Type-check with `tsc --noEmit`  |

## Project structure

```
src/
  app/            Expo Router screens (index + root layout)
  components/     UI: island picker, next-prayer card, day strip, prayer list
  lib/            Database queries and prayer-time helpers
  providers/      Island/selection context and live clock
assets/
  db/salat.db     Bundled prayer-time database (~1 MB)
  images/         App icon source and generated PNGs
```

## Prayer times data

The app bundles `assets/db/salat.db`, built from [Rashnan/mv-prayer-db](https://github.com/Rashnan/mv-prayer-db) at commit `87a12e632a73272d61d6e902da6b1b37b5436aeb`.

- `Island` holds each island's `CategoryId`, `Atoll`, name, coordinates, and a `Minutes` offset.
- `PrayerTimes` stores one row per category and `MonthDay` (`MM-DD`), with each time as **minutes after midnight**. A single schedule per month/day is reused across years.
- `Category` groups islands that share a schedule.

The home screen looks up the selected island's schedule, adds the island's `Minutes` offset, and formats the times locally. The default island is Malé (`IslandId = 102`).

## Building an Android APK

The native `android/` folder is generated and gitignored, so create it first:

```bash
npx expo prebuild --platform android
cd android
JAVA_HOME=/path/to/jdk-21 ./gradlew assembleRelease
```

The APK is written to `android/app/build/outputs/apk/release/app-release.apk` (universal, all four ABIs).

> The `release` build type is currently signed with the debug keystore (see `android/app/build.gradle`). Configure a production keystore before distributing outside GitHub Releases.

## Releases

Large binaries are not committed to git. `releases/*.apk` is gitignored, and built APKs are attached to [GitHub Releases](https://github.com/Rashnan/mv-prayer-app/releases) instead.

## App icon

`assets/images/prayer-icon.svg` is the source of truth. The PNGs used by Expo are generated from it:

| File                | Size      | Notes                                            |
| ------------------- | --------- | ------------------------------------------------ |
| `icon.png`          | 1024x1024 | Full icon with rounded background                |
| `adaptive-icon.png` | 1024x1024 | Android foreground only (transparent background) |
| `splash-icon.png`   | 1024x1024 | Splash foreground only                           |
| `favicon.png`       | 48x48     | Web favicon                                      |

The artwork is symmetric about its centre, with the crescent centred horizontally.
