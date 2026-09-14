# STATE

**Read this first.** Rewritten at the end of every stage. If it disagrees with
anything else, it wins.

---

## Where we are

**Stage 05 · Catalogue, shelf, browse — VERIFIED (compiles + bundles). Device
pass still pending.**

`tsc --noEmit` is clean and `expo export --platform android` bundles with exit
0. Built on **Expo SDK 57**, Node 24.19.

All forty games exist as data now, the home shelf is ranked by the shared
ranking path (the same one the auto-queue uses), Browse lists all forty with
family filters + keyword search + real long-press pinning capped at twelve, and
a fresh install shows a named GLOBAL RIVAL and a reason line on every top-three
row. Stages 00–04 are verified and committed.

**Left to do on the device** (needs a phone + Expo Go, `npx expo start`):
- fresh install → onboarding picks 3, shelf fills to 12; check reason lines on
  the top three and that Browse shows 40 with working filter/search.
- long-press to pin/unpin; pin a 13th → "SHELF FULL — UNPIN ONE FIRST" toast.
- the six playable games (STACK, REFLEX, DODGE, SNAP, AIM, GLIDE); non-playable
  games open a detail screen with a named rival and a "coming soon" play button.
- carried over: 60fps on DODGE/GLIDE, the live auto-queue, near-miss retry.

### What stage 05 delivered
- **`data/catalogue.ts`** — all forty games as metadata. Playable games source
  their meta from their module (one source of truth); the other 34 are inline
  until their engines land. `metaFor`, `GAMES`, `ORDER`, `GAME_COUNT`.
- **`data/seed.ts`** — deterministic cold-start: `friendsOn`, one named
  `globalRivalFor` per game, baselines, and `rankInputs` / `rankedGames` /
  `nextQueued` — the single ranking path used by **both** the shelf and the
  queue. Full social layer (23 friends, feed, head-to-head) is still stage 06.
- **home** ranks the pinned shelf (top 3 editorial + reason lines, next 9 grid,
  BROWSE N MORE); **browse** lists all forty (family filter, keyword search,
  numbered index, real pin toggle + refusal toast); **onboarding** fills to 12
  by popularity; **results queue**, **game detail**, **match** now read
  catalogue meta + the seeded rival, so all forty have a rival and a ghost.
- Feed/duels/me/friend/inbox still read `data/samples.ts` (stage 06).

### What stage 04 delivered
- **Contract frozen** (`games/types.ts`), component model: bespoke `Component`
  or engine + `config`; both satisfy `GameScreenProps` (D-015).
- **Three engines** in `games/engines/`: needle-band, lane-runner (pooled
  obstacles on the UI thread, button-first), target-tap. Five more engines are
  stage-09 batches (D-016).
- **`games/catalogue/`** — one file per game: stack (bespoke), reflex, dodge,
  snap, aim, glide. `index.ts` is the manifest.
- **`games/registry.tsx`** resolves id → component (+ config) and meta;
  unbuilt-engine games resolve to unplayable → placeholder, never a crash.
- **`npm run new-game`** (`scripts/new-game.mjs`) — writes one catalogue file
  from engine defaults and registers it. **`games/README.md`** authoring guide.
- match/game screens now read unit/lowerIsBetter/name/blurb from registry meta.

### Contract freeze note
`games/types.ts` is frozen. Adding a game must not require editing it. Adding an
engine appends to `games/engines/index.ts` only. If something forces a contract
change, that is a real event — record it in DECISIONS with the reason.

### What stage 03 delivered
- **`components/ui/QueueRing.tsx`** rebuilt: an SVG progress ring with a
  Reanimated sweep, a live digit, and a self-owned three-second countdown.
  Cancel is ref-guarded so it always wins (D-013). `autoStart`/`startCancelled`
  props keep the gallery static.
- **`app/results.tsx`** — real next-ranked game via `compareRank` + `nextInQueue`
  (the same ranking the shelf will use), the live auto-queue, and the near-miss
  retry economy: free ×3/day then 50 coins, a short balance routes to Shop, and
  a retry resumes at the score reached.
- **carried score** threaded through `GameScreenProps` → `StackGame` → `match`
  (`?carry=<score>`), so a retry starts where the near-miss ended. `Run.carriedFrom`
  records it.
- **`lib/analytics.ts`** — the seven §10 events, fired from match and results.
  Dev-console sink for now (D-014); destination is open question 7.
- react-native-svg 15.15.4 added (D-012).

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
