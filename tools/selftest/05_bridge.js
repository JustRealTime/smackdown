/* ---------- bridge: reaches into the game code (G.ev evaluates inside the game's own scope) and gives the tests a private, controllable world ---------- */
(function (root) {
'use strict';
const SUITE = root.TYPEBITE_SELFTEST;
const BRIDGE = `({
  get ents(){return ents},set ents(v){ents=v},get foods(){return foods},set foods(v){foods=v},get boxes(){return boxes},set boxes(v){boxes=v},get orbs(){return orbs},set orbs(v){orbs=v},
  get king(){return king},set king(v){king=v},get botDuels(){return botDuels},set botDuels(v){botDuels=v},get timeWarp(){return timeWarp},set timeWarp(v){timeWarp=v},
  get houses(){return houses},get fgrid(){return fgrid},get walls(){return walls},get ponds(){return ponds},get trees(){return trees},get bushes(){return bushes},get decor(){return decor},get doorZones(){return doorZones},get wgrid(){return wgrid},get humans(){return humans},get sds(){return sds},get nextId(){return nextId},set nextId(v){nextId=v},
  get WORLD_SEED(){return WORLD_SEED},get CFGW(){return typeof CFGW==='undefined'?[]:CFGW},get CFGID(){return CFGID},get BUILD(){return BUILD},get stockOut(){return stockOut},
  WORLD,BASE,DASH_CD,RAD,LV,MV,DU,QU,STK,PK,CFG,SLOTS,SLOT_LV,SLOT_KEYS,FGC,WGC,BOTS,BOTT,
  ITEMS,ITEM_DEF,PERKS,PERK_BY,PERK_DEF,TREES,TIERS,TIER_ODDS,WATER_ODDS,FOOD,FOODS,FOOD_ODDS,PERK_ODDS,NAMES,WORDS,RANKS,
  makeEnt,botSetup,botAi,botMean,botWpm,botThink,winOdds,stepEnt,update,calcStats,gainXp,gainLvl,lvlCost,snackGain,xpOf,L,rankOf,
  useItem,giveItem,addItem,addBuff,stackN,firstItem,freeSlot,itemRoom,slotsOf,owedPicks,rollOffer,rollItem,rollFood,rollTier,perkR,treePts,
  spawnFood,spawnBox,spawnBot,startDuel,finishDuel,stakeWords,gapCut,sentenceWords,duelWords,advOf,keyItemOf,dropOrbs,questEvent,startQuest,questStep,foodFx,
  srvJoin,srvLeave,srvMsg,srvStep,srvSpawn,srvSnapshot,srvRec,srvCheckpoint,srvRestore,srvStartDuel,srvEndDuel,srvDuels,srvChoose,srvOffer,srvApplyInputs,
  safeName,nameBad,nameNorm,cleanLook,buildWorld,freeSpot,wallHit,waterAt,houseAt,biomeAt,collide,fgBuild,makePhrase,now,clamp,rand,
  setClock(t){CLK=t-performance.now()/1000}
})`;
SUITE.attach = function (G) {
  const X = G.ev(BRIDGE);
  const S = SUITE.stat;
  const env = { G, X, T: 100, saved: null };
  // ----- fake clock: performance.now() is what the game's now() reads, so every test runs in simulated time -----
  const real = performance.now.bind(performance);
  if (!performance.__fake) {
    performance.__fake = true; performance.__t = 100;
    try { performance.now = () => performance.__t * 1000; } catch (e) { throw new Error('cannot fake the clock: ' + e.message); }
  }
  env.clock = () => performance.__t;
  env.advance = s => { performance.__t += s; };
  env.restoreClock = () => { performance.now = real; delete performance.__fake; };
  // ----- settings that would disturb a test (refill of snacks, bots) are switched off while tests run -----
  const SP = X.CFG.spawn, PL = X.CFG.players;
  const keep = { botRespawn: PL.botRespawn, sr: [SP.snackRefillOutside, SP.snackRefillInside, SP.boxRefillOutside, SP.boxRefillInside, SP.boxRefillUnderwater] };
  env.quiet = on => {   // on = true: nothing spawns by itself
    if (on) { PL.botRespawn = 0; SP.snackRefillOutside = SP.snackRefillInside = SP.boxRefillOutside = SP.boxRefillInside = SP.boxRefillUnderwater = 0; }
    else { PL.botRespawn = keep.botRespawn;[SP.snackRefillOutside, SP.snackRefillInside, SP.boxRefillOutside, SP.boxRefillInside, SP.boxRefillUnderwater] = keep.sr; }
  };
  // ----- the map: tests run on a blank field (no walls, no water) unless they say they need the real map -----
  env.mapSeed = 2024; env.blankMode = false;
  env.world = seed => { X.buildWorld(seed || env.mapSeed); if (seed) env.mapSeed = seed; env.blankMode = false; };
  env.blank = () => { if (env.blankMode) return; X.walls.length = 0; X.ponds.length = 0; X.houses.length = 0; X.doorZones.length = 0; X.trees.length = 0; X.bushes.length = 0; X.decor.length = 0; X.wgrid.clear(); env.blankMode = true; };
  // ----- an empty world: nobody, nothing on the ground -----
  env.clean = real => {
    for (const h of [...X.humans.keys()]) X.srvLeave(h);
    if (real) { if (env.blankMode) env.world(); } else env.blank();
    X.ents = []; X.foods = []; X.boxes = []; X.orbs = []; X.botDuels = []; X.sds.length = 0; X.king = null; X.timeWarp = { until: 0, owner: null }; X.fgBuild();
    env.quiet(true);
  };
  // ----- a place with nothing around it (no wall, no water). On the blank field that is anywhere near the middle -----
  env.open = (r = 300) => {
    if (env.blankMode) return { x: X.WORLD / 2 + (Math.random() - .5) * 600, y: X.WORLD / 2 + (Math.random() - .5) * 600 };
    const ok = (x, y) => { for (let a = 0; a < 6.3; a += .4) for (let d = 70; d <= r; d += 70) { const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d; if (px < 80 || py < 80 || px > X.WORLD - 80 || py > X.WORLD - 80 || X.wallHit(px, py, 34) || X.waterAt(px, py)) return false; } return !X.wallHit(x, y, 40) && !X.waterAt(x, y); };
    for (let i = 0; i < 6000; i++) { const p = X.freeSpot(60); if (ok(p.x, p.y)) return { x: p.x, y: p.y }; }
    throw new Error('no open ground of radius ' + r + ' on this map');
  };
  // ----- an entity (a bot without a brain unless told otherwise) -----
  env.ent = (x, y, lvl = 1, o = {}) => {
    const e = X.makeEnt(o.name || 'Test', lvl, false, env.clock());
    e.x = x; e.y = y; e.vx = e.vy = 0; e.spd = o.spd === undefined ? 1 : o.spd; e.protect = o.protect === undefined ? 0 : o.protect; e.want = { ux: 0, uy: 0, f: 0, sprint: false, dash: false };
    e.ai.t = 1e9;   // the bot AI does not think (tests that need it set ai.t = 0)
    if (o.bt) { e.bt = o.bt; X.botAi(e); }
    X.ents.push(e); return e;
  };
  // a real player through the server's own join code
  env.human = (name, o = {}) => {
    const cid = (env.cid = (env.cid || 1000) + 1);
    const h = X.srvJoin(cid, name || 'Human' + cid, o.look || {}, '', null);
    const e = h.e; if (!o.keep) e.protect = o.protect === undefined ? 0 : o.protect;
    if (o.x !== undefined) { e.x = o.x; e.y = o.y; }
    return { h, e, cid };
  };
  // ----- advance the world: dt steps of 1/60 s, with the clock moving along -----
  env.run = (sec, per) => {
    const n = Math.round(sec * 60);
    for (let i = 0; i < n; i++) { env.advance(1 / 60); X.update(1 / 60, env.clock()); if (per && per(i / 60) === false) break; }
  };
  // the full server step (snapshots, duels, outbox)
  env.srv = (sec, per) => {
    const out = [];
    const n = Math.round(sec * 60);
    for (let i = 0; i < n; i++) { env.advance(1 / 60); const o = X.srvStep(1 / 60); for (const m of o) out.push(m); if (per && per(i / 60, o) === false) break; }
    return out;
  };
  env.dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  env.inWall = e => X.wallHit(e.x, e.y, X.RAD * .7);
  env.fixedSeed = n => SUITE.seed(n);
  env.stat = S;
  return env;
};
})(typeof self !== 'undefined' ? self : globalThis);
