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
*Open:* flagged to Sonu, not yet confirmed.

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
