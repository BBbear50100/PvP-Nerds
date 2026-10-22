# PvP Nerds: the whole community site in one repo

## Publish
1. Create a **public** GitHub repo, upload everything in this folder (keep the folders), then **Settings → Pages → main / (root)**.
2. Open your site, sign in as manager in any section, open its settings and paste **one** GitHub token (Contents: Read and write). All sections share it automatically.

## Manager passwords (change them in each section)
- Tier list: `tierlistmanagerpassword` · Tournaments: `tournamentmanagerpassword` · Warmup: `warmupmanagerpassword`

## Make Sign Up and Warmup saving work (one-time, 5 minutes)
GitHub Pages can’t accept writes from visitors, so a tiny free helper does it:
1. Go to script.google.com → New project → paste `signup-backend.gs`.
2. Project Settings → Script properties: add `GH_TOKEN` (your token) and `REPO` (`yourname/yourrepo`).
3. Deploy → New deployment → **Web app**, Execute as **Me**, access **Anyone**. Copy the web app URL.
4. Put that URL in `site.json`: `{"signupUrl":"https://script.google.com/macros/s/.../exec"}` and commit.
Now signing up adds the IGN to the tournament automatically, and warmup results are stored. The token stays inside Google’s script settings, never in the website.

## Notes
- Warmup streak days use UTC. Hotkeys are set per player in the Warmup page (manager).
- The Information page text lives in `index.html` (`INFO`). Rename the community by editing the brand in the header.
