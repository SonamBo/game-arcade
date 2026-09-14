# STATE

**Read this first.** Rewritten at the end of every stage. If it disagrees with
anything else, it wins.

---

## Where we are

**Stage 02 · Run loop and STACK — VERIFIED (compiles + bundles). Device play
pass still pending.**

`tsc --noEmit` is clean and `expo export --platform android` bundles with exit
0, including the Reanimated worklets in `useRunLoop` and `StackGame`. Built on
**Expo SDK 57**, Node 24.19.

STACK is a real, playable game now: tap-to-drop, slicing, perfects, run
termination, a genuine `Run` record committed to the store, and best that
persists. Stages 00 and 01 are verified and committed (`cd9a8a7`, `a8f8b78`).

**Left to do on the device** (needs a phone + Expo Go, `npx expo start`):
- play STACK from the STACK detail screen → PLAY. Check it holds 60fps, the
  slice and perfect feel right, the run ends on a miss, results shows the real
  score, and the best survives a force-quit and relaunch.
- also still open from stage 01: walk the tabs/pushed screens and `/gallery`.

### What stage 02 delivered
- **`games/useRunLoop.ts`** — the shared frame clock (dt clamped 48ms), ghost
  ticker (`min(target, target·elapsed/16s)`), and run start/end lifecycle. Score
  is a shared value; the ghost mirrors to JS only when its integer changes.
- **`games/stack/StackGame.tsx`** — STACK against the §6 tuning: 140px block,
  190→430px/s, overlap slice, perfect inside 6px scores 2, end when overlap ≤ 6,
  last 11 blocks alternating ink/n800, active block accent, blackout-variant
  ground flip. Continuous slide runs in a worklet; placements are JS.
- **`store` `commitRun` + transient `lastRun`** — one call folds a finished run
  into progress/best, streak, coins and the session's distinct-games count.
- **`app/match/[id].tsx`** rewritten to host a real game (measures the field,
  mirrors score/ghost into `MatchChrome`, builds + commits the `Run`, goes to
  results). **`app/results.tsx`** now reads the real `lastRun`.
- **`games/registry.ts`** — `getGameComponent()`; STACK registered.
- **contract** (`games/types.ts`) — `score` tightened to `SharedValue<number>`;
  added `GameScreenProps` / `GameComponent`. Still freezes at stage 04.

### From stage 01 (unchanged, still on device to-do)
Chrome (TopBar/BackBar/MatchChrome/tab bar), the eleven §6 components, the
fourteen routes, `/gallery`, and `data/samples.ts` placeholder content.

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

- STACK is the only real game. REFLEX and DODGE (and the nine engines they need)
  are stage 04; other ids show a placeholder in the match screen.
- The auto-queue ring on results is still static: no live 3s countdown, no real
  next-ranked game, no retry-at-carried-score economy. That is **stage 03**.
- `data/catalogue.ts` (forty real games) and `data/seed.ts` (23 friends) are
  stage 05 / 06; screens currently read `data/samples.ts`, so the rival/ghost on
  the match header and results is sample-derived, not yet a real rival.
- Ranking, pinning persistence and the derived feed become real in stages 05–06.

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
