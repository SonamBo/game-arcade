# STATE

**Read this first.** Rewritten at the end of every stage. If it disagrees with
anything else, it wins.

---

## Where we are

**Stage 01 · Shell and eleven components — VERIFIED (compiles + bundles).
Device visual pass still pending.**

`tsc --noEmit` is clean across all fourteen routes and eleven components, and
`expo export --platform android` bundles with exit 0. Built on **Expo SDK 57**,
Node 24.19.

Stage 00 is fully verified and committed (`cd9a8a7`); its three SDK-57 fixes are
recorded in DECISIONS. The rails-check screen has been deleted.

**Left to do on the device** (needs a phone + Expo Go, `npx expo start`):
- walk the five tabs and the pushed screens; confirm chrome matches the spec
- open `/gallery` and eyeball all eleven components in every state
- confirm Archivo renders, palette is right, tap targets feel ≥48px

### What stage 01 delivered
- **Chrome:** `TopBar`, `BackBar`, `MatchChrome`, and the five-tab bar (custom
  render prop in `app/(tabs)/_layout.tsx`, with the onboarding redirect gate).
- **Eleven §6 components** in `components/ui/`: PosterBand, EditorialRow,
  ShelfTile (+grid), IndexRow, StatStrip, GhostBand, LeaderboardRow, FeedPost,
  QueueRing, NotificationRow, ToastStrip — each with its listed states. Plus
  shared `primitives.tsx` (Button ×3 variants, rules, accent square/dot) and
  `Segmented`.
- **Fourteen routes:** onboarding; the five tabs (index/Home, feed, duels, shop,
  me); and pushed browse, game/[id], match/[id], results, drop, bracket,
  friend/[handle], inbox. Plus a dev-only `/gallery`.
- `data/samples.ts` — placeholder content (see DECISIONS D-010).

---

## Done

- Expo project config: `package.json`, `tsconfig.json` (with `@/*` paths),
  `babel.config.js`, `app.json`, `eas.json`, `.gitignore`
- `theme/tokens.ts` — colour, spacing, type roles transcribed from build brief
  §4 / UI spec §3. `MIN_TAP = 48`, `MIN_TEXT = 10`.
- `theme/type.ts` — `text()`, `kicker()`, `tappableRow()`, rules, screen ground.
  Numeric roles get `tabular-nums` automatically.
- `types/models.ts` — the data model from build brief §5, plus the ranking
  function, reason lines, coin formula, near-miss test and ghost tick. These
  live with the model because the shelf and the queue must use the same ones.
- `store/` — zustand + AsyncStorage persist, four slices (games, economy,
  social, session), `useHydrated()` gate. Partialize matches the spec's persist
  list exactly.
- `games/types.ts` — **the contract, draft.** Freezes at stage 04.
- `games/registry.ts` — deliberately empty, plus the `SIMULATED_RUNS_ENABLED`
  flag wired to `EXPO_PUBLIC_SIMULATED_GAMES` (set to "0" in the eas.json
  production profile, "1" in preview).
- `app/_layout.tsx` — gesture handler first import, Archivo loaded, store
  hydrated, daily reset and session start on boot.
- `app/index.tsx` — the rails-check screen. Deleted at stage 01.

## Not done

- No real games yet — `match/[id]` is a placeholder field that jumps to results.
  The run loop and STACK are stage 02.
- The nine engines do not exist — stage 04.
- `data/catalogue.ts` (forty real games) and `data/seed.ts` (23 friends) are
  stage 05 / 06; screens currently read `data/samples.ts`.
- Screens are wired with sample data and illustrative navigation; ranking,
  pinning persistence and the derived feed become real in stages 05–06.

---

## Known risks in what was just written

1. **`babel.config.js` may need one edit.** On newer Expo SDKs the reanimated
   babel plugin moved to `react-native-worklets/plugin`, or is included by
   `babel-preset-expo` and warns if listed. The file has a comment explaining
   both cases. If `expo start` complains, follow what it says.
2. **`package.json` pins nothing on purpose.** Versions come from
   `npm run setup`, which runs `expo install` and then `expo install --fix`, so
   every package lands SDK-correct rather than at a version guessed by a model
   with a May 2026 cutoff. **Commit the resolved `package.json` afterwards.**
3. **`GameInstance.score` is typed as `{ value: number }`**, not
   `SharedValue<number>`, because reanimated is not installed yet. Stage 02
   tightens it once the real type is available.
4. `newArchEnabled: true` is set in app.json. If the build fights it, flipping
   it off is a legitimate move — note it in DECISIONS.md if you do.

---

## Next action

- **You:** `npx expo start` from the repo root, scan the QR with Expo Go on an
  Android phone, and check the four things the rails screen proves — Archivo at
  every role, palette right, coins survive a force-quit, action rows tappable.
- **In progress:** stage 01 — the fourteen routes, four chrome variants and the
  eleven UI-spec §6 components. The rails screen (`app/index.tsx`) gets deleted
  as part of it.
