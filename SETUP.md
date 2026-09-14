# Setup — run this first

The session that wrote this code had no npm access, so **nothing here has been
installed, compiled or run.** These three commands are the first real test of
stage 00.

```bash
cd C:\Users\nitin\Work\Arcade

npm install        # installs Expo + TypeScript
npm run setup      # adds every dependency at SDK-correct versions
npx expo start     # scan the QR with Expo Go on your Android phone
```

`npm run setup` is deliberately not a list of pinned versions. It runs
`expo install`, which asks your installed Expo SDK what versions it wants, and
then `expo install --fix`, which corrects anything that drifted. **Commit the
resolved `package.json` and lockfile afterwards** — from that point on the
versions are real and pinned.

---

## What you should see

The rails-check screen. It is not a product screen; it exists to prove four
things on a real phone, and stage 01 deletes it.

1. **Archivo renders at every type role** — from the 72px run score down to the
   10px kicker. If you see a system sans-serif instead, the font load failed.
2. **The palette is right** — eight swatches, and nothing rounded anywhere.
3. **Persistence works.** Tap *Award 25 coins* a few times, then force-quit the
   app from the task switcher and reopen it. The coins must still be there.
   This is the actual acceptance test for the stage.
4. **Tap targets clear 48px.** Both action rows should feel comfortable, not
   fiddly, with a thumb.

Also worth a look: *Take a retry* goes free three times, then charges 50 coins,
then refuses when you cannot afford it.

---

## If it does not start

**A babel warning about the reanimated plugin.** Newer Expo SDKs moved it to
`react-native-worklets/plugin`, or include it in `babel-preset-expo` and warn
that listing it is redundant. Open `babel.config.js` — the comment at the top
explains both cases. Do what the warning says, then restart with
`npx expo start -c` to clear the cache.

**`Unable to resolve "@/..."`.** The path alias in `tsconfig.json` needs the
Metro resolver to agree. Restart with `npx expo start -c` first; if it
persists, tell me and I will add the alias to `metro.config.js` instead.

**A new-architecture build error.** `app.json` sets `newArchEnabled: true`.
Turning it off is a legitimate move — say so and I will note it in
`docs/DECISIONS.md`.

Anything else: send me the error text rather than working around it. This is
the stage where a wrong foundation is cheapest to fix.

---

## Then

Tell me what broke, or that it booted clean, and I will start stage 01 —
the fourteen routes, the four chrome variants, and the eleven components from
UI spec §6.
