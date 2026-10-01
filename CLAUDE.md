# Typebite (formerly the working title Snackdown) - project briefing for Claude

Read this first. It describes what the project is, how it is built, what was decided and what is open.
The owner speaks German (writes German/English mixed, casual). Reply in German unless asked otherwise. Keep answers honest and short:
say what was tested and what was not, never claim something works that you did not run.

## What it is
A browser game in the style of agar.io / slither.io: top-down, cartoon pixel-art characters. You eat snacks to level up, bump into other
players/bots to start a 1v1 typing duel (type the phrase faster to win a share of the loser's XP), use items and perks, and get eaten if you lose.
Solo against bots, or multiplayer (up to 12 per lobby). The owner plans: balance -> own website -> ads -> cosmetic microtransactions -> Steam.
The owner lives in Austria, writes the music themself, wants this to be monetized later (see docs/release-plan.md for the legal notes; you are NOT their lawyer).

## Repo layout (branch: `main` only; push straight to main)
- `game.html`  - THE SOURCE. One file, ~3350 lines: HTML + CSS + one big `<script>` IIFE. Edit this.
- `index.html` - BUILT artifact (do not edit by hand). The owner downloads only this file. Always rebuild after every change: `python3 tools/build.py`
  (embeds music/*.mp3, fonts/*.woff2 as data URIs and inlines tools/peerjs.min.js). Then commit both and `git push origin main`.
- `site/config.js` - THE SETTINGS FILE (r51): plain text, fully commented, every tunable number of the game (map size, bots, spawn rates, rarity odds, XP, movement, duel, quests, camera, network, all 24 items, 38 perks, 57 snacks). Edit numbers here, not in game.html. Details below and in `docs/konfiguration.md` (German).
- `tools/build.py`, `tools/peerjs.min.js` (PeerJS 1.5.5, MIT), `fonts/` (OFL fonts, bundled, no Google calls), `music/` (24 mp3, all the owner's own), `THIRD_PARTY.md`.
- `server/server.js` - optional dedicated Node server (no npm deps, hand-written WebSocket). Loads the same game code in a `vm` sandbox with Proxy DOM stubs.
  `node server/server.js [port]`; `start-server.bat/.sh`. Serves game.html/index.html and `/status` (players list, CORS open).
- `docs/konzept.md` - decision log, one section per round (rounds 1-51). Append a new round for every feature batch. `docs/konfiguration.md` - how the owner edits `site/config.js` (German). `docs/lokal-weiterarbeiten.md` - handoff from the cloud session to local work (setup, open points).
- `docs/release-plan.md` - legal notes, cheapest hosting plan, ordered release checklist. `docs/spieltest.md` - playtest guide for the owner and testers. `docs/fehler-upload.md` - error upload setup (German). `docs/sitzung-2026-10-01.md` - detailed log of the 2026-10-01 session (r30 -> r33, error upload setup, why index.html shrank, open points; read it for context).
- `tools/error-relay/worker.js` - Cloudflare Worker that receives error reports and appends them to `errors/YYYY-MM-DD.jsonl` in the PRIVATE repo `JustRealTime/smackdown-errors` (token only in the worker). `README.md` - German user readme.

## Architecture in one page (all in game.html)
- Roles: `solo` (everything in the tab), `client` (renders a world run elsewhere), `server` (headless sim; Node `vm` or a Web Worker).
- World is seeded (`mulberry32`, `buildWorld(seed)`), size from the settings (`world.size`, default 10000 since r51; was 13600), 9 biomes (softmax blend over wobbled distance to `world.regions` centers), ~95 buildings (at 13600, scaled with the area) in 16 types
  (house, diner, bakery, gym, shed, arcade, barn, library, greenhouse, cafe, pizzeria, school, clinic, cinema, workshop, icecream), props, ponds (swim, ice = slippery).
  Walls in a grid `wgrid`, foods in `fgrid` (rebuilt every 0.1 s). Ground is painted in cached 512px chunks.
- Progression: unlimited levels, XP economy (`lvlCost`, `snackGain` x1.7, `gainXp`), 5 perk trees (feast/sprint/typist/guard/trick) with rarities
  (common/rare/epic/legendary, `rarity.perkCards` 62/26/9/3 since r51), perk pick at Lv2 then every 4 levels, 1/2/3 keys only (cards ignore the mouse).
- Items: 3 slots with keys Q/W/E, more unlock at Lv 12/30/60/100 (R/T/Z/U, `SLOT_LV`, `slotsOf`, `freeSlot`), 24 items in 4 rarities (`ITEMS`, `TIER_ODDS` 75/19.5/5/0.5, underwater boxes `WATER_ODDS` 42/38/16.5/3.5; both from `rarity.*` in the settings). Quests every ~3 min.
  Timed items STACK (r51, `addBuff`/`stackN`): `stack:'strength'` = every use has its own timer and the effect scales with the number of running copies (2 Sugar Rush = double, capped by `maxStacks`), `stack:'time'` = time is added (capped at `maxStacks` x duration). `items.stacking:false` turns it off.
- Duel: both players start from the SAME phrase length `stakeWords(a,b)` = 3 + avgLevel/12 + levelGap/10 (max 20); the LOWER-level player then types `gapCut` fewer words (1 per ~9 levels of gap, min 1 from a gap of 4, max 30 %). Items, perks and "running away" change it further.
  `advOf()` drives the green/red aura + number over other players (counts items/perks too). Server-authoritative duels in multiplayer (`srvStartDuel`).
- Food (r50): 57 kinds in `FOOD_SRC` (28 common, 15 rare, 9 epic, 5 legendary; odds `FOOD_ODDS` 86.5/11/2.3/0.2 since r51, from `rarity.snacks`). Each has its own sprite in `FOOD_ART` (helpers `fo.*`), nutrition `xp` (normalised so an average snack = 1.0), eating time `et`, home biomes/shops (6x/8x spawn weight in `rollFood`), crumb colours and for epic/legendary an effect (`foodFx`: rush/turbo/shield/magnet/radar/sta/dash/item). Sprites are cached at 3x (`foodImg`); the guide has a Snacks tab built from the table. `python3 tools/foodsheet.py out.html` paints all of them for a visual check.
- Frame pacing (r50): `SET.fps` 0 = follow the monitor (default), 30..1000 = limit. rAF drives the loop (`rafLoop`/`frame`/`gateOk`); a limit above the measured refresh rate (`HZM`, from rAF timestamps) also runs `frame` from a MessageChannel/setTimeout loop (`fastSync`/`fastTick`) because rAF can never exceed the screen. Settings: checkbox "match monitor" + log slider with snapping.
- Look system: Terraria-style customizer (`LOOK`, `cleanLook` validated on the server), pixel sprites generated in code (`sprite()`), cached.
- Line of sight: only house walls block (`computeSight`, polygon shadow); entities/foods/boxes in shadow are not drawn. Zoom starts 150 %, zooming out unlocks with level (80 % at Lv 60).
- Tutorial: 9 animated inline-SVG scenes (SMIL), function `DEMOS`. Guide: items/perks/rarity lists built from the data tables.
- Audio: synthesized sfx (`sfx`, voice limiter) + music player with per-mode playlists (`TRACKS`, `MODES`), loudness normalised.
- Multiplayer without a server file (WebRTC via PeerJS): the first player who presses Play becomes HOST: their tab runs this same code in a Web Worker
  (`startWorker`, source = `document.currentScript.textContent`) as the game server; the host plays through a local fake socket. Others connect with
  PeerJS data channels (JSON strings). Lobby ids are `typebite-<room>-<slot>` (8 slots per room name, 12 players max). The menu scouts all slots
  (`scoutLobbies`) and lists games with Join buttons. Play joins the fullest non-full game or hosts a new one. A `BUILD` id is checked on join (version mismatch message).
  Uses the PUBLIC PeerJS broker (0.peerjs.com) for now; planned: own broker + TURN. Test hook: `window.SNACK_PEER` overrides Peer options.
- Game loop is crash-proof (`loop()` schedules the next frame first; errors show a red bar via `reportErr(e,src)`).
- Bug reports (r31): `ERRLOG` collects errors from the loop (src update/render), a global `error` listener (page; `unhandledrejection` is only logged), and the host's Worker
  (src host, posted as `{err}` from `WORKER_POST`). `bugReport()` builds plain text (build, UA, screen, mode, `perfLine()` fps/hitches, host step ms `P2P.ms`, errors);
  menu "Report a problem" (`#bugrep`), F8 in game and the error bar copy it (`tryCopy`, clipboard API then execCommand fallback).
- Error upload (r32): if `ERR_URL` (top of the script) is set, `logErr` -> `queueErrUpload` -> `flushErrs` -> `sendRelay` POSTs JSON (text/plain, no preflight) to the relay:
  first upload 5 s after an error, then max 1/min, max 30 per tab, `pagehide` flushes with keepalive; repeated errors only count up (`n`, `sentN`). Manual reports (F8, Send) go too (kind report).
  No player names. Since r33 `ERR_URL` = https://snackdown-errors.alikesan2004.workers.dev/ (worker deployed by the owner on his Cloudflare account, verified 2026-10-01). Test hook: `window.SNACK_ERR_URL`.
  The cloud sandbox cannot reach workers.dev (proxy 403): live uploads can only be checked by the owner; read the result in the log repo.
  To read the logs: attach the private repo with add_repo (JustRealTime/smackdown-errors) and read `errors/*.jsonl` (one JSON object per line).
  Stack lines in reports: index.html line = game.html line + 8 (peerjs.min.js is inlined); host worker line = game.html line - (line of `(()=>{` in game.html - 3), currently -401.
- Bots are named "Name (BOT)". `players.bots` = 240 is the MAXIMUM; they eat each other and respawn at `players.botRespawn` per second (2 -> about 165 alive, 0.8 -> 115, 4 -> 220; measured with the Node sim). Server step is about 6 ms with 240 bots.
- Settings system (r51, `CFG`): `site/config.js` sets `window.TYPEBITE_CONFIG`. `tools/build.py` embeds a copy as `window.TYPEBITE_DEFAULTS` into index.html (fallback) and the page also loads `config.js` next to it, which overrides the defaults (`CFG = merge(DEFAULTS, CONFIG)`; unknown keys, wrong types and syntax errors give warnings `CFGW` in an orange bar `#cfgbar`, the built-in value is used). Because Cloudflare serves `site/`, the owner can edit `site/config.js` on GitHub and the live game changes after the ~1 min deploy without a build; index.html only contains the copy from the last build. `CFGID` (FNV hash over the merged settings) is sent in `welcome`; a joiner with different settings is refused like a different BUILD. The host Worker gets the merged CFG injected (`self.TYPEBITE_CONFIG`), `server/server.js` runs `site/config.js` (or `SNACK_CONFIG=path`) in its sandbox and serves it at `/config.js`. Counts in `world`/`spawn` are written for a 13600 map and scaled with `(size/13600)^2` if `world.scaleCounts`. Odds arrays are weights (`oddsOf` normalises). Item/perk/snack definitions keep name, icon, text and art in the code (`ITEM_DEF`, `PERK_DEF`, `FOOD_SRC`), only numbers come from the file. NOT in the settings: texts/icons, cosmetic unlock levels (looks), rank titles, music, key bindings. When you add a tunable: put it in `site/config.js` with a comment AND read it via `CFG` (the merge needs the key in the file to know it).

## Working conventions
- Match the surrounding code style (dense, short names, few comments). English UI text. German only in README/docs.
- After changes: `python3 tools/build.py`, bump `const BUILD` near the top of the script (currently r51; the menu label is set from it, the static text in the HTML is only a fallback, keep it equal), append a section to docs/konzept.md, commit, push to main.
- Syntax check: extract the main `<script>` body to a .js file and run `node --check`.
- Testing pattern that worked: serve the repo with `python3 -m http.server`, drive it with Playwright + Chromium (`/opt/pw-browsers/chromium`) using a TEMPORARY copy of game.html
  with `window.__d={...}` hooks appended before the final `})();` (never commit the hook copy). For P2P tests run a local PeerJS broker (`npm i peer`, `PeerServer({port:9000,host:'127.0.0.1',path:'/'})`)
  and set `window.SNACK_PEER={host:'127.0.0.1',port:9000,path:'/',secure:false,config:{iceServers:[]}}` via `addInitScript`. Headless fps looks low (software rendering).
- Balance sims without a browser: `require('server/server.js').sim` (`join`, `step(1/60)`, `count()`, `dbg()` = ents/foods/boxes...), `SNACK_CONFIG=file.js` picks a settings file; 240 bots x 420 s takes ~3 min. The bots eat the snacks faster than the refill, so the number of snacks lying around is set by `spawn.snackRefill*` (r51 measured: 2.4/M units^2 with 16/4 and ~165 bots, old game 1.9). P2P tests: wait ~8 s on the menu (lobby scouting) before pressing Play, else the page hosts its own lobby; check `diag().mode`.
- Cloud sandbox gotchas: `pkill -f` can kill your own shell (use a bracket pattern); the sandbox cannot reach unpkg/google/0.peerjs.com (npm works).

- Online play is opt-in (r39): `ONLINE` (localStorage `snackdown-online` yes/no) gates every PeerJS call (scout and Play). Unanswered or no = solo only, no request to the broker. Legal drafts in `docs/legal/` (not published yet; to publish copy filled files to `site/`; see docs/legal/README.md). Site hosting: Cloudflare Workers Builds from `main` (`wrangler.jsonc`, `docs/deploy.md`), domain typebite.io at Cloudflare.

## Known issues / open points
- Once the owner saw a fully purple screen after joining (HUD alive, world not drawn). NOT reproduced in many tests. Guards added (crash-proof loop, camera NaN reset,
  version check, error bar). If it returns, ask for the red error text. Likely suspects: version mismatch between host and joiner, or an exception in render.
- "Sound stops when eating very fast" was not reproducible; a voice limiter/throttles were added.
- Browser-hosted lobbies: host upload limits ~8-12 players; the host can cheat; if the host leaves, the game ends. The real fix is a dedicated authoritative server later.
- Old remote branch `claude/trusting-faraday-bg2wly` still exists (already merged); the owner wants only `main`. Deleting from the cloud session was blocked; delete it on GitHub.
- Deleted music (third-party material) still exists in git history. Offer to rewrite history only if the owner wants it.
- Touch support exists since r43 (floating joystick, Dash/Run buttons, hidden input for the keyboard) but is untested on real devices. Not done yet: name/profanity filter, Impressum + privacy policy + cookie banner, own PeerJS broker + TURN, lobby registry, music split into smaller lazily loaded files,
  final game name + trademark check, playtests in Firefox/Safari/Edge (only Chromium is testable in the cloud sandbox; roundRect has a fallback since r31, so Safari 14.1+ should work but is untested).
- The peer broker is contacted when the menu opens (IP leaves to peerjs.com): needs consent or an own broker before a public release (GDPR).
- The error upload sends browser data to Cloudflare/GitHub: fine for friends who know it (menu note), must go into the privacy policy (maybe consent) before a public release.

## Owner's roadmap and decisions
1. Balance until fair (but keep uncertainty at the top: nobody should be favoured except via items). Legendary items must stay rare.
2. Own website that can host many players; players host lobbies in the browser to keep server cost near zero.
3. Later: ads (needs consent banner), then direct-buy cosmetic microtransactions only (skins, flags; no random paid boxes), then Steam.
4. Name: TYPEBITE (decided 2026-10-01, domain typebite.io at easyname, ~18 EUR first year then ~90, plan: transfer to a cheap registrar after a year). Known risk, accepted by the owner: similar small games exist (BiteType! browser burger typing game, Type 'n' Bite on itch.io); TMview showed no EU/AT mark. Re-check the mark with a lawyer before ads/Steam. Internal keys keep the old prefix (localStorage `snackdown-*`, error relay name). Gewerbe will be registered when income starts. Legal pages (Impressum, privacy, cookie banner) will be done later together.
Next planned step: playtests with 5-10 people on different browsers/devices (guide: docs/spieltest.md; testers send F8 bug reports), then fix bugs and rebalance, then the technical release items in docs/release-plan.md.
