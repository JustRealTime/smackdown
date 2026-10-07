/* ---------- part 1: settings, item / perk / snack tables, rarity odds, the map ---------- */
(function (root) {
'use strict';
const SUITE = root.TYPEBITE_SELFTEST;
SUITE.parts.push({ name: 'data', async run(env, R) {
  const { X, G } = env, S = SUITE.stat;

  R.group('Settings and tables');
  await R.test('settings file has no mistakes', t => {
    t.eq(X.CFGW.length, 0, 'warnings about the settings: ' + JSON.stringify(X.CFGW.slice(0, 3)));
    t.ok(/^[0-9a-z]+$/.test(X.CFGID), 'settings id exists');
    t.info('game build', X.BUILD); t.info('settings id', X.CFGID);
  });
  await R.test('24 items: tier, weight, texts', t => {
    const keys = Object.keys(X.ITEMS);
    t.eq(keys.length, 24, 'number of items');
    for (const k of keys) {
      const it = X.ITEMS[k];
      t.ok(it.tier >= 0 && it.tier <= 3, k + ' has a rarity 0..3');
      t.ok(it.w >= 0 && Number.isFinite(it.w), k + ' has a valid weight');
      t.ok(it.name && it.icon && it.d && !/NaN|undefined|\[object/.test(it.d), k + ' has name, icon and a clean text: "' + it.d + '"');
      if (!it.auto && it.p.duration !== undefined) t.ok(it.dur > 0, k + ' lasts longer than 0 s');
    }
    for (let tier = 0; tier < 4; tier++) t.ok(keys.some(k => X.ITEMS[k].tier === tier && X.ITEMS[k].w > 0), 'rarity ' + tier + ' has an item that can drop');
    t.info('per rarity', [0, 1, 2, 3].map(r => keys.filter(k => X.ITEMS[k].tier === r).length).join(' / '));
  });
  await R.test('38 perks: tree, ranks, texts for every rank', t => {
    t.eq(X.PERKS.length, 38, 'number of perks');
    for (const p of X.PERKS) {
      t.ok(X.TREES[p.tree], p.id + ' is in a known tree');
      t.ok(p.max >= 1 && p.max <= 9, p.id + ' has 1..9 ranks');
      t.ok(p.tier >= 0 && p.tier <= 3, p.id + ' has a rarity');
      for (let r = 1; r <= p.max; r++) { const d = p.d(r); t.ok(d && !/NaN|undefined|\[object/.test(d), p.id + ' rank ' + r + ' text is clean: "' + d + '"'); }
    }
    for (const tr of Object.keys(X.TREES)) t.ok(X.PERKS.some(p => p.tree === tr && p.tier === 0), tr + ' has a common perk to start with');
    t.info('per tree', Object.keys(X.TREES).map(k => k + ' ' + X.PERKS.filter(p => p.tree === k).length).join(', '));
    t.info('legendary perks', X.PERKS.filter(p => p.cap).map(p => p.id).join(', '));
  });
  await R.test('57 snacks: nutrition, eating time, average = 1.0', t => {
    t.eq(X.FOODS.length, 57, 'number of snacks');
    let sum = 0, w = 0;
    for (const id of X.FOODS) {
      const f = X.FOOD[id];
      t.ok(f.xp > 0 && f.et > 0 && Number.isFinite(f.xp) && Number.isFinite(f.et), id + ' has nutrition and eating time');
      t.ok(f.tier >= 0 && f.tier <= 3, id + ' has a rarity');
    }
    // the average snack that spawns (by rarity odds) is worth 1.0, that is how the numbers were normalised
    for (let tier = 0; tier < 4; tier++) { const L = X.FOODS.filter(i => X.FOOD[i].tier === tier); if (!L.length) continue; sum += X.FOOD_ODDS[tier] / 100 * S.mean(L.map(i => X.FOOD[i].xp)); w += X.FOOD_ODDS[tier] / 100; }
    t.range('average nutrition of a snack that spawns', sum / w, .85, 1.25);
    t.info('per rarity (xp)', [0, 1, 2, 3].map(r => { const L = X.FOODS.filter(i => X.FOOD[i].tier === r); return L.length + 'x ' + S.mean(L.map(i => X.FOOD[i].xp)).toFixed(1); }).join(' | '));
  });
  await R.test('odds add up and are used', t => {
    for (const [n, o] of [['gift box', X.TIER_ODDS], ['underwater box', X.WATER_ODDS], ['snack', X.FOOD_ODDS], ['perk card', X.PERK_ODDS]]) {
      t.eq(o.length, 4, n + ' odds have 4 entries');
      t.near(o.reduce((a, b) => a + b, 0), 100, .01, n + ' odds add up to 100 %');
      t.ok(o.every(v => v >= 0), n + ' odds are not negative');
    }
    t.ok(X.TIER_ODDS[3] < 2, 'legendary gift boxes are rare (' + X.TIER_ODDS[3].toFixed(2) + ' %)');
    t.ok(X.TIER_ODDS[0] > X.TIER_ODDS[1] && X.TIER_ODDS[1] > X.TIER_ODDS[2] && X.TIER_ODDS[2] > X.TIER_ODDS[3], 'rarer = less likely (gift boxes)');
    t.ok(X.WATER_ODDS[3] > X.TIER_ODDS[3], 'underwater boxes pay better than normal boxes');
  });
  await R.test('level cost and XP are consistent', t => {
    let prev = 0;
    for (let l = 1; l <= 600; l++) {
      const c = X.lvlCost(l);
      t.ok(c > prev || l === 1, 'cost grows at level ' + l); if (!(c >= prev)) break; prev = c;
    }
    for (const l of [1, 2, 5, 10, 30, 99, 250]) t.near(X.xpOf(l + 1) - X.xpOf(l), X.lvlCost(l), 1e-6, 'xpOf(' + (l + 1) + ') - xpOf(' + l + ') = cost of level ' + l);
    t.near(X.xpOf(1), 0, 1e-9, 'level 1 has collected nothing');
    t.range('snacks for level 1', X.lvlCost(1) / (X.LV.snackValue), 2, 4, ' snacks');
    t.range('snacks for level 50', X.lvlCost(50) / X.LV.snackValue, 15, 40, ' snacks');
    t.eq(X.SLOT_LV.length, 7, 'seven item slots');
    t.eq([1, 11, 12, 29, 30, 59, 60, 99, 100, 300].map(l => { const e = { lvl: l }; return X.slotsOf(e); }).join(','), '3,3,4,4,5,5,6,6,7,7', 'slots unlock at 12, 30, 60 and 100');
  });
  await R.test('perk picks come at the right levels', t => {
    const e = { lvl: 1, picksDone: 0 };
    const owed = l => { e.lvl = l; e.picksDone = 0; return X.owedPicks(e); };
    t.eq(owed(1), 0, 'level 1: no pick'); t.eq(owed(2), 1, 'level 2: first pick');
    const ev = X.LV.perkEvery, f = X.LV.firstPerkLevel;
    t.eq(owed(f + ev - 1), 1, 'one level before the second pick'); t.eq(owed(f + ev), 2, 'second pick'); t.eq(owed(f + 5 * ev), 6, 'sixth pick');
    t.eq(X.rankOf(1), 'Rookie', 'rank at 1'); t.ok(X.rankOf(100) === 'Legend', 'rank at 100');
  });

  R.group('Rarity: what really drops');
  const N = R.deep ? 60000 : 20000;
  await R.test('gift boxes drop with the configured rarity (' + N + ' rolls)', t => {
    SUITE.seed(11);
    const c = [0, 0, 0, 0]; for (let i = 0; i < N; i++) c[X.ITEMS[X.rollItem(0, false)].tier]++;
    for (let r = 0; r < 4; r++) t.ok(S.fits(c[r], N, X.TIER_ODDS[r] / 100), 'rarity ' + r + ': ' + (c[r] / N * 100).toFixed(2) + ' % (should be ' + X.TIER_ODDS[r].toFixed(2) + ' %)');
    t.info('measured', c.map(x => (x / N * 100).toFixed(2) + '%').join(' / '));
  });
  await R.test('underwater boxes drop with their own rarity', t => {
    SUITE.seed(12);
    const c = [0, 0, 0, 0]; for (let i = 0; i < N; i++) c[X.ITEMS[X.rollItem(0, true)].tier]++;
    for (let r = 0; r < 4; r++) t.ok(S.fits(c[r], N, X.WATER_ODDS[r] / 100), 'rarity ' + r + ': ' + (c[r] / N * 100).toFixed(2) + ' % (should be ' + X.WATER_ODDS[r].toFixed(2) + ' %)');
  });
  await R.test('every item can drop, none is missing', t => {
    SUITE.seed(13);
    const seen = {}; for (let i = 0; i < 80000; i++) seen[X.rollItem(2, true)] = 1;
    const miss = Object.keys(X.ITEMS).filter(k => X.ITEMS[k].w > 0 && !seen[k]);
    t.eq(miss.length, 0, 'items that never dropped in 80000 lucky rolls: ' + miss.join(','));
  });
  await R.test('Fortune / Lucky Clover give better items', t => {
    SUITE.seed(14);
    const avg = lk => { let s = 0; for (let i = 0; i < 12000; i++) s += X.ITEMS[X.rollItem(lk, false)].tier; return s / 12000; };
    const a0 = avg(0), a1 = avg(1), a2 = avg(2);
    t.ok(a1 > a0 && a2 > a1, 'more extra rolls = higher average rarity (' + a0.toFixed(2) + ' < ' + a1.toFixed(2) + ' < ' + a2.toFixed(2) + ')');
    let leg0 = 0, leg2 = 0; for (let i = 0; i < 40000; i++) { if (X.ITEMS[X.rollItem(0, false)].tier === 3) leg0++; if (X.ITEMS[X.rollItem(2, false)].tier === 3) leg2++; }
    t.range('legendary share with 2 extra rolls', leg2 / 40000 * 100, 0, 3, ' %');
    t.info('legendary share without luck', (leg0 / 400).toFixed(2) + ' %');
  });
  await R.test('snacks spawn with the configured rarity', t => {
    SUITE.seed(15);
    const c = [0, 0, 0, 0]; for (let i = 0; i < N; i++) c[X.FOOD[X.rollFood(-1, '', 3)].tier]++;
    for (let r = 0; r < 4; r++) t.ok(S.fits(c[r], N, X.FOOD_ODDS[r] / 100), 'rarity ' + r + ': ' + (c[r] / N * 100).toFixed(2) + ' % (should be ' + X.FOOD_ODDS[r].toFixed(2) + ' %)');
    const seen = {}; for (let i = 0; i < 120000; i++) seen[X.rollFood(-1, '', 3)] = 1;
    t.eq(X.FOODS.filter(i => !seen[i]).length, 0, 'snacks that never spawned: ' + X.FOODS.filter(i => !seen[i]).join(','));
  });
  await R.test('home biomes and shops make snacks more likely there', t => {
    SUITE.seed(16);
    let ok = 0, tot = 0;
    for (const id of X.FOODS) {
      const f = X.FOOD[id]; if (!f.bm || f.tier > 1) continue;
      let bi = 0; while (!(f.bm & (1 << bi))) bi++; const other = (bi + 4) % 9; if (f.bm & (1 << other)) continue;
      let home = 0, away = 0;
      for (let i = 0; i < 6000; i++) { if (X.rollFood(bi, '', 3) === id) home++; if (X.rollFood(other, '', 3) === id) away++; }
      tot++; if (home > away) ok++;
    }
    t.ok(tot > 5, 'checked ' + tot + ' snacks'); t.ok(ok >= tot * .9, 'at home the snack is more common in ' + ok + ' of ' + tot + ' cases');
  });
  await R.test('perk cards: rarity and rules', t => {
    SUITE.seed(17);
    const e = env.ent(500, 500, 30); const c = [0, 0, 0, 0]; let cards = 0, dup = 0, empty = 0;
    for (let i = 0; i < 4000; i++) {
      const o = X.rollOffer(e); if (!o.length) empty++; if (new Set(o).size !== o.length) dup++;
      for (const id of o) { cards++; c[X.PERK_BY[id].tier]++; t.ok(!X.PERK_BY[id].cap, id + ' (legendary) was offered with no points in its tree'); }
    }
    t.eq(dup, 0, 'offers with the same perk twice'); t.eq(empty, 0, 'empty offers');
    t.info('share per rarity (no legendary until a tree has points)', c.map(x => (x / cards * 100).toFixed(1) + '%').join(' / '));
    // legendary only after capstoneNeedsPoints points in the tree
    const pts = X.LV.capstoneNeedsPoints; e.perks = {}; let given = 0;
    for (const p of X.PERKS) if (p.tree === 'sprint' && !p.cap && given < pts) { e.perks[p.id] = 1; given++; }
    let leg = 0; for (let i = 0; i < 3000; i++) for (const id of X.rollOffer(e)) if (X.PERK_BY[id].cap) leg++;
    t.ok(leg > 0, 'legendary perks do appear after ' + pts + ' points in a tree');
    for (let i = 0; i < 1000; i++) for (const id of X.rollOffer(e)) { const p = X.PERK_BY[id]; t.ok(!p.cap || X.treePts(e, p.tree) >= pts, 'legendary ' + id + ' needs ' + pts + ' points in ' + p.tree); }
    // maxed perks are not offered; all maxed = nothing
    for (const p of X.PERKS) e.perks[p.id] = p.max;
    t.eq(X.rollOffer(e).length, 0, 'nothing is offered when every perk is maxed');
    X.ents = [];
  });

  R.group('The map');
  await R.test('the same seed always builds the same map', t => {
    const sig = () => JSON.stringify([X.houses.map(h => [h.type, Math.round(h.x), Math.round(h.y), h.w, h.h]), X.walls.length, X.trees.length, X.ponds.length, X.decor.length]);
    X.buildWorld(777); const a = sig(); X.buildWorld(888); const b = sig(); X.buildWorld(777); const c = sig(); env.blankMode = false;
    t.ok(a === c, 'seed 777 gives the same map twice'); t.ok(a !== b, 'a different seed gives a different map');
    t.info('houses', X.houses.length); t.info('walls', X.walls.length); t.info('trees', X.trees.length); t.info('ponds', X.ponds.length);
  });
  const seeds = R.deep ? [1, 2, 3, 4, 5, 6] : [1, 2, 3];
  for (const seed of seeds) await R.test('map of seed ' + seed + ': buildings, walls, spawn spots', t => {
    env.world(seed);
    const exp = Object.values(X.CFG.world.buildings).reduce((a, b) => a + b, 0) * (X.CFG.world.scaleCounts ? Math.pow(X.WORLD / 13600, 2) : 1);
    t.range('number of buildings (settings say about ' + Math.round(exp) + ')', X.houses.length, exp * .5, exp * 1.3);
    const types = new Set(X.houses.map(h => h.type)); t.ok(types.size >= 12, 'at least 12 of 16 building types exist (' + types.size + ')');
    // buildings do not overlap
    let overlap = 0; for (let i = 0; i < X.houses.length; i++) for (let j = i + 1; j < X.houses.length; j++) { const a = X.houses[i], b = X.houses[j]; if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) overlap++; }
    t.eq(overlap, 0, 'overlapping buildings');
    for (const h of X.houses) { t.ok(h.x > 0 && h.y > 0 && h.x + h.w < X.WORLD && h.y + h.h < X.WORLD, 'building inside the map'); }
    // every building can be entered: a door zone sits in its wall
    t.ok(X.doorZones.length >= X.houses.length * .9, 'door zones for the buildings (' + X.doorZones.length + ' for ' + X.houses.length + ')');
    // spawn spots are free
    let bad = 0; for (let i = 0; i < 3000; i++) { const p = X.freeSpot(40); if (X.wallHit(p.x, p.y, 20) || X.waterAt(p.x, p.y) || p.x < 40 || p.y < 40 || p.x > X.WORLD - 40 || p.y > X.WORLD - 40) bad++; }
    t.eq(bad, 0, 'free spots that are in a wall, in water or outside the map');
    // snack and box spawning
    env.clean(true); X.foods = []; X.boxes = [];
    for (let i = 0; i < 1500; i++) X.spawnFood(false); for (let i = 0; i < 700; i++) X.spawnFood(true); for (let i = 0; i < 300; i++) X.spawnBox(false); for (let i = 0; i < 200; i++) X.spawnBox(true);
    let inWall = 0, outside = 0, inHouseOk = 0, inHouseN = 0;
    for (const f of X.foods) { if (X.wallHit(f.x, f.y, 10)) inWall++; if (f.x < 0 || f.y < 0 || f.x > X.WORLD || f.y > X.WORLD) outside++; if (f.inside) { inHouseN++; if (X.houseAt(f.x, f.y)) inHouseOk++; } }
    for (const b of X.boxes) { if (X.wallHit(b.x, b.y, 10)) inWall++; if (b.x < 0 || b.y < 0 || b.x > X.WORLD || b.y > X.WORLD) outside++; }
    t.eq(inWall, 0, 'snacks or boxes inside a wall'); t.eq(outside, 0, 'snacks or boxes outside the map'); t.ok(inHouseN === 0 || inHouseOk === inHouseN, 'indoor snacks lie inside a building (' + inHouseOk + '/' + inHouseN + ')');
    const ponds = X.ponds.length; if (ponds) { X.boxes = []; for (let i = 0; i < 50; i++) X.spawnBox === undefined || 0; }
    env.clean(true);
  });
  // leave the world as the game made it (same seed as the page uses is not needed: tests build their own)
  env.world(2024);
} });
})(typeof self !== 'undefined' ? self : globalThis);
