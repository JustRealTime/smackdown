/* ---------- part 6: bots: kinds, speeds, typing skill, behaviour in small scenes, and a crowd living on the real map ---------- */
(function (root) {
'use strict';
const SUITE = root.TYPEBITE_SELFTEST;
SUITE.parts.push({ name: 'bots', async run(env, R) {
  const { X } = env, S = SUITE.stat;
  const go = (e, ux, uy, o = {}) => { e.want = { ux, uy, f: o.f === undefined ? 1 : o.f, sprint: !!o.sprint, dash: !!o.dash }; };
  const spd = e => Math.hypot(e.vx, e.vy);

  R.group('Bots: kinds, speeds, typing');
  await R.test('the kinds of bots follow the settings, every kind has its own character', t => {
    SUITE.seed(101); env.clean(); const N = 2400, c = {}, spds = {}, skills = {};
    for (let i = 0; i < N; i++) { const e = X.makeEnt('B', 5, false, env.clock()); c[e.bt] = (c[e.bt] || 0) + 1; (spds[e.bt] = spds[e.bt] || []).push(e.spd); (skills[e.bt] = skills[e.bt] || []).push(X.botMean(e)); }
    const w = X.CFG.players.botTypes, tot = Object.values(w).reduce((a, b) => a + (+b || 0), 0);
    for (const k of Object.keys(X.BOTT)) { const p = (+w[k] || 0) / tot; t.ok(S.fits(c[k] || 0, N, p), k + ': ' + ((c[k] || 0) / N * 100).toFixed(1) + ' % of the bots (settings say ' + (p * 100).toFixed(1) + ' %)'); }
    for (const k of Object.keys(X.BOTT)) { const T = X.BOTT[k]; if (!spds[k]) continue; t.ok(Math.min(...spds[k]) >= T.s[0] - 1e-9 && Math.max(...spds[k]) <= T.s[1] + 1e-9, k + ' walks at ' + T.s[0] + '-' + T.s[1] + ' x'); }
    t.info('typing speed per kind (median WPM)', Object.keys(X.BOTT).map(k => k + ' ' + Math.round(S.quantile(skills[k] || [0], .5))).join(' | '));
    t.info('walking speed per kind (average)', Object.keys(X.BOTT).map(k => k + ' ' + S.mean(spds[k] || [0]).toFixed(2)).join(' | '));
    const sp = Object.keys(X.BOTT).filter(k => spds[k]).map(k => S.mean(spds[k])); t.ok(Math.max(...sp) - Math.min(...sp) > .15, 'some kinds walk clearly faster than others');
  });
  await R.test('typing speed of bots: many slow, few fast, always in range', t => {
    SUITE.seed(102); env.clean(); const all = []; for (let i = 0; i < 4000; i++) { const e = X.makeEnt('B', 1 + Math.random() * 40, false, env.clock()); all.push(X.botMean(e)); }
    t.range('slowest bot', Math.min(...all), X.DU.botWpmMin, 30, ' WPM'); t.range('median bot', S.quantile(all, .5), 22, 48, ' WPM'); t.range('fastest bot', Math.max(...all), 55, X.DU.botWpmMax, ' WPM');
    const fast = all.filter(x => x >= 60).length / all.length; t.range('share of bots that type 60 WPM or more', fast * 100, 0, 8, ' %'); t.info('quartiles', [.1, .25, .5, .75, .9, .99].map(q => Math.round(S.quantile(all, q))).join(' / '), ' WPM');
    const e = X.makeEnt('B', 5, false, env.clock()); const sample = Array.from({ length: 200 }, () => X.botWpm(e)); const ratio = Math.max(...sample) / Math.min(...sample); t.ok(ratio < 1.25 && ratio > 1.05, 'one bot types a bit differently from duel to duel (' + ratio.toFixed(2) + ' x between best and worst)');
  });
  await R.test('walking speed differs between kinds', t => {
    SUITE.seed(103); env.clean(); const p = env.open(300); const run = bt => { const e = env.ent(p.x, p.y, 5); e.bt = bt; e.spd = X.BOTT[bt].s[1]; go(e, 1, 0); env.run(1.2); const v = spd(e); X.ents = []; return v; };
    const fastV = run('sprinter'), slowV = run('tank'); t.ok(fastV / slowV > 1.2, 'a sprinter (' + Math.round(fastV) + ') is clearly faster than a tank (' + Math.round(slowV) + ' units/s)');
  });

  R.group('Bots: decisions in small scenes');
  await R.test('a bot that would lose runs away from the stronger one', t => {
    SUITE.seed(104); let fled = 0, away = 0, N = 12;
    for (let i = 0; i < N; i++) { env.clean(); const p = env.open(300); const weak = env.ent(p.x, p.y, 8, { bt: 'coward' }), strong = env.ent(p.x + 180, p.y, 8, { bt: 'hunter' }); weak.skill = -14; strong.skill = 30; weak.ai.brave = 0; strong.ai.aggr = 0;
      const d0 = env.dist(weak, strong); weak.ai.t = 0; let mode = false; env.run(2.5, () => { if (weak.ai.mode === 'flee') mode = true; }); if (mode) fled++; if (env.dist(weak, strong) > d0 + 60) away++; }
    t.ok(fled >= N * .85, 'the weak bot ran in ' + fled + ' of ' + N + ' scenes'); t.ok(away >= N * .8, 'and ended up farther away in ' + away + ' of ' + N);
  });
  await R.test('a fast typist hunts a slow one, but not the other way round', t => {
    SUITE.seed(105); let caught = 0, wrong = 0, N = 12;
    for (let i = 0; i < N; i++) { env.clean(); const p = env.open(300); const h = env.ent(p.x, p.y, 8, { bt: 'hunter' }), v = env.ent(p.x + 260, p.y, 8, { bt: 'farmer' }); h.skill = 30; v.skill = -14; h.ai.aggr = 1; v.ai.brave = 1; v.ai.aggr = 0; h.protect = v.protect = 0;
      h.ai.t = 0; let d = false; env.run(7, () => { if (X.botDuels.length || h.state === 'duel') { d = true; return false; } }); if (d) caught++; }
    t.ok(caught >= N * .75, 'the hunter caught the slow typist in ' + caught + ' of ' + N + ' scenes');
    for (let i = 0; i < N; i++) { env.clean(); const p = env.open(300); const w = env.ent(p.x, p.y, 8, { bt: 'hunter' }), s = env.ent(p.x + 260, p.y, 8, { bt: 'balanced' }); w.skill = -14; s.skill = 30; w.ai.aggr = 1; w.ai.brave = 1; w.protect = s.protect = 0; w.ai.t = 0; let ch = 0; env.run(3, () => { if (w.ai.mode === 'chase' && w.ai.target === s) ch++; }); if (ch > 5) wrong++; }
    t.ok(wrong <= 1, 'a slow typist chased a much faster one in ' + wrong + ' of ' + N + ' scenes');
  });
  await R.test('bots pick up gift boxes and orbs, and prefer the valuable snack', t => {
    SUITE.seed(106); let boxOk = 0, orbOk = 0, goldOk = 0, N = 8;
    for (let i = 0; i < N; i++) { env.clean(); const p = env.open(300); const b = env.ent(p.x, p.y, 6, { bt: 'scavenger' }); b.items = [null, null, null, null, null, null, null]; X.boxes = [{ x: p.x + 330, y: p.y, bob: 0, inside: false }]; b.ai.t = 0; env.run(6); if (b.items.some(Boolean)) boxOk++; }
    for (let i = 0; i < N; i++) { env.clean(); const p = env.open(300); const b = env.ent(p.x, p.y, 6, { bt: 'balanced' }); X.orbs = [{ x: p.x, y: p.y + 260, v: 20, vx: 0, vy: 0, life: 30 }]; const l0 = b.lvl; b.ai.t = 0; env.run(5); if (b.lvl > l0) orbOk++; }
    for (let i = 0; i < N; i++) { env.clean(); const p = env.open(300); const b = env.ent(p.x, p.y, 6, { bt: 'balanced' }); X.foods = [{ x: p.x + 130, y: p.y, t: 'apple', bob: 0, inside: false }, { x: p.x - 300, y: p.y, t: 'goldburger', bob: 0, inside: false }]; X.fgBuild(); b.ai.t = 0; let first = null; env.run(8, () => { if (first === null && b.state === 'eat') first = b.eatFood; if (first) return false; }); if (first === 'goldburger') goldOk++; }
    t.ok(boxOk >= N - 1, 'gift box taken in ' + boxOk + ' of ' + N); t.ok(orbOk >= N - 1, 'orb taken in ' + orbOk + ' of ' + N); t.ok(goldOk >= N - 1, 'the golden burger (300 away) before the apple (130 away) in ' + goldOk + ' of ' + N);
  });
  await R.test('bots do not eat the snack that lies next to something dangerous', t => {
    SUITE.seed(107); let ate = 0, N = 10;
    for (let i = 0; i < N; i++) { env.clean(); const p = env.open(300); const b = env.ent(p.x, p.y, 8, { bt: 'balanced' }), d = env.ent(p.x + 330, p.y, 8, { bt: 'hunter' }); b.skill = -14; d.skill = 30; b.ai.brave = .5; d.ai.aggr = 0;
      X.foods = [{ x: p.x + 280, y: p.y + 20, t: 'apple', bob: 0, inside: false }]; X.fgBuild(); b.ai.t = 0; env.run(4); if (X.foods.length === 0) ate++; }
    t.ok(ate <= 2, 'a bot still went for a snack right next to a fast typist ' + ate + ' of ' + N + ' times');
  });
  await R.test('bots use their items sensibly', t => {
    SUITE.seed(108); env.clean(); let p = env.open(300); let b = env.ent(p.x, p.y, 8, { bt: 'coward' }), st = env.ent(p.x + 200, p.y, 8, { bt: 'hunter' }); b.skill = -14; st.skill = 30; b.ai.brave = 0; b.items = ['shield', null, null, null, null, null, null]; b.ai.itemAt = 0; b.ai.t = 0; env.run(3);
    t.ok(b.items[0] === null && b.buff.shield > 0, 'a bot with a Bubble Shield uses it when a stronger one is close');
    env.clean(); p = env.open(300); b = env.ent(p.x, p.y, 8); b.items = ['angel', 'magnet', null, null, null, null, null]; X.foods = [{ x: p.x + 200, y: p.y, t: 'apple', bob: 0, inside: false }]; X.fgBuild(); b.ai.itemAt = 0; b.ai.t = 0; env.run(4);
    t.ok(b.items[0] === 'angel', 'the automatic Angel Feather is kept for the duel'); t.ok(b.items[1] === null, 'the usable item behind it is still used (not blocked by the feather)');
    env.clean(); p = env.open(300); b = env.ent(p.x, p.y, 8); b.items = ['apple', null, null, null, null, null, null]; b.ai.itemAt = 0; b.ai.t = 0; const l0 = b.lvl; env.run(2); t.ok(b.lvl > l0 && b.items[0] === null, 'instant items are used at once');
  });
  await R.test('bots that cannot reach a snack give up on it', t => {
    SUITE.seed(109); env.clean(true); const h = X.houses.find(h => h.w > 300); let stuckLong = 0, N = 0;
    for (let i = 0; i < 8; i++) { env.clean(true); const sx = h.x - 120, sy = h.y + 30 + i * 10; if (X.wallHit(sx, sy, 24)) continue; N++;
      const b = env.ent(sx, sy, 5, { bt: 'balanced' }); X.foods = [{ x: h.x + h.w + 100, y: h.y + h.h / 2, t: 'apple', bob: 0, inside: false }]; X.fgBuild(); b.ai.t = 0; let last = { x: b.x, y: b.y }, still = 0, k = 0; env.run(25, () => { if (++k % 600 === 0) { if (Math.hypot(b.x - last.x, b.y - last.y) < 20) still++; last = { x: b.x, y: b.y }; } }); if (still >= 2) stuckLong++; }
    t.ok(N >= 4, 'scenes tried: ' + N); t.ok(stuckLong <= 1, 'bots that stood still for 20+ s in front of a wall: ' + stuckLong + ' of ' + N);
  });

  R.group('Bots: a crowd on the real map');
  const SIM = R.deep ? 600 : 150;
  await R.test('100 bots live for ' + SIM + ' s: population, levels, king, no stuck bots, no errors', t => {
    SUITE.seed(110); env.clean(true); env.quiet(false); X.foods = [];
    for (let i = 0; i < X.CFG.spawn.snacksOutside * .5; i++) X.spawnFood(false); for (let i = 0; i < X.CFG.spawn.snacksInside * .5; i++) X.spawnFood(true); X.fgBuild(); for (let i = 0; i < 90; i++) X.spawnBot(env.clock());
    let nan = 0, inWall = 0, kingSeen = 0, minAlive = 1e9, sampleN = 0, stuck = 0, stuckN = 0; const pos = new Map();
    for (let s = 0; s < SIM; s++) { env.run(1);
      if (s % 10 === 9) { const bots = X.ents.filter(e => !e.human && e.state !== 'eaten'); minAlive = Math.min(minAlive, bots.length); for (const e of bots) { if (!Number.isFinite(e.x + e.y + e.lvl)) nan++; if (env.inWall(e)) inWall++; } if (X.king) kingSeen++; sampleN++;
        if (s % 30 === 29) for (const e of bots) { const o = pos.get(e.id); if (o && e.state === 'move') { stuckN++; if (Math.hypot(e.x - o.x, e.y - o.y) < 25 && X.foods.length > 200) stuck++; } pos.set(e.id, { x: e.x, y: e.y }); } } }
    const bots = X.ents.filter(e => !e.human && e.state !== 'eaten'), lv = bots.map(e => e.lvl);
    t.eq(nan, 0, 'bots with a broken position or level'); t.eq(inWall, 0, 'times a bot was inside a wall'); t.range('bots alive (lowest)', minAlive, 30, 200); t.range('bots alive (end)', bots.length, 40, 200);
    t.range('median bot level', S.quantile(lv, .5), 3, 40); t.range('highest bot level', Math.max(...lv), 5, 160); t.ok(kingSeen >= sampleN * .5, 'there was a King in ' + kingSeen + ' of ' + sampleN + ' checks');
    t.range('bots standing still for 30 s while snacks were around', stuckN ? stuck / stuckN * 100 : 0, 0, 8, ' %'); t.info('level quartiles (10 % / 50 % / 90 % / 99 %)', [.1, .5, .9, .99].map(q => S.quantile(lv, q).toFixed(1)).join(' / ')); t.info('snacks on the ground at the end', X.foods.length);
    const types = {}; for (const e of bots) types[e.bt] = (types[e.bt] || 0) + 1; t.info('kinds alive', JSON.stringify(types));
    const byType = {}; for (const e of bots) (byType[e.bt] = byType[e.bt] || []).push(e.lvl); t.info('average level per kind', Object.keys(byType).map(k => k + ' ' + S.mean(byType[k]).toFixed(1)).join(' | '));
    env.clean(); env.quiet(true);
  });
} });
})(typeof self !== 'undefined' ? self : globalThis);
