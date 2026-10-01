# Snackdown (working title) - project briefing for Claude

Read this first. It describes what the project is, how it is built, what was decided and what is open.
The owner speaks German (writes German/English mixed, casual). Reply in German unless asked otherwise. Keep answers honest and short:
say what was tested and what was not, never claim something works that you did not run.

## What it is
A browser game in the style of agar.io / slither.io: top-down, cartoon pixel-art characters. You eat snacks to level up, bump into other
players/bots to start a 1v1 typing duel (type the phrase faster to win a share of the loser's XP), use items and perks, and get eaten if you lose.
Solo against bots, or multiplayer (up to 12 per lobby). The owner plans: balance -> own website -> ads -> cosmetic microtransactions -> Steam.
The owner lives in Austria, writes the music themself, wants this to be monetized later (see docs/release-plan.md for the legal notes; you are NOT their lawyer).

## Repo layout (branch: `main` only; push straight to main)
- `game.html`  - THE SOURCE. One file, ~2800 lines: HTML + CSS + one big `<script>` IIFE. Edit this.
- `index.html` - BUILT artifact (do not edit by hand). The owner downloads only this file. Always rebuild after every change: `python3 tools/build.py`
  (embeds music/*.mp3, fonts/*.woff2 as data URIs and inlines tools/peerjs.min.js). Then commit both and `git push origin main`.
- `tools/build.py`, `tools/peerjs.min.js` (PeerJS 1.5.5, MIT), `fonts/` (OFL fonts, bundled, no Google calls), `music/` (24 mp3, all the owner's own), `THIRD_PARTY.md`.
- `server/server.js` - optional dedicated Node server (no npm deps, hand-written WebSocket). Loads the same game code in a `vm` sandbox with Proxy DOM stubs.
  `node server/server.js [port]`; `start-server.bat/.sh`. Serves game.html/index.html and `/status` (players list, CORS open).
- `docs/konzept.md` - decision log, one section per round (rounds 1-30). Append a new round for every feature batch.
- `docs/release-plan.md` - legal notes, cheapest hosting plan, ordered release checklist. `README.md` - German user readme.

## Architecture in one page (all in game.html)
- Roles: `solo` (everything in the tab), `client` (renders a world run elsewhere), `server` (headless sim; Node `vm` or a Web Worker).
- World is seeded (`mulberry32`, `buildWorld(seed)`), 13600x13600, 9 biomes (softmax blend over wobbled distance to 36 centers), ~95 buildings in 16 types
  (house, diner, bakery, gym, shed, arcade, barn, library, greenhouse, cafe, pizzeria, school, clinic, cinema, workshop, icecream), props, ponds (swim, ice = slippery).
  Walls in a grid `wgrid`, foods in `fgrid` (rebuilt every 0.1 s). Ground is painted in cached 512px chunks.
- Progression: unlimited levels, XP economy (`lvlCost`, `snackGain` x1.7, `gainXp`), 5 perk trees (feast/sprint/typist/guard/trick) with rarities
  (common/rare/epic/legendary, 55/30/11/4 %), perk pick at Lv2 then every 4 levels, 1/2/3 keys only (cards ignore the mouse).
- Items: 3 slots with keys Q/W/E, 25 items in 4 rarities (`ITEMS`, `TIER_ODDS` 66/26/7/1, underwater boxes `WATER_ODDS` 34/40/20/6). Quests every ~3 min.
- Duel: both players get the SAME phrase length = `stakeWords(a,b)` = 3 + avgLevel/12 + levelGap/10 (max 20). Only items, perks and "running away" change it.
  `advOf()` drives the green/red aura + number over other players (counts items/perks too). Server-authoritative duels in multiplayer (`srvStartDuel`).
- Look system: Terraria-style customizer (`LOOK`, `cleanLook` validated on the server), pixel sprites generated in code (`sprite()`), cached.
- Line of sight: only house walls block (`computeSight`, polygon shadow); entities/foods/boxes in shadow are not drawn. Zoom starts 150 %, zooming out unlocks with level (80 % at Lv 60).
- Tutorial: 9 animated inline-SVG scenes (SMIL), function `DEMOS`. Guide: items/perks/rarity lists built from the data tables.
- Audio: synthesized sfx (`sfx`, voice limiter) + music player with per-mode playlists (`TRACKS`, `MODES`), loudness normalised.
- Multiplayer without a server file (WebRTC via PeerJS): the first player who presses Play becomes HOST: their tab runs this same code in a Web Worker
  (`startWorker`, source = `document.currentScript.textContent`) as the game server; the host plays through a local fake socket. Others connect with
  PeerJS data channels (JSON strings). Lobby ids are `snackdown-<room>-<slot>` (8 slots per room name, 12 players max). The menu scouts all slots
  (`scoutLobbies`) and lists games with Join buttons. Play joins the fullest non-full game or hosts a new one. A `BUILD` id is checked on join (version mismatch message).
  Uses the PUBLIC PeerJS broker (0.peerjs.com) for now; planned: own broker + TURN. Test hook: `window.SNACK_PEER` overrides Peer options.
- Game loop is crash-proof (`loop()` schedules the next frame first; errors show a red bar via `reportErr`).
- Bots are named "Name (BOT)". 160 bots. Server step is about 6 ms.

## Working conventions
- Match the surrounding code style (dense, short names, few comments). English UI text. German only in README/docs.
- After changes: `python3 tools/build.py`, bump the build label in the menu text ("Build rNN" in game.html, currently r30), append a section to docs/konzept.md, commit, push to main.
- Syntax check: extract the main `<script>` body to a .js file and run `node --check`.
- Testing pattern that worked: serve the repo with `python3 -m http.server`, drive it with Playwright + Chromium (`/opt/pw-browsers/chromium`) using a TEMPORARY copy of game.html
  with `window.__d={...}` hooks appended before the final `})();` (never commit the hook copy). For P2P tests run a local PeerJS broker (`npm i peer`, `PeerServer({port:9000,host:'127.0.0.1',path:'/'})`)
  and set `window.SNACK_PEER={host:'127.0.0.1',port:9000,path:'/',secure:false,config:{iceServers:[]}}` via `addInitScript`. Headless fps looks low (software rendering).
- Cloud sandbox gotchas: `pkill -f` can kill your own shell (use a bracket pattern); the sandbox cannot reach unpkg/google/0.peerjs.com (npm works).

## Known issues / open points
- Once the owner saw a fully purple screen after joining (HUD alive, world not drawn). NOT reproduced in many tests. Guards added (crash-proof loop, camera NaN reset,
  version check, error bar). If it returns, ask for the red error text. Likely suspects: version mismatch between host and joiner, or an exception in render.
- "Sound stops when eating very fast" was not reproducible; a voice limiter/throttles were added.
- Browser-hosted lobbies: host upload limits ~8-12 players; the host can cheat; if the host leaves, the game ends. The real fix is a dedicated authoritative server later.
- Old remote branch `claude/trusting-faraday-bg2wly` still exists (already merged); the owner wants only `main`. Deleting from the cloud session was blocked; delete it on GitHub.
- Deleted music (third-party material) still exists in git history. Offer to rewrite history only if the owner wants it.
- Not done yet: touch/mobile controls, name/profanity filter, Impressum + privacy policy + cookie banner, own PeerJS broker + TURN, lobby registry, music split into smaller lazily loaded files,
  final game name + trademark check, error monitoring, playtests in Firefox/Safari/Edge (roundRect needs Safari 16+).
- The peer broker is contacted when the menu opens (IP leaves to peerjs.com): needs consent or an own broker before a public release (GDPR).

## Owner's roadmap and decisions
1. Balance until fair (but keep uncertainty at the top: nobody should be favoured except via items). Legendary items must stay rare.
2. Own website that can host many players; players host lobbies in the browser to keep server cost near zero.
3. Later: ads (needs consent banner), then direct-buy cosmetic microtransactions only (skins, flags; no random paid boxes), then Steam.
4. Name is not final. Gewerbe will be registered when income starts. Legal pages (Impressum, privacy, cookie banner) will be done later together.
Next planned step: playtests with 5-10 people on different browsers/devices, then fix bugs and rebalance, then the technical release items in docs/release-plan.md.
