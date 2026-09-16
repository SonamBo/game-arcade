# DECISIONS

Every call and why, including the ones that override a spec document. Append,
never rewrite. A later session that disagrees should add an entry, not delete
one.

---

### D-001 · Hybrid game architecture: engines plus bespoke
**Stage 00.** The build brief implies one hand-written component per game. That
does not survive fifty. A game instead names one of nine archetype engines and
supplies config; only hero games are bespoke. Nine engines cover all forty
games in the prototype catalogue.
*Consequence:* the contract in `games/types.ts` is load-bearing and freezes at
stage 04.

### D-002 · Expo / React Native, no Capacitor wrapper
**Stage 00.** Per the build brief §1. The Capacitor path was considered and
rejected: it produces a demo APK fast but the touch latency is visible in
DODGE, and the loop is the thing being tested.

### D-003 · Simulated runs are compiled out, not toggled
**Stage 00.** The brief has 37 of 40 games faking a four-second run. That is
sound for internal loop testing and not sound to put in front of a person — a
score someone did not earn, posted to a feed as if they had, is a trust
problem. `SIMULATED_RUNS_ENABLED` reads `EXPO_PUBLIC_SIMULATED_GAMES`, which
`eas.json` sets to "1" in the preview profile and "0" in production.
*Consequence:* a production build physically cannot show a fabricated score.

### D-004 · Ranking and economy live in `types/models.ts`
**Stage 00.** `rankScore`, `reasonLine`, `coinsFor`, `isNearMiss` and
`ghostDisplayed` sit with the data model rather than in a screen. The brief
says ranking is implemented once and used by both the shelf and the queue; the
easiest way to guarantee that is to give it nowhere else to live.

### D-005 · The in-flight session is not persisted
**Stage 00.** The brief lists session history as persisted. The *current*
session is not, because an app that was killed did not have its session
continue — persisting it would inflate distinct-games-per-session, which is one
of the two numbers the product is judged on.

### D-006 · No version pins in `package.json`
**Stage 00.** Written by a session with a May 2026 knowledge cutoff and no npm
access, so any pinned version would be a guess. `npm run setup` runs
`expo install` then `expo install --fix`, which resolves everything against the
installed SDK. The resolved file should be committed.

### D-007 · DODGE is button-first, swipe additive
**Stage 00.** The build brief calls DODGE "swipe plus buttons"; UI spec §7
lists its input as two lane buttons plus arrow keys, with no swipe, and §05
describes only the button strip. The UI spec wins by its own stated rule.
*Confirmed by Sonu, stage 02: build buttons first, swipe is an optional extra.*

### D-009 · Tab bar is custom, typed against a local prop shape
**Stage 01.** The five-tab bar is a custom `tabBar` render prop on expo-router's
`Tabs`, not the default bar — the spec's flush-left labels and accent-rule-on-top
active state need it. `@react-navigation/bottom-tabs` does not resolve as a
direct type import under Expo Router v6, so the render props are typed against a
minimal local `TabBarShape` covering only what we read.

### D-010 · Stage 01 renders sample data, not the catalogue
**Stage 01.** `data/samples.ts` holds a handful of hand-written games, friends,
duels, feed posts and notifications so the eleven components and fourteen
screens render faithfully. It is clearly marked placeholder and is superseded by
`data/catalogue.ts` (stage 05) and `data/seed.ts` (stage 06). No screen assumes
these rows are real.

### D-011 · The queue ring is a real circle
**Stage 01.** The zero-radius rule is about rectangles; the §06 auto-queue ring
is a genuine countdown dial, so `QueueRing` uses a circular border. The conic
sweep and live countdown animate in stage 03, driven by the run loop.

### D-012 · react-native-svg for the auto-queue ring
**Stage 03.** The §06d ring is a conic countdown dial, which RN cannot draw
without SVG or Skia. Added `react-native-svg` (15.15.4) — lighter than Skia and
enough for an animated arc (a Reanimated-driven `strokeDashoffset`). Skia is
still held in reserve for a game that needs curves or particles (per the brief).

### D-013 · QueueRing owns its own countdown; cancel is ref-guarded
**Stage 03.** The acceptance test names "a cancel that always works", so the
countdown, the completion callback and the cancel all live in one component with
a single `doneRef` latch: whichever of cancel/complete fires first wins, and the
Reanimated sweep's finish callback is ignored once cancelled. This is the one
behaviour worth centralising rather than spreading across the screen.

### D-014 · Instrumentation buffers until a destination is chosen
**Stage 03.** `lib/analytics.ts` implements the seven §10 events with their
properties and fires them from the match and results screens. The sink is a
dev-console + in-memory buffer; swapping in PostHog/Amplitude/own endpoint is a
one-function change. Blocks nothing, but the destination is still **open
question 7**.

### D-015 · Component-based engine model (contract frozen)
**Stage 04.** The contract froze on a component model, not the earlier
`GameInstance { onFrame/onInput }` sketch. An engine is a React component that
takes `GameScreenProps & { config }` and runs its own `useRunLoop` internally
(as STACK already did). Reason: RN geometric games render very differently per
archetype (a needle vs falling lanes vs targets), so a generic
render-a-GameInstance host would have been a fiction. A game is either bespoke
(ships a component) or engine+config. The match host renders both identically.

### D-016 · Three engines now, not nine
**Stage 04.** The plan said "all nine engines". Building five engines that have
no real games yet would violate the plan's own hazard #1 ("build against real
games; expect one to be wrong"). So stage 04 ships the framework plus the three
engines the real/near-term games exercise — needle-band (REFLEX, SNAP),
lane-runner (DODGE, GLIDE), target-tap (AIM) — covering 21 of 40 catalogue slots.
The other five (orbit-timing, grid-merge, number-pick, memory-recall, trace-path)
are added in stage-09 batches when their games are built; the framework makes
each a drop-in. A game whose engine is absent resolves to unplayable and shows
the placeholder — never a crash.

### D-017 · Worklets never reference the run loop object
**Stage 04.** A Reanimated worklet captures its closure when it is *created*, so
a frame worklet that referenced the not-yet-returned `loop` object captured
`undefined`. Rule going forward: a game's `onFrame` worklet touches only shared
values created before it (lane-runner uses an `over` shared value for collision
stop and computes score from `distance`, never `loop.score`). Documented so the
five future engines don't rediscover it.

### D-018 · v2 "Arcade Gallery" reskin on a branch
**Reskin (branch `redesign-2a`).** The v2 UI spec (Claude Design, direction 2a
"Arcade Gallery") is a **skin**: Source Serif 4 throughout, paper/ink neutrals,
cyan = actionable, magenta = a rival who passed you, games lead with art plates,
no rules (space separates bands), small non-zero radius + subtle shadows. Every
route, all state, ranking, economy and game rules are untouched — only
`theme/`, `components/` and screen presentation change. Done on a branch so
`main` (and its working APK CI) stays stable until reviewed, then merges.

### D-019 · Five family plates, not four
**Reskin.** The spec names four archetype plates (tower/timing/runner/precision);
the catalogue groups games by five Families (TAP/SWIPE/TIMING/NUMBERS/MEMORY).
Mapped all five to neutral PLATE shades + five SVG family marks
(`theme/plates.ts`, `components/ui/icons.tsx`) so every game has a plate. No
colour ever lands on a plate, per the direction.

### D-020 · Tab bar drops to four; Shop moves to the top bar
**Reskin (§5.8).** Tabs are Home · Duels · Feed · Me. Shop is still a route but
is reached from the coins pill in the top bar (`href: null` hides it from the
bar). Routing is unchanged — only its presentation as a tab.

### D-021 · Button variant names kept as aliases
**Reskin.** §8 says keep prop signatures. Button's new looks are primary /
secondary / ghost, but the old `accent`/`inverse`/`outlined` values still work
(accent→primary, outlined→secondary, inverse→primary), so no caller changed its
variant string. Icons/plates are additive optional props on IndexRow, FeedPost,
QueueRing, PosterBand — also non-breaking.

### D-008 · The rails screen is disposable
**Stage 00.** `app/index.tsx` is a diagnostic, not a product screen, and stage
01 deletes it. It is written in the product's visual grammar anyway so that a
token mistake is visible immediately rather than at stage 05.

---

## Recommended, awaiting confirmation

These are the UI spec §11 open items. The plan carries a recommendation for
each; none is implemented yet.

| # | Item | Recommendation | Stage |
|---|---|---|---|
| 1 | Mid-run revive | Cut for v1 — nothing should interrupt a run | 07 |
| 2 | Comment composition | Reactions only in v1 | 06 |
| 3 | Search behaviour | Name + family + mechanic keywords, not fuzzy-name | 05 |
| 4 | Squad screens | Defer to the real backend | 06 |
| 5 | Notification permission | After first duel win, on that results screen | 07 |
| 6 | Dark mode | Not in v1, never automatic | Post-launch |
