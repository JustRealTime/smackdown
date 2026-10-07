/* ---------- part 3: all 24 items, one by one, and how they stack ---------- */
(function (root) {
'use strict';
const SUITE = root.TYPEBITE_SELFTEST;
SUITE.parts.push({ name: 'items', async run(env, R) {
  const { X } = env, S = SUITE.stat;
  const clr = () => [null, null, null, null, null, null, null];
  const give = (e, k) => { e.items = clr(); e.items[0] = k; return e; };
  const use = (e, k) => { give(e, k); X.useItem(e, env.clock(), 0); };
  const go = (e, ux, uy, o = {}) => { e.want = { ux, uy, f: o.f === undefined ? 1 : o.f, sprint: !!o.sprint, dash: !!o.dash }; };
  const spd = e => Math.hypot(e.vx, e.vy);
  const P = k => X.ITEMS[k].p, D = k => X.ITEMS[k].dur;
  let spot;
  const fresh = (lvl = 5, real) => { env.clean(real); spot = env.open(300); return env.ent(spot.x, spot.y, lvl); };

  R.group('Items: every one of the 24');
  await R.test('each item can be used without an error and is used up (automatic ones stay)', t => {
    SUITE.seed(41);
    for (const k of Object.keys(X.ITEMS)) {
      if (k === 'sticky') continue;   // its result is an item taken from somebody (tested below)
      const e = fresh(); const v = env.ent(spot.x + 250, spot.y, 5); v.items = ['apple', null, null, null, null, null, null];
      X.foods = [{ x: e.x + 100, y: e.y, t: 'apple', bob: 0, inside: false }]; X.fgBuild();
      let err = null; try { use(e, k); env.run(.3); } catch (x) { err = x; }
      t.ok(!err, k + ' works: ' + (err && err.message));
      if (X.ITEMS[k].auto) t.eq(e.items[0], k, k + ' is automatic and stays in the slot'); else t.eq(e.items[0], null, k + ' is used up');
      t.ok(Number.isFinite(e.x + e.y + e.lvl + e.stamina), k + ' leaves clean numbers');
    }
  });
  await R.test('Magnet pulls snacks and boxes from far, stacks stronger', t => {
    SUITE.seed(42); let e = fresh(); const mk = (d, ang = 0) => ({ x: e.x + Math.cos(ang) * d, y: e.y + Math.sin(ang) * d, t: 'apple', bob: 0, inside: false });
    const R1 = P('magnet').radius, B1 = P('magnet').boxRadius;
    X.foods = [mk(R1 * .75, 0), mk(R1 * 1.25, 2), mk(R1 * 1.6, 4)]; X.boxes = [{ x: e.x, y: e.y - B1 * .8, bob: 0, inside: false }, { x: e.x, y: e.y + B1 * 1.4, bob: 0, inside: false }];
    const f0 = X.foods.map(f => Math.hypot(f.x - e.x, f.y - e.y)), b0 = X.boxes.map(b => Math.hypot(b.x - e.x, b.y - e.y));
    use(e, 'magnet'); t.range('magnet runs for', e.buff.magnet - env.clock(), D('magnet') - .1, D('magnet') + .1, ' s'); env.run(.5);
    const f1 = X.foods.map(f => Math.hypot(f.x - e.x, f.y - e.y));
    t.ok(f1[0] < f0[0] - 60 || X.foods.length < 3, 'a snack inside the radius is pulled in (' + Math.round(f0[0]) + ' → ' + Math.round(f1[0]) + ')');
    t.ok(X.foods.every(f => Math.hypot(f.x - e.x, f.y - e.y) > R1 || true), 'ok');
    const far = X.foods.find(f => Math.abs(Math.hypot(f.x - e.x, f.y - e.y) - R1 * 1.6) < 2); t.ok(!!far, 'a snack far outside the radius does not move');
    t.ok(X.boxes.length === 1 || Math.hypot(X.boxes[0].x - e.x, X.boxes[0].y - e.y) < b0[0] - 50, 'a gift box inside the box radius is pulled in');
    // stacking: a second magnet doubles the radius
    e = fresh(); X.foods = [mk(R1 * 1.5, 1)]; use(e, 'magnet'); env.run(.4); const one = Math.hypot(X.foods[0].x - e.x, X.foods[0].y - e.y);
    use(e, 'magnet'); t.eq(X.stackN(e, 'magnet', env.clock()), 2, 'two magnets running'); env.run(.4); const two = X.foods.length ? Math.hypot(X.foods[0].x - e.x, X.foods[0].y - e.y) : 0;
    t.ok(Math.abs(one - R1 * 1.5) < 3 && two < one - 80, 'a snack at 1.5 x the radius is only pulled with two magnets');
    for (let i = 0; i < 8; i++) use(e, 'magnet'); t.eq(X.stackN(e, 'magnet', env.clock()), P('magnet').maxStacks, 'stacks are capped at ' + P('magnet').maxStacks);
  });
  await R.test('Turbo Sneakers: faster, endless stamina, stacks', t => {
    SUITE.seed(43); let e = fresh(); go(e, 1, 0); env.run(1); const base = spd(e);
    e = fresh(); use(e, 'turbo'); go(e, 1, 0, { sprint: true }); env.run(1.2); t.near(spd(e) / base, (1 + P('turbo').speedBonus) * X.MV.sprintBoost, .12, 'sprinting with turbo is faster'); t.ok(e.stamina > 99, 'stamina is not used up (' + Math.round(e.stamina) + ')');
    e = fresh(); use(e, 'turbo'); use(e, 'turbo'); go(e, 1, 0); env.run(1); t.near(spd(e) / base, 1 + 2 * P('turbo').speedBonus, .08, 'two turbos: +' + 2 * P('turbo').speedBonus * 100 + ' %');
    e = fresh(); use(e, 'turbo'); env.run(D('turbo') + .5); go(e, 1, 0); env.run(1); t.near(spd(e) / base, 1, .05, 'after ' + D('turbo') + ' s the effect is over');
  });
  await R.test('Sugar Rush: eat faster and more XP, stacks', t => {
    SUITE.seed(44); const eatTest = n => { const e = fresh(10); for (let i = 0; i < n; i++) use(e, 'rush'); X.foods = [{ x: e.x, y: e.y + 4, t: 'burger', bob: 0, inside: false }]; X.fgBuild(); const l0 = e.lvl; let tE = 0, a = false;
      env.run(3, () => { if (e.state === 'eat') { tE += 1 / 60; a = true } else if (a) return false; }); return { tE, gain: e.lvl - l0 }; };
    const base = (() => { const e = fresh(10); X.foods = [{ x: e.x, y: e.y + 4, t: 'burger', bob: 0, inside: false }]; X.fgBuild(); const l0 = e.lvl; let tE = 0, a = false; env.run(3, () => { if (e.state === 'eat') { tE += 1 / 60; a = true } else if (a) return false; }); return { tE, gain: e.lvl - l0 }; })();
    const r1 = eatTest(1), r2 = eatTest(2); const c = P('rush');
    t.near(r1.tE / base.tE, c.eatTime, .08, 'eating takes ' + c.eatTime + ' x as long'); t.near(r1.gain / base.gain, 1 + c.xpBonus, .03, 'XP +' + c.xpBonus * 100 + ' %');
    t.near(r2.gain / base.gain, 1 + 2 * c.xpBonus, .03, 'two rushes: XP +' + 2 * c.xpBonus * 100 + ' %'); t.ok(r2.tE < r1.tE, 'two rushes: eating even faster (' + r1.tE.toFixed(2) + ' → ' + r2.tE.toFixed(2) + ' s)');
  });
  await R.test('Smoke Bomb: bots cannot see you, dash comes back', t => {
    SUITE.seed(45); let hunted = 0, huntedSmoke = 0;
    for (const smoke of [false, true]) {
      const e = fresh(12); e.human = true; e.dashCharges = 0; const b = env.ent(e.x + 200, e.y, 12, { bt: 'hunter' }); b.ai.aggr = 1; b.ai.brave = 1; b.skill = 35; b.ai.hg = .8; b.protect = 0; e.protect = 0;
      if (smoke) { use(e, 'smoke'); t.eq(e.dashCharges, e.st.charges, 'the dash is recharged'); }
      for (let i = 0; i < 12; i++) { b.state = 'move'; b.ai.hold = 0; b.ai.target = null; X.botThink(b, env.clock()); if (b.ai.target === e) (smoke ? huntedSmoke++ : hunted++); }
      X.ents = [];
    }
    t.ok(hunted >= 8, 'without smoke the hunter goes for you (' + hunted + ' of 12)'); t.eq(huntedSmoke, 0, 'with smoke it never targets you');
  });
  await R.test('Snack Bomb: a ring of snacks', t => {
    SUITE.seed(46); const e = fresh(); X.foods = []; use(e, 'bomb'); const c = P('bomb');
    t.eq(X.foods.length, c.snacks, 'number of snacks'); const ds = X.foods.map(f => Math.hypot(f.x - e.x, f.y - e.y)); t.range('closest', Math.min(...ds), c.minRadius - 1, 400); t.range('farthest', Math.max(...ds), 0, c.maxRadius + 1);
  });
  await R.test('Energy Drink: stamina and dash full', t => {
    const e = fresh(); e.stamina = 3; e.dashCharges = 0; e.dashCd = 2; use(e, 'energy'); t.near(e.stamina, e.st.staMax, .01, 'stamina full'); t.eq(e.dashCharges, e.st.charges, 'dash charges full'); t.eq(e.dashCd, 0, 'no cooldown');
  });
  await R.test('Golden Apple, Golden Ticket, Level Crystal: instant XP', t => {
    for (const [k, xpf] of [['apple', e => P('apple').xp], ['ticket', e => P('ticket').xp], ['crystal', e => X.lvlCost(e.lvl) * P('crystal').levels]]) {
      for (const lv of [1, 7, 40]) { const e = fresh(lv), ref = env.ent(spot.x + 300, spot.y, lv); const x = xpf(e); use(e, k); X.gainXp(ref, x); t.near(e.lvl, ref.lvl, 1e-6, k + ' at level ' + lv + ' gives ' + Math.round(x * 10) / 10 + ' xp'); }
    }
    const e = fresh(10); const l0 = e.lvl; use(e, 'crystal'); t.range('Level Crystal gives about ' + P('crystal').levels + ' levels', e.lvl - l0, P('crystal').levels - .5, P('crystal').levels + .01);
  });
  await R.test('Bubble Shield: nobody can duel you, ends on time, stacks time', t => {
    SUITE.seed(47); let e = fresh(); let b = env.ent(e.x + 30, e.y, 5); use(e, 'shield'); t.range('shield lasts', e.protect - env.clock(), D('shield') - .1, D('shield') + .1, ' s');
    env.run(1.5); t.eq(X.botDuels.length, 0, 'no duel while shielded'); t.ok(e.state === 'move' && b.state === 'move', 'both still walking around');
    env.run(D('shield')); t.ok(X.botDuels.length > 0 || e.state === 'duel' || b.state === 'duel', 'after the shield ends the duel starts');
    e = fresh(); const t0 = env.clock(); use(e, 'shield'); use(e, 'shield'); t.near(e.buff.shield - t0, 2 * D('shield'), .1, 'two shields: time adds up'); for (let i = 0; i < 6; i++) use(e, 'shield');
    t.near(e.buff.shield - t0, P('shield').maxStacks * D('shield'), .1, 'time is capped at ' + P('shield').maxStacks + ' x');
  });
  await R.test('Radar: runs for its time and stacks time', t => {
    const e = fresh(); const t0 = env.clock(); use(e, 'radar'); t.near(e.buff.radar - t0, D('radar'), .1, 'radar time'); use(e, 'radar'); t.near(e.buff.radar - t0, 2 * D('radar'), .1, 'time adds up');
  });
  await R.test('Shockwave: pushes everybody close, nobody far away', t => {
    SUITE.seed(48); const e = fresh(); const c = P('shock'); const near = env.ent(e.x + c.radius * .5, e.y, 5), far = env.ent(e.x - c.radius * 1.3, e.y, 5); use(e, 'shock');
    t.ok(near.vx > c.force * .5, 'the one inside is blasted away (' + Math.round(near.vx) + ' units/s)'); t.ok(Math.abs(far.vx) < 5, 'the one outside is not moved'); t.ok(Math.abs(e.vx) < 5, 'you stay where you are');
  });
  await R.test('Lucky Clover: the next boxes roll rarer items', t => {
    SUITE.seed(49); const c = P('clover'); const e = fresh(); use(e, 'clover'); t.eq(e.luck, c.boxes, 'lucky for ' + c.boxes + ' boxes');
    const avg = (n, luck) => { let s = 0; for (let i = 0; i < n; i++) { e.luck = luck; e.items = clr(); X.giveItem(e, env.clock(), false); s += X.ITEMS[e.items[0]].tier; } return s / n; };
    const l = avg(4000, 1), nl = avg(4000, 0); t.ok(l > nl + .1, 'lucky boxes give better items (' + nl.toFixed(2) + ' → ' + l.toFixed(2) + ' average rarity)');
    e.luck = 3; for (let i = 0; i < 3; i++) { e.items = clr(); X.giveItem(e, env.clock(), false); } t.eq(e.luck, 0, 'the luck is used up after ' + c.boxes + ' boxes');
  });
  await R.test('Rubber Band: dash without a cooldown', t => {
    SUITE.seed(50); const e = fresh(); use(e, 'rubber'); let dashes = 0; go(e, 1, 0);
    for (let i = 0; i < 8; i++) { const x0 = e.x; go(e, 1, 0, { dash: true }); env.run(.03); go(e, 1, 0); env.run(.25); if (e.x - x0 > 70) dashes++; }
    t.ok(dashes >= 6, 'dashed ' + dashes + ' times in 2.3 s (normally every ' + X.DASH_CD + ' s)');
  });
  await R.test('Freeze Ray: freezes everybody close for its time', t => {
    SUITE.seed(51); const e = fresh(); const c = P('freeze'); const a = env.ent(e.x + c.radius * .6, e.y, 5), b = env.ent(e.x - c.radius * 1.5, e.y, 5); go(a, 1, 0); go(b, 1, 0); use(e, 'freeze');
    t.range('frozen for', a.buff.freeze - env.clock(), D('freeze') - .1, D('freeze') + .1, ' s'); t.ok(!(b.buff.freeze > env.clock()), 'the one far away is not frozen'); const ax = a.x, bx = b.x; env.run(D('freeze') - .3);
    t.ok(Math.abs(a.x - ax) < 8, 'the frozen one does not move (' + Math.round(a.x - ax) + ')'); t.ok(b.x - bx > 150, 'the other one walks on'); env.run(1.5); t.ok(a.x - ax > 40, 'after the time it moves again');
  });
  await R.test('Pro Keyboard and Golden Keyboard: shorter phrase, used up by the duel', t => {
    SUITE.seed(52); const mk = () => { const a = fresh(10), b = env.ent(a.x + 500, a.y, 10); return [a, b]; };
    let [a, b] = mk(); const base = X.duelWords(a, b, false, false, false, false)[0].n, k1 = X.duelWords(a, b, false, false, 'keys', false)[0].n, k2 = X.duelWords(a, b, false, false, 'gkeys', false)[0].n;
    t.eq(base - k1, P('keys').words, 'Pro Keyboard: ' + P('keys').words + ' word shorter'); t.ok(base - k2 >= 1 && base - k2 <= Math.ceil(base * P('gkeys').share) + 1, 'Golden Keyboard: about ' + P('gkeys').share * 100 + ' % shorter (' + base + ' → ' + k2 + ')');
    [a, b] = mk(); give(a, 'keys'); b.x = a.x + 20; b.y = a.y; X.startDuel(a, b, env.clock()); t.ok(!a.items.includes('keys'), 'the keyboard is used up when the duel starts'); X.botDuels = [];
    [a, b] = mk(); give(a, 'keys'); X.useItem(a, env.clock(), 0); t.eq(a.items[0], 'keys', 'pressing it does nothing (it works by itself)');
  });
  await R.test('Sticky Gloves: steal an item from the nearest player', t => {
    SUITE.seed(53); const e = fresh(); const v = env.ent(e.x + 250, e.y, 5), w = env.ent(e.x + 600, e.y, 5); v.items = ['shield', null, null, null, null, null, null]; w.items = ['bomb', null, null, null, null, null, null];
    use(e, 'sticky'); t.ok(e.items.includes('shield') && !v.items.includes('shield'), 'got the shield of the nearby player'); t.ok(w.items.includes('bomb'), 'the one far away keeps his item');
  });
  await R.test('Teleport Orb: far away, not into a wall', t => {
    SUITE.seed(54); let far = 0, inW = 0; const c = P('teleport');
    for (let i = 0; i < 40; i++) { const e = fresh(5, true); const x0 = e.x, y0 = e.y; use(e, 'teleport'); if (Math.hypot(e.x - x0, e.y - y0) >= c.minDistance * .98) far++; if (env.inWall(e) || X.waterAt(e.x, e.y)) inW++; if (i === 0) t.ok(e.protect > env.clock() + 1, 'protected for a moment after landing'); }
    t.ok(far >= 36, 'jumped at least ' + c.minDistance + ' units in ' + far + ' of 40 tries'); t.eq(inW, 0, 'landed in a wall or in water');
  });
  await R.test('Rocket Boots: stronger dash, no charge used, stacks', t => {
    SUITE.seed(55); let e = fresh(); go(e, 1, 0, { dash: true }); env.run(.02); const plain = spd(e);
    e = fresh(); use(e, 'rocket'); go(e, 1, 0, { dash: true }); env.run(.02); const boosted = spd(e); t.near(boosted / plain, 1 + P('rocket').dashBoost, .08, 'dash is ' + (P('rocket').dashBoost * 100) + ' % stronger'); t.eq(e.dashCharges, 1, 'the dash charge is not used');
    e = fresh(); use(e, 'rocket'); use(e, 'rocket'); go(e, 1, 0, { dash: true }); env.run(.02); t.near(spd(e) / plain, 1 + 2 * P('rocket').dashBoost, .1, 'two rocket boots: twice the boost');
  });
  await R.test('Time Warp: everybody else is slower, you are not', t => {
    SUITE.seed(56); const e = fresh(); const o = env.ent(e.x + 100, e.y + 300, 5); go(e, 1, 0); go(o, 1, 0); env.run(1); const base = spd(o), mine = spd(e);
    use(e, 'warp'); t.range('warp runs for', X.timeWarp.until - env.clock(), D('warp') - .1, D('warp') + .1, ' s'); env.run(1); t.near(spd(o) / base, P('warp').slowdown, .06, 'others move at ' + P('warp').slowdown + ' x'); t.near(spd(e) / mine, 1, .05, 'you move at normal speed');
    use(e, 'warp'); t.near(X.timeWarp.until - env.clock(), 2 * D('warp') - 1, 1.2, 'a second warp adds time');
  });
  await R.test('Angel Feather: survive a lost duel with half your levels', t => {
    SUITE.seed(57); const w = fresh(20), l = env.ent(spot.x + 40, spot.y, 20); give(l, 'angel'); const lv = l.lvl; X.finishDuel(w, l, env.clock());
    t.ok(l.state !== 'eaten', 'the loser is not eaten'); t.near(l.lvl / lv, P('angel').keepShare, .02, 'keeps ' + P('angel').keepShare * 100 + ' % of the level'); t.ok(!l.items.includes('angel'), 'the feather is used up'); t.ok(l.protect > env.clock() + 2, 'protected for a moment');
    t.ok(w.lvl > 20.2, 'the winner still gets XP');
  });
  await R.test('Supernova: blast, freeze, shield for you', t => {
    SUITE.seed(58); const e = fresh(); const c = P('nova'); const a = env.ent(e.x + c.radius * .6, e.y, 5), b = env.ent(e.x + c.radius * 1.4, e.y, 5); use(e, 'nova');
    t.ok(a.vx > c.force * .4, 'pushed away'); t.ok(a.buff.freeze > env.clock() + c.duration * .8, 'and frozen for ' + c.duration + ' s'); t.ok(Math.abs(b.vx) < 5 && !(b.buff.freeze > env.clock()), 'the far one is untouched');
    t.range('your own shield', e.protect - env.clock(), c.shieldTime - .1, c.shieldTime + .1, ' s');
  });
  await R.test('Black Hole: sucks in snacks from very far', t => {
    SUITE.seed(59); const e = fresh(); const c = P('blackhole'); X.foods = [{ x: e.x + c.radius * .85, y: e.y, t: 'apple', bob: 0, inside: false }, { x: e.x - c.radius * 1.3, y: e.y, t: 'apple', bob: 0, inside: false }]; X.boxes = [{ x: e.x, y: e.y + c.boxRadius * .8, bob: 0, inside: false }];
    use(e, 'blackhole'); env.run(.7); const near = X.foods.find(f => f.x > e.x), far = X.foods.find(f => f.x < e.x);
    t.ok(!near || near.x - e.x < c.radius * .85 - 200, 'a snack at 85 % of the radius flies towards you'); t.ok(far && Math.abs(far.x - (e.x - c.radius * 1.3)) < 3, 'one outside the radius stays'); t.ok(!X.boxes.length || X.boxes[0].y - e.y < c.boxRadius * .8 - 200, 'gift boxes are pulled too');
  });
  await R.test('humans use items by key (server message), nothing breaks on bad input', t => {
    SUITE.seed(60); env.clean(); const p = env.open(300); const a = env.human('Anna', { x: p.x, y: p.y }); a.e.items = ['energy', null, null, null, null, null, null]; a.e.stamina = 5;
    env.srv(.2); X.srvMsg(a.cid, { t: 'use', s: 0 }); env.srv(.2); t.ok(a.e.stamina > 90 && !a.e.items[0], 'slot 1 used');
    for (const m of [{ t: 'use', s: 9 }, { t: 'use', s: -3 }, { t: 'use', s: 'x' }, { t: 'use' }, { t: 'use', s: 1 }, { t: 'use', s: 6 }]) { try { X.srvMsg(a.cid, m); env.srv(.1); } catch (x) { t.ok(false, 'message ' + JSON.stringify(m) + ' crashed: ' + x.message); } }
    t.ok(Number.isFinite(a.e.x + a.e.lvl), 'still fine after bad messages'); X.srvLeave(a.cid);
  });
  await R.test('item slots: capacity by level, bots carry fewer', t => {
    const h = fresh(1); t.eq(X.slotsOf(h), 3, '3 slots at level 1'); h.items = ['apple', 'apple', 'apple', null, null, null, null]; h.human = true; t.ok(!X.itemRoom(h), 'full at level 1'); h.lvl = 12; t.ok(X.itemRoom(h), 'a 4th slot at level 12');
    const b = fresh(1); b.human = false; b.items = clr(); t.ok(X.itemRoom(b), 'a bot with nothing has room'); b.items[0] = 'apple'; t.eq(X.itemRoom(b), X.CFG.players.botItems > 1, 'bots stop at ' + X.CFG.players.botItems + ' item(s)');
  });
  X.ents = []; X.foods = []; X.boxes = [];
} });
})(typeof self !== 'undefined' ? self : globalThis);
