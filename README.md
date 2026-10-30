# PvP Nerds: the whole community site in one repo

## Publish
1. Create a **public** GitHub repo, upload everything in this folder (keep the folders), then **Settings → Pages → main / (root)**.
2. Open your site and click the faint **manager** text in the bottom-right corner. Password: `pvpnerdsmanagerpassword`.
3. In the manager window paste **one** GitHub token (Contents: Read and write) and the repo name. Every section shares it. You can also set a new manager password and the sign-up service URL there.

Manager mode turns on editing everywhere (tiers, tournaments, warmup hotkeys). Visitors never see any login buttons.

## Sign Up and Warmup saving (Firebase)
Sign-ups and warmup results are stored in your Firebase project (`pvp-nerds-database`), config is in `fb.js`.
1. Firebase console → Build → Firestore Database → **Rules** tab.
2. Delete what's there, paste the contents of `firestore.rules`, click **Publish**.
Sign-ups appear in the tournament instantly. When you start a tournament, the signed-up players are saved into it.
Warmup: each player registers once with their IGN and hotkeys (saved in Firebase, locked afterward). To reset someone's hotkeys, delete their document in Firestore → warmup.

## Pixel style
Manager window → Pixel style (Off / Subtle / Medium / Heavy). It uses the Pixelify Sans font and applies to the whole site.

## Notes
- Warmup streak days use UTC. Hotkeys are set per player in the Warmup page (manager).
- The Information page text lives in `index.html` (`INFO`). Rename the community by editing the brand in the header.

## ELO system setup (Firebase Authentication)
1. Firebase console → Build → **Authentication** → Get started → Sign-in method → **Email/Password** → enable.
2. Users tab → **Add user**: email `manager@pvpnerds.app`, password = your manager password (6+ characters). The email doesn't need to be real.
3. Firestore Database → Rules → paste `firestore.rules` → Publish. (If you use a different email, change it in `fb.js` (MANAGER_EMAIL) and in the rules.)
Manager login on the site (faint "manager" text) now signs in with that account. The manager page lives in PvP Tiers → Manager.

## Texture Packs and PvP Guides
New `library/` folder (upload it). In manager mode (faint "manager" text) open Texture Packs or PvP Guides and use the + button.
- Packs: upload a .zip (up to 50 MB, saved to a `packs-files/` folder in your repo with your GitHub token) or paste a download link. Cover: pick an image, or leave blank to use `pack.png` from an uploaded zip.
- Guides: paste a YouTube link.
- Add the new rules from `firestore.rules` in Firebase (packs and guides collections).
