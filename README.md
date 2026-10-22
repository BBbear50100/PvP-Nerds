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
Sign-ups appear in the tournament instantly. When you start a tournament, the signed-up players are saved into it. Warmup hotkeys are still set by the manager and saved to GitHub.

## Notes
- Warmup streak days use UTC. Hotkeys are set per player in the Warmup page (manager).
- The Information page text lives in `index.html` (`INFO`). Rename the community by editing the brand in the header.
