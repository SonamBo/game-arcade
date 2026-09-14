# Game Arcade

Forty hypercasual games in one install, on one wallet and one social graph.
A shelf that refills every day — built for frequency, not for sessions.

Android, Expo / React Native, shipped as an APK via EAS.

---

## Where to start

| If you are | Read |
|---|---|
| Setting this up for the first time | [`SETUP.md`](./SETUP.md) |
| Picking the work back up | [`docs/STATE.md`](./docs/STATE.md) — **always first** |
| Wondering why something is the way it is | [`docs/DECISIONS.md`](./docs/DECISIONS.md) |
| Planning the next stage | [`docs/PLAN.md`](./docs/PLAN.md) |
| Adding a game | `games/README.md` — arrives at stage 04 |

The source specs live in [`Design/`](./Design): the UI build spec owns every
visual and copy decision, the build brief owns implementation, and
`Game Arcade.html` is the interactive reference build. Where the spec and the
prototype disagree, the spec wins.

---

## Layout

```
app/          expo-router routes — one file per screen
components/   the eleven patterns from UI spec §6 (stage 01)
games/        types.ts is the contract; catalogue/ is one file per game
store/        zustand + AsyncStorage, one slice per domain
theme/        tokens.ts is the only place a colour or type role is defined
types/        the data model, ranking and economy formulas
data/         the catalogue and the seeded social layer
docs/         plan, state, decisions
```

## The two rules that are easiest to break

Every interactive row and tab is at least **48px** tall, and no readable text
is below **10px**. Grow the padding, never shrink the type. The reference
prototype breaks both; this app must not.

## The two numbers that decide it

**Distinct games per session** — does volume actually get consumed, or does
everyone play one game and leave? **Queue acceptance rate** — does the
auto-queue extend sessions, or annoy people into leaving? Everything else is
downstream of these.
