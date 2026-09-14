# Adding a game

A game is **one file** in `games/catalogue/`, registered in
`games/catalogue/index.ts`. It never touches the store, a screen, or the run
loop. This is the whole reason game #50 costs what game #12 cost.

```bash
npm run new-game -- --name GLIDE --code GLD --family SWIPE --unit m --engine lane-runner
# or just: npm run new-game   (it will prompt)
npx tsc --noEmit
npx expo start
```

That writes `games/catalogue/glide.ts` from the engine's defaults and adds it to
the manifest. Then you open the file and change numbers until it feels right.

---

## The contract (frozen — `games/types.ts`)

Every game satisfies `GameScreenProps`: it is handed the field size, the ghost
target, and callbacks, and it reports back a live score, a live ghost, and one
`onEnd(score)`. Two kinds of game:

- **bespoke** — ships its own component (only STACK). `{ meta, engine: 'bespoke', Component }`
- **engine** — config for a shared engine. `{ meta, engine: '<id>', config }`

Three rules the freeze protects:

1. a game never imports the store, the feed, the wallet or a screen
2. a game never decides what happens after the run ends — it reports its score;
   the app assigns meaning (best, coins, feed, queue)
3. adding a game touches exactly one file

`meta` carries `unit` and `lowerIsBetter` — the match screen and results read
these, so a ms-timing game (lower is better) and a distance game (higher is
better) both behave correctly with no per-game code.

---

## The engines

Three of the nine archetypes are implemented. The rest arrive in stage-09
batches, when there are real games to validate them against. A game whose engine
is not built yet is written fine and shows a placeholder until the engine lands.

### `needle-band` — sweeping needle, shrinking band
*REFLEX, SNAP, HOLD, PULSE, BOUNCE.* Tap when the needle crosses the accent band.

| field | meaning |
|---|---|
| `speed0`, `speedStep` | sweep units/s, and the per-round increase |
| `centerMin`, `centerMax` | random band-centre range (0–100 track units) |
| `width0`, `widthStep`, `widthFloor` | band width: start, shrink/round, floor |
| `maxRounds`, `maxMisses` | run ends at either |
| `msBase`, `msPerOff` | reported reaction = msBase + offset·msPerOff |
| `scoreMode` | `'best-ms'` (lower is better) or `'count'` (higher is better) |

Set `meta.lowerIsBetter` to match `scoreMode`.

### `lane-runner` — dodge falling blocks
*DODGE, LANES, TILT, DRIFT, GLIDE, ZIP, BLOCK.* Button-first lane control.

| field | meaning |
|---|---|
| `lanes` | how many lanes (3 for DODGE) |
| `speed0`, `accel` | distance units/s, and compounding factor |
| `spawnMax`, `spawnMin`, `spawnDistScale` | spawn interval eases from max to min |
| `fallBase`, `fallDistScale` | fall speed = fallBase + distance/fallDistScale |
| `obstacleH`, `playerBottom` | obstacle height, player gap above the bottom |
| `scoreScale` | score = floor(distance · scoreScale) |

Higher is better; `unit` is usually `m`.

### `target-tap` — hit targets before they vanish
*AIM, CATCH, RUSH, TAPS, JUMP, CLIMB, DASH.* Tap squares before they expire.

| field | meaning |
|---|---|
| `spawnEvery0`, `spawnEveryMin`, `spawnAccelPerHit` | spawn cadence, tightening per hit |
| `lifetime0`, `lifetimeFloor`, `lifetimeStep` | how long a target survives, shrinking |
| `targetSize` | square side in px |
| `maxMisses` | run ends after this many expiries |

Higher is better; `unit` is usually `hits`.

---

## Tuning checklist

A game is done when:

- [ ] the first run is reachable in under a couple of seconds — no countdown, no splash
- [ ] a complete beginner scores *something* on their first try
- [ ] difficulty ramps: round 20 (or 30s in) is genuinely hard
- [ ] the run ends cleanly and always produces a score
- [ ] `meta.unit` and `meta.lowerIsBetter` match how the engine scores
- [ ] it holds 60fps on a mid-range phone (watch lane-runner with many obstacles)
- [ ] it looks distinct from its engine siblings — different `unit`, different
      tuning feel. Forty geometric games must not blur together.

---

## Distinctiveness

Config games share a renderer, so distinctiveness is a deliberate act. Vary the
score unit, the difficulty curve, and the failure feel. When per-game palette or
failure-animation hooks are added (stage 09), use them. A shelf of forty games
that all feel the same fails the thesis as surely as a shelf of four.
