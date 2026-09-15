# STATE

**Read this first.** Rewritten at the end of every stage. If it disagrees with
anything else, it wins.

---

## Where we are

**Stage 07 · Meta and polish — VERIFIED (compiles + bundles). Device
acceptance pass is the remaining gate.**

`tsc --noEmit` is clean and `expo export --platform android` bundles with exit
0. Built on **Expo SDK 57**, Node 24.19.

All the meta systems are in: daily variant rotation (2× coins), five daily
quests with claim, a functional shop (coins really spent, power-ups with real
effects), a season ladder derived from lifetime play, the OFFLINE · SYNCING
label, a haptics pass, and session instrumentation on background. Stages 00–06
are verified and committed.

This is the last **build** stage. What remains is the on-device acceptance pass
(the six tests below) and then stage 08 (APK/EAS packaging).

### The six acceptance tests (build brief §9) — verify on a mid-range phone
1. Cold start → first tap under 8s incl. onboarding. *(Boot does no heavy work;
   onboarding is one screen. Time it.)*
2. Run ends → next run begins unattended in 3s, cancel always works. *(Stage 03;
   the ring is ref-guarded.)*
3. Five consecutive queued DODGE runs, no dropped frame. *(Pooled worklet; this
   is the one to watch closely.)*
4. Kill mid-session, relaunch: coins, bests, streak, pins, retry count intact.
   *(All in the persist partialize; quests + powerups now persisted too.)*
5. Airplane mode: every playable game still plays; results/coins/feed appear.
   *(Everything is local; OFFLINE · SYNCING shows in the top bar.)*
6. Fresh install: named rival + populated global feed + reason line on every
   top-three row. *(Stages 05–06; deterministic seed.)*

Report any that fail; those are the stage-07 fixes.

### What stage 07 delivered
- **`data/variant.ts`** — deterministic daily variant rotating at local
  midnight, 2× coins; wired into the home + drop posters and the match screen
  (`?variant=1` → `variant` prop + `Run.variant`, so STACK blackout turns on and
  the coin award doubles).
- **`data/quests.ts` + economy slice** — five daily quests with per-day counters
  (runs, distinct, bests, ghosts, variant-cleared), `claimQuest`, reset at local
  midnight, surfaced on Me with claim buttons. Quests + power-ups now persisted.
- **shop** — `buyPowerUp` spends real coins (extra retry / ghost scout / streak
  freeze with real effects); TOP UP disabled (no payments backend, v1).
- **season ladder** — a real tier derived from lifetime play, shown on Me.
- **`lib/useOnline.ts`** + TopBar **OFFLINE · SYNCING** label (expo-network).
- **haptics pass** — success on a personal best, light on pin, error on refusal.
- **instrumentation** — the `session` event fires on app background with
  distinct-games count; `dailyReset`/`beginSession` re-run on foreground.

### What stage 06 delivered
- **`data/friends.ts`** — 23 deterministic friends, per-(friend,game) bests,
  seeded head-to-head, mutuals, presence, and the seeded feed/global activity.
- **`store/slices/social.ts`** — the write side: `runPosts` + revealed
  `replies` (transient), `onRunCommitted(run)` generating the player's post and
  scheduling the rival callout on `REPLY_DELAY_MS` (90s). `commitRun` calls it.
- **`data/social.ts`** — the network-shaped read side: `buildFeed`, `buildDuels`,
  `buildInbox`, `friendProfile`. Screens call these, never the seed directly, so
  a server swap replaces this file and leaves the screens untouched.
- feed/duels/friend/inbox screens rewired off `data/samples.ts` onto the layer.
  (samples.ts now only backs the game-detail leaderboard + drop poster.)

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
