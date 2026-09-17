# Parade State — Install Guide

This is a local-only version of the app: everything lives in your phone's own
storage (IndexedDB). There is no server, no account, and no data ever leaves
the device it's installed on. Each install is completely independent — if
you put this on two phones, they will not see each other's changes.

## What's in this folder

| File | What it's for |
|---|---|
| `index.html` | The entire app — all the logic lives in this one file |
| `manifest.json` | Tells the phone how to install it (name, icon, colors) |
| `service-worker.js` | Caches the app so it opens with zero signal |
| `icon-192.png`, `icon-512.png` | The home-screen icon |

## Step 1 — Host the files somewhere real

A PWA can only be *installed* (added to the home screen with offline support)
when it's served over HTTPS from a real address — opening `index.html`
directly from a Downloads folder will run the app fine in a browser tab, but
the phone won't offer to install it.

The easiest free option is **GitHub Pages**:

1. Create a new GitHub repository (public or private both work).
2. Upload all five files in this folder to it, at the repository root.
3. In the repo, go to **Settings → Pages**, set the source to your main
   branch, and save.
4. GitHub gives you a URL like `https://yourname.github.io/repo-name/` —
   that's your app's address. It can take a minute or two to go live the
   first time.

Any other static host works the same way (Netlify, Vercel, Cloudflare
Pages, or your own web server) — the only requirement is HTTPS.

## Step 2 — Install it on your phone

**iPhone (Safari — must be Safari, not Chrome):**
1. Open your app's URL in Safari.
2. Tap the **Share** icon (square with an arrow) at the bottom of the screen.
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add**. The icon now appears on your home screen like any other app.

**Android (Chrome):**
1. Open your app's URL in Chrome.
2. Tap the **⋮** menu in the top right.
3. Tap **Install app** (or **Add to Home screen** on older versions).
4. Confirm. The icon appears on your home screen.

Once installed, it opens full-screen with no browser bar, and works exactly
like a normal app.

## Step 3 — Confirm it works offline

Turn on airplane mode and open the app from its home-screen icon. It should
open normally and let you mark attendance and save, because the app shell is
cached by `service-worker.js` and the data lives in IndexedDB on the device
itself.

## Where your data actually lives, and how to reset it

Everything — the roster, today's attendance, saved history — is stored in
this browser/app's IndexedDB, scoped to the exact address you installed it
from. That means:

- Uninstalling the app **does** delete its data (this is normal phone
  behavior for any app's local storage).
- Reinstalling from the *same URL* does not restore old data once it's been
  cleared — there's no backup happening anywhere.
- If you ever want to wipe it and start over with the sample roster again,
  clear the site's storage from your browser settings, or uninstall and
  reinstall it.

Because nothing is backed up anywhere, it's worth deciding early whether
losing a phone means losing that data — if that's a real risk for how you'll
use this, that's a good reason to revisit the shared/server-backed version
instead of this one.

## What's ported so far, and what isn't yet

**Included:** full AM/PM parade state, all reason types (including MC/OSL/LL
with date math and weekday-only counting, COURSE, OOC, OTHER), CDS/CDO,
Stay-in Strength with both carry-forward rules, employee/sub-unit/superior
management, History with both saved-record formats, and both export text
formats — all working the same way they did in the shared version.

**Not yet ported:** the standalone "pre-schedule a future absence" screens
(the separate MC/Leave/MA/Off/Other lists on the old Data tab). Marking
someone absent today still works fully without these — you just can't
pre-declare an absence that starts next week before it happens yet.
