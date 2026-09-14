# STATE

**Read this first.** Rewritten at the end of every stage. If it disagrees with
anything else, it wins.

---

## Where we are

**Stage 00 · Rails — code complete, NOT YET VERIFIED ON A DEVICE.**

Nothing has been installed or run. The cloud session that wrote this had its
npm registry access blocked by egress policy (403 on every package), so no
`npm install`, no typecheck, and no device boot happened. The source is written
against the spec but has never been compiled.

**The immediate next action is the setup in `SETUP.md`.** Until it boots, treat
stage 00 as unproven.

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

1. Run `npm run setup` in the repo root (see `SETUP.md`).
2. `npx expo start`, open on an Android phone.
3. Check the four things the rails screen exists to prove: Archivo renders at
   every role, the palette is right, force-quitting and reopening keeps the
   coins, and the two action rows are comfortably tappable.
4. Report what broke. Then stage 01.
