# STATE

**Read this first.** Rewritten at the end of every stage. If it disagrees with
anything else, it wins.

---

## Where we are

**Stage 00 · Rails — VERIFIED (compiles + bundles). Device boot still pending.**

Installed and built on the local machine against **Expo SDK 57**, Node 24.19.
`tsc --noEmit` is clean and `expo export --platform android` produces a 3.8MB
bundle with exit 0 — so Babel (worklets plugin) and the `@/*` Metro alias both
resolve every file. Three SDK-57 fixes were needed and made (see below).

**The one thing left for stage 00 is the on-device visual check** — Archivo
renders at every role, palette is right, coins survive a force-quit, tap
targets feel right. That needs a phone with Expo Go: `npx expo start`, scan the
QR. Everything a machine can check has passed.

### SDK-57 fixes applied during verification
- `tsconfig.json` — removed `baseUrl` (deprecated in the TS 6 this SDK pulls;
  `paths` resolves without it).
- `app/_layout.tsx` — dropped `backgroundColor` from `<StatusBar>`; SDK 57 makes
  Android edge-to-edge default and removed the prop. Safe-area padding covers it.
- `babel.config.js` — switched to `react-native-worklets/plugin` for Reanimated
  4.5.1 / worklets 0.10.4.

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

- Nothing has been installed, compiled, or run.
- No screens, no chrome, no tab bar. That is stage 01.
- `data/catalogue.ts` is not written yet — stage 05.
- The nine engines do not exist — stage 04.

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
