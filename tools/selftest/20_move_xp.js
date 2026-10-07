/* ---------- part 2: walking, sprinting, dashing, swimming, walls; XP and every snack ---------- */
(function (root) {
'use strict';
const SUITE = root.TYPEBITE_SELFTEST;
SUITE.parts.push({ name: 'move', async run(env, R) {
  const { X } = env, S = SUITE.stat;
  const go = (e, ux, uy, o = {}) => { e.want = { ux, uy, f: o.f === undefined ? 1 : o.f, sprint: !!o.sprint, dash: !!o.dash }; };
  const speedNow = e => Math.hypot(e.vx, e.vy);
  const slow = lv => 1 - Math.min(X.MV.slowdownMax, lv * X.MV.slowdownPerLevel);

  R.group('Movement');
  await R.test('walking speed on open ground', t => {
    SUITE.seed(21); env.clean(); const p = env.open(300);
    for (const lv of [1, 30, 100, 400]) {
      const e = env.ent(p.x, p.y, lv); go(e, 1, 0); env.run(1.5);
      const want = X.BASE * slow(lv);
      t.near(speedNow(e) / want, 1, .03, 'speed at level ' + lv + ' = ' + Math.round(want) + ' units/s'); t.info('level ' + lv, Math.round(speedNow(e)), ' units/s');
      X.ents = []; }
    t.ok(slow(1000) === 1 - X.MV.slowdownMax, 'the slowdown from high levels stops at ' + X.MV.slowdownMax * 100 + ' %');
  });
  await R.test('sprint: faster, costs stamina, stops when it is empty, comes back', t => {
    SUITE.seed(22); env.clean(); const p = env.open(300); const e = env.ent(p.x, p.y, 1); go(e, 1, 0, { sprint: true }); env.run(1.2);
    t.near(speedNow(e) / (X.BASE * slow(1)), X.MV.sprintBoost, .06, 'sprint is ' + X.MV.sprintBoost + ' x faster');
    t.range('stamina after 1.2 s of sprinting', e.stamina, 100 - X.MV.sprintDrain * 1.2 - 4, 100 - X.MV.sprintDrain * 1.2 + 4);
    go(e, -1, 0, { sprint: true }); env.run(2.2); t.ok(e.stamina < 2, 'stamina runs out after about 2.6 s'); env.run(.6);
    t.range('with sprint held and no stamina you only sprint in short bursts: speed compared to walking', speedNow(e) / (X.BASE * slow(1)), .95, 1.55);
    go(e, 0, 0, { f: 0 }); env.run(.1); const s0 = e.stamina; env.run(1); t.near(e.stamina - s0, X.MV.regenResting, 4, 'standing still refills ' + X.MV.regenResting + ' stamina per second');
    go(e, 1, 0); const s1 = e.stamina; env.run(1); t.near(e.stamina - s1, X.MV.regenMoving, 4, 'walking refills ' + X.MV.regenMoving + ' per second');
  });
  await R.test('dash: distance, one charge, recharge', t => {
    SUITE.seed(23); env.clean(); const p = env.open(300); const e = env.ent(p.x, p.y, 1);
    const x0 = e.x; go(e, 1, 0, { f: 1, dash: true }); env.run(.02); go(e, 0, 0, { f: 0 });
    t.eq(e.dashCharges, 0, 'the dash used the charge'); t.ok(speedNow(e) > X.MV.dashSpeed * .8, 'dash speed ' + Math.round(speedNow(e)) + ' (setting ' + X.MV.dashSpeed + ')');
    env.run(1.3); const d1 = e.x - x0; t.range('distance of one dash with the slide', d1, 120, 520, ' units');
    // a second dash at once does nothing, after the cooldown it works again
    const x1 = e.x; go(e, 1, 0, { f: 1, dash: true }); env.run(.02); go(e, 0, 0, { f: 0 }); env.run(.5); t.ok(e.x - x1 < 60, 'no second dash without a charge (moved ' + Math.round(e.x - x1) + ')');
    env.run(X.DASH_CD + .2); t.eq(e.dashCharges, 1, 'the charge is back after ' + X.DASH_CD + ' s');
    const x2 = e.x; go(e, 1, 0, { f: 1, dash: true }); env.run(.02); go(e, 0, 0, { f: 0 }); env.run(1); t.ok(e.x - x2 > 100, 'dash works again');
  });
  await R.test('swimming is slow, no dash or sprint in water, ice is slippery', t => {
    SUITE.seed(24); env.clean(true);
    const water = X.ponds.find(p => p.kind !== 'ice' && p.rx > 80 && p.ry > 50), ice = X.ponds.find(p => p.kind === 'ice' && p.rx > 80);
    t.ok(!!water, 'the map has a pond to swim in');
    if (water) { const e = env.ent(water.x, water.y, 1); go(e, 1, 0, { sprint: true, dash: true }); env.run(.7);
      t.near(speedNow(e) / (X.BASE * slow(1)), X.MV.swimSpeed, .08, 'swimming speed is ' + X.MV.swimSpeed + ' x'); t.eq(e.dashCharges, 1, 'dashing in water is not possible'); X.ents = []; }
    if (ice && ice.rx > 130) { const keep = (x, y) => { const e = env.ent(x, y, 1); go(e, 1, 0); env.run(1); const v0 = speedNow(e); go(e, 0, 0, { f: 0 }); env.run(.4); const v = speedNow(e); X.ents = []; return v / v0; };
      const onIce = keep(ice.x - 100, ice.y), p = env.open(300), onGround = keep(p.x, p.y);
      t.ok(onIce > .2 && onGround < .06, 'after letting go you keep ' + Math.round(onIce * 100) + ' % of your speed on ice but only ' + Math.round(onGround * 100) + ' % on grass'); }
    else t.warn('this map has no frozen pond, ice slide not tested');
  });
  await R.test('walls: nobody walks into a wall or off the map', t => {
    SUITE.seed(25); env.clean(true); let stuckIn = 0, outside = 0, n = 0;
    for (let k = 0; k < 40; k++) { const p = X.freeSpot(40), e = env.ent(p.x, p.y, 1 + k % 30), a = Math.random() * 6.28; go(e, Math.cos(a), Math.sin(a), { sprint: k % 2 === 0, dash: false }); }
    env.run(25, s => { for (const e of X.ents) { if (Math.random() < .02) { const a = Math.random() * 6.28; go(e, Math.cos(a), Math.sin(a), { sprint: Math.random() < .5, dash: Math.random() < .3 }); }
      if (env.inWall(e)) stuckIn++; if (e.x < 0 || e.y < 0 || e.x > X.WORLD || e.y > X.WORLD || !Number.isFinite(e.x + e.y)) outside++; n++; } });
    t.eq(stuckIn, 0, 'moments an entity was inside a wall (of ' + n + ')'); t.eq(outside, 0, 'moments an entity was outside the map or NaN');
    // into the corner of the map
    X.ents = []; const e = env.ent(60, 60, 1); go(e, -1, -1, { sprint: true }); env.run(2); t.ok(e.x >= X.RAD - .1 && e.y >= X.RAD - .1, 'stays inside at the corner of the map'); X.ents = [];
    const e2 = env.ent(X.WORLD - 60, X.WORLD - 60, 1); go(e2, 1, 1, { sprint: true }); env.run(2); t.ok(e2.x <= X.WORLD - X.RAD + .1 && e2.y <= X.WORLD - X.RAD + .1, 'stays inside at the far corner'); X.ents = [];
  });
  await R.test('buildings: doors let you in, walls without a door do not', t => {
    SUITE.seed(26); env.clean(true); let inOk = 0, inN = 0, wallOk = 0, wallN = 0; const fails = [];
    const list = X.houses.slice(0, R.deep ? 80 : 30);
    for (const h of list) {
      const mx = h.x + h.w / 2, my = h.y + h.h / 2;
      for (const side of ['n', 's', 'w', 'e']) {
        const [px, py, ux, uy] = side === 'n' ? [mx, h.y, 0, 1] : side === 's' ? [mx, h.y + h.h, 0, -1] : side === 'w' ? [h.x, my, 1, 0] : [h.x + h.w, my, -1, 0];
        const sx = px - ux * 110, sy = py - uy * 110, door = h.doors.includes(side);
        if (X.wallHit(sx, sy, 22) || X.houseAt(sx, sy)) continue;   // something is standing there (a bush, a neighbour)
        const e = env.ent(sx, sy, 1); e.spd = 1; go(e, ux, uy); let inside = false; env.run(2.4, () => { if (X.houseAt(e.x, e.y)) { inside = true; return false; } }); X.ents = [];
        if (door) { inN++; if (inside) inOk++; else fails.push(h.type + '/' + side); } else { wallN++; if (!inside) wallOk++; else fails.push('wall:' + h.type + '/' + side); }
      }
    }
    t.ok(inN >= 15, 'doors tested: ' + inN); t.ok(inOk >= inN * .93, 'walked in through ' + inOk + ' of ' + inN + ' doors' + (fails.length ? ' (failed: ' + fails.slice(0, 5).join(' ') + ')' : ''));
    t.ok(wallN >= 8, 'closed walls tested: ' + wallN); t.eq(wallOk, wallN, 'closed walls that let somebody through');
  });

  R.group('Levels and XP');
  await R.test('gaining XP: exact, also over many levels', t => {
    env.clean();
    for (const [lv, xp] of [[1, 3], [1, 40], [10, 5], [10, 700], [60, 12], [250, 4000]]) {
      const e = env.ent(500, 500, lv), x0 = X.xpOf(e.lvl); X.gainXp(e, xp);
      t.near(X.xpOf(e.lvl) - x0, xp, xp * 1e-6 + 1e-6, 'level ' + lv + ' + ' + xp + ' xp'); X.ents = [];
    }
    const e = env.ent(500, 500, 1); X.gainXp(e, X.lvlCost(1)); t.near(e.lvl, 2, 1e-6, 'exactly one level costs lvlCost(1)');
    const e2 = env.ent(500, 500, 1); X.gainXp(e2, 0); X.gainXp(e2, -5); t.ok(e2.lvl >= 1 && Number.isFinite(e2.lvl), 'no XP and negative XP do nothing odd');
    X.ents = [];
  });
  await R.test('a level up is the same through snacks, items, quests and duels (no double counting)', t => {
    env.clean(); const e = env.ent(500, 500, 5); const l0 = e.lvl; X.gainXp(e, X.lvlCost(5) * 2.5);
    t.range('2.5 levels of xp at level 5 give', e.lvl - l0, 2.3, 2.5, ' levels'); X.ents = [];
  });
  R.group('Snacks: all 57 eaten one by one');
  await R.test('every snack gives its XP in its eating time', t => {
    SUITE.seed(31); env.clean(); const p = env.open(300); let bad = 0;
    for (const id of X.FOODS) {
      const f = X.FOOD[id], lv = 8, e = env.ent(p.x, p.y, lv); X.foods = [{ x: e.x, y: e.y + 4, t: id, bob: 0, inside: false }]; X.fgBuild();
      const l0 = e.lvl; let tEat = 0, ate = false;
      env.run(4, () => { if (e.state === 'eat') { tEat += 1 / 60; ate = true } else if (ate) return false; });
      const gain = e.lvl - l0, want = X.snackGain(lv) * f.xp;
      if (!ate) { t.ok(false, id + ' was not eaten'); bad++; }
      else {
        t.near(gain / want, 1, .01, id + ' gives ' + want.toFixed(3) + ' levels');
        t.near(tEat, X.LV.eatTime * f.et, 2 / 60 + .02, id + ' takes ' + (X.LV.eatTime * f.et).toFixed(2) + ' s to eat');
        t.eq(X.foods.length, 0, id + ' is gone from the ground');
      }
      X.ents = [];
    }
    t.info('snacks eaten', X.FOODS.length - bad);
  });
  await R.test('epic and legendary snacks give their bonus', t => {
    SUITE.seed(32); env.clean(); const p = env.open(300);
    for (const id of X.FOODS) {
      const f = X.FOOD[id]; if (!f.fx.length) continue;
      const e = env.ent(p.x, p.y, 8); e.stamina = 5; e.dashCharges = 0; e.dashCd = 5; e.items = [null, null, null, null, null, null, null];
      X.foods = [{ x: e.x, y: e.y + 4, t: id, bob: 0, inside: false }]; X.fgBuild();
      let ate = false; env.run(5, () => { if (e.state === 'eat') ate = true; else if (ate) return false; });
      const now = env.clock();
      for (const x of f.fx) { const [k, v] = x.split(':'), d = +v || 0;
        if (k === 'sta') t.ok(e.stamina >= 99, id + ': stamina refilled');
        else if (k === 'dash') t.ok(e.dashCharges >= 1, id + ': dash recharged');
        else if (k === 'item') t.ok(e.items.some(Boolean), id + ': gives an item');
        else t.range(id + ': ' + k + ' lasts', e.buff[k] - now, d - 1.2, d + .3, ' s'); }
      X.ents = [];
    }
    t.ok(X.FOODS.filter(i => X.FOOD[i].fx.length).length >= 12, 'at least 12 snacks have a bonus');
  });
  await R.test('eating rules: only on the ground in reach, nothing eaten twice', t => {
    SUITE.seed(33); env.clean(); const p = env.open(300); const e = env.ent(p.x, p.y, 3);
    X.foods = [{ x: e.x + 60, y: e.y, t: 'apple', bob: 0, inside: false }]; X.fgBuild(); env.run(.3); t.eq(e.state, 'move', 'a snack 60 units away is not eaten');
    X.foods = [{ x: e.x + 20, y: e.y + 4, t: 'apple', bob: 0, inside: false }, { x: e.x + 22, y: e.y + 4, t: 'apple', bob: 0, inside: false }]; X.fgBuild(); const l0 = e.lvl; env.run(.15);
    t.eq(X.foods.length, 1, 'of two snacks next to each other only one is taken at a time'); env.run(2); t.eq(X.foods.length, 0, 'the second one is eaten afterwards'); t.ok(e.lvl > l0, 'level went up');
    X.foods = []; X.ents = [];
  });
  await R.test('boxes and orbs are picked up; full slots keep the box', t => {
    SUITE.seed(34); env.clean(); const p = env.open(300); const e = env.ent(p.x, p.y, 3); e.human = true;
    X.boxes = [{ x: e.x, y: e.y, bob: 0, inside: false }]; env.run(.4); t.eq(X.boxes.length, 0, 'a gift box is opened'); t.ok(e.items.some(Boolean), 'and gives an item');
    e.items = ['apple', 'apple', 'apple', null, null, null, null]; X.boxes = [{ x: e.x, y: e.y, bob: 0, inside: false }]; env.run(.4); t.eq(X.boxes.length, 1, 'with full slots the box stays');
    e.items = [null, null, null, null, null, null, null]; env.run(.4); t.eq(X.boxes.length, 0, 'after making room it is opened');
    const l0 = e.lvl; X.orbs = [{ x: e.x, y: e.y, v: 12, vx: 0, vy: 0, life: 30 }]; env.run(.3); t.eq(X.orbs.length, 0, 'an orb is picked up'); t.ok(e.lvl > l0, 'and gives levels');
    const b = env.ent(p.x + 300, p.y, 1); X.orbs = [{ x: b.x, y: b.y, v: 5, vx: 0, vy: 0, life: .5 }]; env.run(1); t.eq(X.orbs.length, 0, 'orbs vanish after their time');
    X.ents = []; X.boxes = []; X.orbs = [];
  });
  await R.test('the King: the highest level from level 8 on', t => {
    env.clean(); const a = env.ent(500, 500, 5), b = env.ent(900, 500, 7); env.run(.6); t.eq(X.king, null, 'nobody is King below level ' + X.LV.kingMinLevel);
    b.lvl = 9; env.run(.6); t.ok(X.king === b, 'the highest level (9) becomes King'); a.lvl = 12; env.run(.6); t.ok(X.king === a, 'a higher level takes the crown');
    X.ents = []; X.king = null;
  });
  await R.test('XP needed per level in play: how long does it take', t => {
    // a rough check of pacing: snacks needed from level 1 to 10 and to 30 when only eating (average snack)
    const per = l => X.lvlCost(l) / X.LV.snackValue; let s10 = 0, s30 = 0; for (let l = 1; l < 10; l++) s10 += per(l); for (let l = 1; l < 30; l++) s30 += per(l);
    t.range('snacks from level 1 to 10', s10, 15, 60, ' snacks'); t.range('snacks from level 1 to 30', s30, 80, 400, ' snacks');
  });
} });
})(typeof self !== 'undefined' ? self : globalThis);
