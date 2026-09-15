# Game Arcade — Build Plan v1

Android app. Expo / React Native / EAS. Forty games at launch, fifty-plus by the final
iteration. This file is the source of truth for sequencing; `docs/STATE.md` is the source
of truth for where we currently are.

---

## Locked decisions

| Decision | Choice |
|---|---|
| Game architecture | Hybrid — reusable archetype engines + bespoke modules for hero games |
| Stack | Expo / React Native / EAS, as per the build brief. No Capacitor, no web build |
| Simulated games | Internal testing only. Compiled out of any build a real player touches |
| Authorship | Claude builds engines, contract, scaffold and the first ~10 games; the tail is config anyone can add |

---

## The multiplier: nine engines cover forty games

A game declares which engine runs it and supplies numbers. It does not ship a component.

| Engine | Games | n |
|---|---|---|
| `lane-runner` | DODGE LANES TILT DRIFT GLIDE ZIP BLOCK | 7 |
| `target-tap` | AIM CATCH RUSH TAPS JUMP CLIMB DASH | 7 |
| `memory-recall` | FLIP MATCH GRID ECHO CHAIN PATH | 6 |
| `needle-band` | REFLEX SNAP HOLD PULSE BOUNCE | 5 |
| `orbit-timing` | ORBIT LOOP PIVOT WAVE SPIN | 5 |
| `grid-merge` | MERGE FUSE SHIFT SPLIT | 4 |
| `number-pick` | COUNT SORT SWAP | 3 |
| `trace-path` | TRACE SLICE | 2 |
| `stacker` | STACK (bespoke) | 1 |
| | **total** | **40** |

### The contract (frozen at stage 04)

```ts
// games/types.ts
interface GameModule<Cfg> {
  meta:   { id; name; code; family; unit; lowerIsBetter; blurb };
  engine: EngineId | 'bespoke';
  config: Cfg;                              // archetype games stop here
  create?(ctx: RunContext): GameInstance;   // bespoke only
}

interface GameInstance {
  onFrame(dt: number): void;   // worklet, UI thread, dt clamped to 48ms
  onInput(e: InputEvent): void;
  score: SharedValue<number>;
  isOver(): boolean;
}
```

`RunContext` provides haptics, ghost, coins and `end()`. A game never touches the store,
the feed, the wallet or a screen.

### Adding a game after stage 04

```
npm run new-game
```

Prompts for name, code, family, unit and engine. Writes `games/catalogue/<id>.ts` and
registers it. Edit numbers, reload, play. One file. No app code touched.

---

## Stages

Each stage ends with a build that installs on a phone, plus a commit and an updated
`docs/STATE.md`. A session that dies mid-stage costs one stage, never the project.

**00 · Rails** — Expo + TS scaffold, expo-router, `theme/tokens.ts` transcribed exactly,
Archivo loaded, zustand + AsyncStorage persistence, folder structure, `docs/`.
*Done when:* blank tokenized screen boots on device; a counter survives force-quit.

**01 · Shell and the eleven components** — fourteen routes plus the four chrome variants.
Then UI spec §6's eleven components built once with every listed state: poster band,
editorial game row, shelf tile, index row, stat strip, ghost band, leaderboard row, feed
post, queue ring, notification row, toast strip. 48px minimum interactive height, 10px
kicker floor (the two production corrections the prototype breaks).
*Done when:* fourteen routes reachable, and a components gallery route renders all eleven
in every state in §6. Later stages compose; they do not invent new patterns.

**02 · Run loop and STACK** — `useRunLoop` (frame clock, ghost ticker, termination,
haptics). STACK bespoke against it with the §6 tuning. Produces a real `Run` record.
*Done when:* tap-to-drop at 60fps, slicing and perfects correct, best persists cold start.

**03 · Results, queue, wallet** — 72px banner, three-cell strip, near-miss band inside
18%, three-second ring with a cancel that always works, coin award, three free retries
then 50 coins, retry resuming at the score reached.
*Done when:* run ends to next run begins unattended in 3s; cancel never fails.

**04 · Engines and the scaffold** — the engine framework, config schema,
`npm run new-game`, `games/README.md`. REFLEX and DODGE rebuilt as pure configs. **Contract
freezes here.** *Revised (see DECISIONS D-016): ships three engines — needle-band,
lane-runner, target-tap — covering 21 of 40 slots; the other five engines are stage-09
batches, built when their games exist (hazard #1). The framework makes each a drop-in.*
*Done when:* REFLEX and DODGE play from config alone; a new game adds in one file. ✓

**05 · Catalogue, shelf, browse** ✓ — forty games as data, one ranking function used by
both shelf and queue, reason lines on top three only, drop poster, family filters,
search, long-press pinning capped at twelve with the refusal toast.
*Done when:* a fresh install shows a named global rival and a reason line on every top-three row.

**06 · Social layer** ✓ — 23 deterministic seeded friends, derived feed, duels with real
ghost scores, friend profiles with head-to-head, inbox actions that launch runs. All
behind one network-shaped interface so the server swap is a module replacement.
*Done when:* every finished run generates its post; the callout reply lands minutes later.

**07 · Meta and polish** — wallet and shop, streaks, five daily quests, season ladder,
daily variant rotation at local midnight, offline queueing, haptics pass, instrumentation.
*Done when:* all six build-brief acceptance tests pass on a mid-range Android phone.

**08 · APK and testers** — EAS preview profile (APK) and production profile (AAB),
Play Internal Testing, side-load instructions, tester note.
*Done when:* fifty testers can install from a link; queue acceptance rate is readable.

**09+ · Game batches — repeat forever** — six to ten games per pass: pick from the
catalogue, write configs, tune the curve, play each one, ship. Never touches the shell.
*Done when (each batch):* every new game playable, tuned, posting real runs.

---

## Continuity files

| File | Purpose |
|---|---|
| `docs/PLAN.md` | This document. Stage list and deliverables. |
| `docs/STATE.md` | Rewritten every stage: done / half-done / exact next action / what is broken. **First file a new session reads.** |
| `docs/DECISIONS.md` | Every call and why, including overrides of the spec. Stops re-litigation. |
| `games/README.md` | Game-authoring guide: contract, per-engine config options, tuning checklist. |

---

## Known hazards

1. **Engines designed before enough games exist.** Nine engines drawn from a list of
   names is a guess. Expect one to be wrong and get rewritten around game fifteen.
2. **Forty games of geometry look identical.** Distinctiveness must be deliberate:
   per-game palette rules inside the ink/accent system, different failure animations,
   different score units. Needs a named pass in stage 09.
3. **Reanimated worklets at 60fps on mid-range Android.** Least certain for DODGE with
   many obstacles. If profiling in stage 04 says otherwise, Skia goes in behind the same
   contract — which is why the contract exists.
4. **Thursday drops versus store review.** A weekly cadence through review will not hold.
   Needs expo-updates from stage 08, catalogue and configs shipped over the air.

---

## Settled by the full UI spec

- **Eleven components cover all fourteen screens (§6).** Changes stage 01: build the
  inventory, not per-screen variants. Seven of the eleven appear on three or more screens.
- **The event list is fully specified (§10).** Seven events with properties, down to
  `ended_by` distinguishing a queue cancel from a backgrounded app. Only the destination
  is open.
- **Geometry only, for every game (§7).** Stated as a system rule, not a launch
  constraint: ink on ground, active piece is the only accent element, no sprites, no
  particles, no illustration. Holds for all fifty; the engines stay small.

**One conflict:** the build brief lists DODGE as swipe plus buttons; UI spec §7 lists two
lane buttons plus arrow keys with no swipe, and §05 describes only the button strip. The
UI spec wins by its own rule — building buttons, treating swipe as additive. Confirm.

---

## Six decisions the spec leaves open (§11)

| # | Decision | Recommendation | Stage |
|---|---|---|---|
| 1 | Mid-run revive | **Cut for v1.** A revive overlay is the one thing that interrupts a run; the product argument is that nothing does. Sell the retry, which already works. | 07 |
| 2 | Comment composition | **Reactions only in v1.** Needs moderation, and a simulated social layer cannot honestly host real replies. | 06 |
| 3 | Search behaviour | **Name + family + mechanic keywords.** Fuzzy-name is adequate at forty and useless at fifty-plus. Volume is the pitch, so search is thesis infrastructure. | 05 |
| 4 | Squad screens | **Defer to the real backend.** A co-op target among seeded friends is the least defensible thing to simulate. Keep the profile block, drop the inbox entry. | 06 |
| 5 | Notification permission | **After the first duel win, as the spec says** — placed on that win's results screen as one line, not a modal. | 07 |
| 6 | Dark mode | **Not in v1, never automatic.** The accent's four reserved jobs and ink-on-ground geometry need a deliberate inversion, not a token swap. | Post-launch |

---

## Open questions

1. Expo account available? Is iOS in scope at all?
2. Which specific phone are the acceptance tests run on?
3. Over-the-air updates for new games, or store releases only?
4. Is the forty-game catalogue final, and who invents games 41–50? (TILT, RUSH, CHAIN
   have no stated mechanic anywhere.)
5. When does the real backend arrive, and on what (Supabase / Firebase / own server)?
6. Any real money in the plan — IAP or ads in v2?
7. Where do instrumentation events go (PostHog / Amplitude / own endpoint)? §10 specifies
   the events exactly; only the destination is missing.
8. How should code reach you — direct writes to this folder, a zip, or a GitHub repo?
   Git is what makes "resume from stage 05" actually true.

*Nothing here blocks stage 00.*
