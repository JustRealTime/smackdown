/* ---------- part 4: all 38 perks, each at every rank ---------- */
(function (root) {
'use strict';
const SUITE = root.TYPEBITE_SELFTEST;
SUITE.parts.push({ name: 'perks', async run(env, R) {
  const { X } = env, S = SUITE.stat;
  const go = (e, ux, uy, o = {}) => { e.want = { ux, uy, f: o.f === undefined ? 1 : o.f, sprint: !!o.sprint, dash: !!o.dash }; };
  const spd = e => Math.hypot(e.vx, e.vy);
  const C = id => X.PK[id];
  let spot;
  // an entity with one perk at a rank in a clean world
  const mk = (id, rank, lvl = 10, o = {}) => { const e = env.ent(spot.x, spot.y, lvl, o); e.perks = id ? { [id]: rank } : {}; X.calcStats(e); return e; };
  const setup = real => { env.clean(real); spot = env.open(300); };
  // eat one snack and report what it gave
  const eatOne = (e, id = 'burger') => { X.foods = [{ x: e.x, y: e.y + 4, t: id, bob: 0, inside: false }]; X.fgBuild(); const l0 = e.lvl; let tE = 0, a = false; env.run(4, () => { if (e.state === 'eat') { tE += 1 / 60; a = true } else if (a) return false; }); return { gain: e.lvl - l0, time: tE }; };
  const ranks = id => Array.from({ length: X.PERK_BY[id].max }, (_, i) => i + 1);

  R.group('Perks: Feast');
  await R.test('Gourmet: more level from snacks', t => {
    SUITE.seed(61); setup(); const base = eatOne(mk(null, 0)).gain;
    for (const r of ranks('gourmet')) { setup(); const g = eatOne(mk('gourmet', r)).gain; t.near(g / base, 1 + r * C('gourmet').perRank, .02, 'rank ' + r + ': +' + Math.round(r * C('gourmet').perRank * 100) + ' %'); }
  });
  await R.test('Quick Bite: eating is faster, never below the floor', t => {
    SUITE.seed(62); setup(); const base = eatOne(mk(null, 0)).time;
    for (const r of ranks('quickbite')) { setup(); const tm = eatOne(mk('quickbite', r)).time; const want = Math.max(C('quickbite').floor, 1 - r * C('quickbite').perRank); t.near(tm / base, want, .06, 'rank ' + r + ': eating takes ' + Math.round(want * 100) + ' %'); }
  });
  await R.test('Snack Vacuum: snacks within reach fly to you', t => {
    SUITE.seed(63);
    for (const r of ranks('vacuum')) { setup(); const e = mk('vacuum', r), reach = r * C('vacuum').perRank; X.foods = [{ x: e.x + reach * .7, y: e.y, t: 'apple', bob: 0, inside: false }, { x: e.x - reach * 1.5 - 20, y: e.y + 30, t: 'apple', bob: 0, inside: false }]; X.fgBuild();
      const f1 = X.foods[0], f2 = X.foods[1], p2 = f2.x; env.run(.5); t.ok(!X.foods.includes(f1) || f1.x < e.x + reach * .7 - 15, 'rank ' + r + ' (' + reach + ' units): a near snack is pulled in'); t.ok(f2.x === p2 || Math.abs(f2.x - p2) < 1, 'a snack outside the reach stays'); }
  });
  await R.test('Jackpot: some snacks give triple', t => {
    SUITE.seed(64); const N = 1500;
    for (const r of [1, X.PERK_BY.jackpot.max]) { setup(); const e = mk('jackpot', r, 10), one = X.snackGain(10) * X.FOOD.apple.xp; let hit = 0;
      for (let i = 0; i < N; i++) { e.lvl = 10; X.foods = [{ x: e.x, y: e.y + 4, t: 'apple', bob: 0, inside: false }]; X.fgBuild(); env.run(1.2, () => { if (e.state === 'move' && e.lvl > 10.0001) return false; }); if (e.lvl - 10 > one * 2) hit++; }
      t.ok(S.fits(hit, N, r * C('jackpot').perRank), 'rank ' + r + ': ' + (hit / N * 100).toFixed(1) + ' % of snacks gave triple (should be ' + r * C('jackpot').perRank * 100 + ' %)'); }
  });
  await R.test('Snack Combo: eating in a row stacks, up to the chain limit', t => {
    SUITE.seed(65); setup(); const r = 2, e = mk('combo', r, 10), one = X.snackGain(10) * X.FOOD.apple.xp, gains = [];
    for (let i = 0; i < 8; i++) { e.lvl = 10; gains.push(eatOne(e, 'apple').gain / one); }
    const c = C('combo'); t.near(gains[0], 1, .03, 'the first snack is normal'); t.near(gains[1], 1 + r * c.perRank * 1, .04, 'second in a row: +' + r * c.perRank * 100 + ' %');
    t.near(gains[7], 1 + r * c.perRank * c.maxChain, .05, 'capped at a chain of ' + c.maxChain + ': +' + r * c.perRank * c.maxChain * 100 + ' %');
  });
  await R.test('Orb Hunter and Treasure Nose', t => {
    SUITE.seed(66); setup(); const orb = e => { X.orbs = [{ x: e.x, y: e.y, v: 20, vx: 0, vy: 0, life: 30 }]; const l0 = X.xpOf(e.lvl); env.run(.2); return X.xpOf(e.lvl) - l0; };
    const base = orb(mk(null, 0, 10)); for (const r of ranks('orbhunter')) { setup(); t.near(orb(mk('orbhunter', r, 10)) / base, 1 + r * C('orbhunter').perRank, .03, 'Orb Hunter rank ' + r); }
    setup(); const e = mk('nose', 1); X.boxes = [{ x: e.x + C('nose').radius * .8, y: e.y, bob: 0, inside: false }, { x: e.x, y: e.y + C('nose').radius * 1.6, bob: 0, inside: false }]; X.orbs = [{ x: e.x - C('nose').radius * .8, y: e.y, v: 5, vx: 0, vy: 0, life: 30 }];
    const bx = X.boxes[0].x, by2 = X.boxes[1].y, ox = X.orbs[0].x; env.run(.5); t.ok(!X.boxes.includes(undefined) && (X.boxes.length < 2 || X.boxes[0].x < bx - 40), 'a gift box 80 % of the radius away is pulled to you'); const far = X.boxes.find(b => Math.abs(b.y - by2) < 2); t.ok(!!far, 'a box beyond the radius stays'); t.ok(!X.orbs.length || X.orbs[0].x > ox + 40, 'an orb is pulled too');
  });
  await R.test('Cozy Eater: more level for snacks inside buildings', t => {
    SUITE.seed(67); setup(true); const h = X.houses.find(h => h.w > 300 && h.h > 220); let p = null;
    for (let i = 0; i < 80 && !p; i++) { const x = h.x + 60 + Math.random() * (h.w - 120), y = h.y + 60 + Math.random() * (h.h - 120); if (!X.wallHit(x, y, 30)) p = { x, y }; }
    t.ok(!!p, 'found a free spot inside a building'); if (!p) return;
    const inside = (id, r) => { env.clean(true); const e = env.ent(p.x, p.y, 10); e.perks = id ? { [id]: r } : {}; X.calcStats(e); return eatOne(e, 'apple').gain; };
    const base = inside(null, 0); for (const r of ranks('cozy')) t.near(inside('cozy', r) / base, 1 + r * C('cozy').perRank, .03, 'rank ' + r + ': +' + r * C('cozy').perRank * 100 + ' % inside');
    setup(true); const g1 = eatOne(mk('cozy', 3)).gain; setup(); const g0 = eatOne(mk(null, 0)).gain; t.near(g1 / g0, 1, .03, 'no bonus outside');
  });

  R.group('Perks: Sprint');
  await R.test('Swift Feet, Sprinter, Big Lungs, Second Wind: the numbers', t => {
    SUITE.seed(68); setup(); const slow = X.BASE * (1 - 10 * X.MV.slowdownPerLevel);
    for (const r of ranks('swift')) { setup(); const e = mk('swift', r, 10); go(e, 1, 0); env.run(1.2); t.near(spd(e) / slow, 1 + r * C('swift').perRank, .03, 'Swift Feet rank ' + r + ': +' + Math.round(r * C('swift').perRank * 100) + ' % speed'); }
    for (const r of ranks('sprintboost')) { setup(); const e = mk('sprintboost', r, 10); go(e, 1, 0, { sprint: true }); env.run(1); t.near(spd(e) / slow, X.MV.sprintBoost + r * C('sprintboost').perRank, .05, 'Sprinter rank ' + r); }
    for (const r of ranks('lungs')) { setup(); const e = mk('lungs', r, 10); t.near(e.st.staMax, X.MV.staminaMax * (1 + r * C('lungs').perRank), .01, 'Big Lungs rank ' + r + ': stamina ' + e.st.staMax); e.stamina = 0; go(e, 0, 0, { f: 0 }); env.run(4); t.near(e.stamina, Math.min(e.st.staMax, 4 * X.MV.regenResting), 4, 'refills to the new maximum'); }
    for (const r of ranks('regen')) { setup(); const e = mk('regen', r, 10); e.stamina = 0; go(e, 0, 0, { f: 0 }); env.run(1); t.near(e.stamina, X.MV.regenResting * (1 + r * C('regen').perRank), 3, 'Second Wind rank ' + r + ': refill per second'); }
  });
  await R.test('Quick Dash, Long Dash, Ice Slide, Double Dash', t => {
    SUITE.seed(69);
    for (const r of ranks('dashcd')) { setup(); const e = mk('dashcd', r, 10); go(e, 1, 0, { dash: true }); env.run(.02); go(e, 0, 0, { f: 0 }); let back = -1; env.run(3.5, s => { if (e.dashCharges >= 1) { back = s; return false; } });
      const want = X.DASH_CD * Math.max(C('dashcd').floor, 1 - r * C('dashcd').perRank); t.near(back, want, .15, 'Quick Dash rank ' + r + ': recharge ' + want.toFixed(2) + ' s'); }
    setup(); let e = mk(null, 0, 10); go(e, 1, 0, { dash: true }); env.run(.02); const v0 = spd(e);
    for (const r of ranks('longdash')) { setup(); e = mk('longdash', r, 10); go(e, 1, 0, { dash: true }); env.run(.02); t.near(spd(e) / v0, 1 + r * C('longdash').perRank, .04, 'Long Dash rank ' + r + ': dash ' + Math.round(r * C('longdash').perRank * 100) + ' % stronger'); }
    const glide = r => { setup(); const e = r ? mk('slide', r, 10) : mk(null, 0, 10); const x0 = e.x; go(e, 1, 0, { dash: true }); env.run(.02); const st = e.slideT; go(e, 0, 0, { f: 0 }); env.run(1.6); return { d: e.x - x0, st }; };
    const g0 = glide(0); for (const r of ranks('slide')) { const g = glide(r); t.near(g.st / g0.st, 1 + r * C('slide').perRank, .05, 'Ice Slide rank ' + r + ': the slide lasts ' + Math.round(r * C('slide').perRank * 100) + ' % longer'); t.info('Ice Slide rank ' + r + ' distance', Math.round((g.d / g0.d - 1) * 100) + ' % farther'); if (r === ranks('slide').length && g.d / g0.d < 1.12) t.warn('Ice Slide at the top rank only adds ' + Math.round((g.d / g0.d - 1) * 100) + ' % distance to a dash: the perk is hardly noticeable'); }
    setup(); e = mk('double', 1, 10); t.eq(e.st.charges, C('double').charges, 'Double Dash: ' + C('double').charges + ' charges'); e.dashCharges = e.st.charges; go(e, 1, 0, { dash: true }); env.run(.02); go(e, 1, 0); env.run(.5); const x1 = e.x; go(e, 1, 0, { dash: true }); env.run(.02); go(e, 0, 0, { f: 0 }); env.run(.5); t.ok(e.x - x1 > 100, 'a second dash right after the first');
  });
  await R.test('Adrenaline: dash and stamina back after a win, turbo at rank 2', t => {
    SUITE.seed(70); for (const r of ranks('adrenaline')) { setup(); const w = mk('adrenaline', r, 10), l = env.ent(spot.x + 30, spot.y, 6); w.stamina = 3; w.dashCharges = 0; X.finishDuel(w, l, env.clock());
      t.ok(w.stamina > 95 && w.dashCharges >= 1, 'rank ' + r + ': stamina and dash refilled'); t.eq(w.buff.turbo > env.clock(), r > 1, 'turbo only from rank 2'); }
  });
  await R.test('Phase Dash: nobody can duel you while you dash', t => {
    SUITE.seed(71); setup(); const e = mk('phase', 1, 10), b = env.ent(spot.x + 25, spot.y, 10); e.dashT = 1; e.dashCharges = 0; env.run(.5); t.eq(X.botDuels.length + (e.state === 'duel' ? 1 : 0), 0, 'no duel while dashing'); e.dashT = 0; env.run(.5); t.ok(X.botDuels.length > 0, 'a duel starts when the dash is over');
  });

  R.group('Perks: Typist');
  await R.test('phrase perks: Short Phrases, Curse, Underdog, Slippery, level gap', t => {
    SUITE.seed(72); setup(); const op = () => env.ent(spot.x + 80, spot.y, 10, { name: 'Op' });
    const a0 = mk(null, 0, 10), o0 = op(), base = X.duelWords(a0, o0, false, false, false, false)[0].n; X.ents = [];
    for (const r of ranks('short')) { setup(); const a = mk('short', r, 10), o = op(); t.eq(base - X.duelWords(a, o, false, false, false, false)[0].n, r * C('short').perRank, 'Short Phrases rank ' + r); }
    for (const r of ranks('curse')) { setup(); const a = mk('curse', r, 10), o = op(); t.eq(X.duelWords(o, a, false, false, false, false)[0].n - base, Math.min(r * C('curse').perRank, X.DU.longestPhrase - base) || 0, 'Curse rank ' + r + ': the opponent gets longer phrase'); }
    for (const r of ranks('underdog')) { setup(); const a = mk('underdog', r, 5), hi = env.ent(spot.x + 80, spot.y, 8); const w = X.sentenceWords(a, hi, false, false); const w0 = X.sentenceWords(mk(null, 0, 5), hi, false, false); t.eq(w0.n - w.n, Math.min(r * C('underdog').perRank, w0.n - X.DU.shortestPhrase), 'Underdog rank ' + r + ' helps against a higher level'); const lo = env.ent(spot.x + 80, spot.y, 2); t.eq(X.sentenceWords(a, lo, false, false).under, 0, 'but not against a lower level'); }
    for (const r of ranks('slippery')) { setup(); const a = mk(null, 0, 10), s = mk('slippery', r, 10); const caught = X.sentenceWords(a, s, true, false).chase; t.eq(caught, Math.max(0, X.DU.caughtWords - r * C('slippery').perRank), 'Slippery rank ' + r + ': catching a runner gives ' + caught + ' fewer words'); }
    setup(); const a = mk(null, 0, 10), s = mk(null, 0, 10); t.eq(X.sentenceWords(a, s, true, false).chase, X.DU.caughtWords, 'catching a runner: ' + X.DU.caughtWords + ' fewer words');
  });
  await R.test('the number of words: formulas, gap, floor, limits', t => {
    SUITE.seed(73); setup(); let monotone = true, lowerFewer = true, edgeOk = true, bounds = true, floorOk = true, sym = true;
    for (let la = 1; la <= 250; la += 7) for (let lb = 1; lb <= 250; lb += 11) {
      const a = env.ent(spot.x, spot.y, la), b = env.ent(spot.x + 50, spot.y, lb), [pa, pb] = X.duelWords(a, b, false, false, false, false);
      if (pa.n < X.DU.shortestPhrase || pb.n < X.DU.shortestPhrase || pa.n > X.DU.longestPhrase || pb.n > X.DU.longestPhrase) bounds = false;
      if (pa.n !== pb.n && Math.abs(la - lb) >= 0) lowerFewer = lowerFewer && true; if ((la > lb && pa.edge < pb.edge) || (la < lb && pa.edge > pb.edge) || (la === lb && (pa.edge || pb.edge)) || (Math.abs(la - lb) < X.DU.gapFrom && (pa.edge || pb.edge))) edgeOk = false; if (Math.min(pa.n, pb.n) < Math.ceil(Math.max(pa.n, pb.n) / 2)) floorOk = false;
      if (X.stakeWords(a, b) !== X.stakeWords(b, a)) sym = false; X.ents = [];
    }
    t.ok(bounds, 'phrase length is always between ' + X.DU.shortestPhrase + ' and ' + X.DU.longestPhrase); t.ok(edgeOk, 'only the higher level gets the edge (shorter words), never the lower one, and not below a gap of ' + X.DU.gapFrom); t.ok(floorOk, 'nobody types less than half of what the other types'); t.ok(sym, 'both start from the same base length');
    const e1 = env.ent(1, 1, 1), e2 = env.ent(1, 1, 1); t.range('words at level 1 vs 1', X.stakeWords(e1, e2), X.DU.minWords, X.DU.minWords + 1); const h1 = env.ent(1, 1, 150), h2 = env.ent(1, 1, 150); t.range('words at level 150 vs 150', X.stakeWords(h1, h2), 8, X.DU.maxWords);
  });
  await R.test('Head Start, Autocorrect, Warm Fingers, Flow State, King Hunter, Plunder: the numbers', t => {
    SUITE.seed(74); setup();
    for (const r of ranks('head')) t.near(mk('head', r).st.head, r * C('head').perRank, 1e-9, 'Head Start rank ' + r + ': ' + r * C('head').perRank + ' s');
    for (const r of ranks('forgive')) t.eq(mk('forgive', r).st.forgive, r * C('forgive').perRank, 'Autocorrect rank ' + r);
    for (const r of ranks('warm')) t.eq(mk('warm', r).st.warm, r * C('warm').perRank, 'Warm Fingers rank ' + r);
    t.ok(mk('flow', 1).st.flow, 'Flow State is on'); for (const r of ranks('bounty')) t.near(mk('bounty', r).st.kingx, 1 + r * C('bounty').perRank, 1e-9, 'King Hunter rank ' + r);
    for (const r of ranks('plunder')) t.near(mk('plunder', r).st.plunder, 1 + r * C('plunder').perRank, 1e-9, 'Plunder rank ' + r);
  });
  await R.test('Plunder and King Hunter pay more after a win', t => {
    SUITE.seed(75); const gain = (id, r, king) => { setup(); const w = mk(id, r, 10), l = env.ent(spot.x + 30, spot.y, 14); if (king) X.king = l; const g0 = X.xpOf(w.lvl); X.finishDuel(w, l, env.clock()); X.king = null; return X.xpOf(w.lvl) - g0; };
    const b = gain(null, 0, false); for (const r of ranks('plunder')) t.near(gain('plunder', r, false) / b, 1 + r * C('plunder').perRank, .03, 'Plunder rank ' + r + ': +' + Math.round(r * C('plunder').perRank * 100) + ' % XP from the win');
    const bk = gain(null, 0, true); t.ok(bk > b, 'beating the King pays a bonus (' + b.toFixed(1) + ' → ' + bk.toFixed(1) + ')'); for (const r of ranks('bounty')) t.ok(gain('bounty', r, true) > bk, 'King Hunter rank ' + r + ' pays more than without it');
  });

  R.group('Perks: Guard');
  await R.test('Victory Shield, Last Stand, Snack Guard, Iron Bubble', t => {
    SUITE.seed(76);
    for (const r of ranks('afterwin')) { setup(); const w = mk('afterwin', r, 10), l = env.ent(spot.x + 30, spot.y, 6); X.finishDuel(w, l, env.clock()); t.near(w.protect - env.clock(), X.DU.winnerProtection + r * C('afterwin').perRank, .05, 'Victory Shield rank ' + r + ': protected after the win'); }
    for (const r of ranks('laststand')) { setup(); const h = env.human('Loser', { x: spot.x, y: spot.y }); h.e.perks = { laststand: r }; h.e.lvl = 40.5; X.calcStats(h.e); const w = env.ent(spot.x + 30, spot.y, 50); X.finishDuel(w, h.e, env.clock());
      t.eq(h.e.respawnLvl, Math.max(1, Math.floor(40 * r * C('laststand').perRank)), 'Last Stand rank ' + r + ': you come back at level ' + h.e.respawnLvl); X.srvLeave(h.cid); }
    for (const r of ranks('snackguard')) { setup(); const e = mk('snackguard', r, 10); X.foods = [{ x: e.x, y: e.y + 4, t: 'apple', bob: 0, inside: false }]; X.fgBuild(); env.run(.1); t.ok(e.state === 'eat', 'eating'); t.near(e.protect - env.clock(), r * C('snackguard').perRank, .1, 'Snack Guard rank ' + r + ': protected while eating'); }
    setup(); const e = mk('bubble', 1, 10); env.run(C('bubble').every + 1); t.ok(e.items.includes('shield'), 'Iron Bubble: a Bubble Shield after ' + C('bubble').every + ' s');
  });
  R.group('Perks: Trick');
  await R.test('Long Lasting, Recycler, Lucky Boxes, Pickpocket, Fortune, Item Fairy', t => {
    SUITE.seed(77);
    for (const r of ranks('itemdur')) { setup(); const e = mk('itemdur', r, 10); e.items = ['turbo', null, null, null, null, null, null]; const t0 = env.clock(); X.useItem(e, t0, 0); t.near(e.buff.turbo - t0, X.ITEMS.turbo.dur * (1 + r * C('itemdur').perRank), .05, 'Long Lasting rank ' + r + ': items last ' + Math.round(r * C('itemdur').perRank * 100) + ' % longer'); }
    for (const r of [1, X.PERK_BY.recycle.max]) { setup(); const e = mk('recycle', r, 10); let kept = 0, N = 2000; for (let i = 0; i < N; i++) { e.items = ['energy', null, null, null, null, null, null]; X.useItem(e, env.clock(), 0); if (e.items[0]) kept++; }
      t.ok(S.fits(kept, N, Math.min(1, r * C('recycle').perRank)), 'Recycler rank ' + r + ': ' + (kept / N * 100).toFixed(1) + ' % not used up (should be ' + r * C('recycle').perRank * 100 + ' %)'); }
    for (const r of ranks('boxbonus')) { setup(); const e = mk('boxbonus', r, 10), ref = mk(null, 0, 10); e.items = ref.items = [null, null, null, null, null, null, null]; X.giveItem(e, env.clock(), false); X.gainXp(ref, r * C('boxbonus').perRank); t.near(e.lvl, ref.lvl, 1e-6, 'Lucky Boxes rank ' + r + ': ' + r * C('boxbonus').perRank + ' xp with every box'); }
    for (const r of [1, X.PERK_BY.thief.max]) { setup(); let st = 0, N = 1500; for (let i = 0; i < N; i++) { const w = mk('thief', r, 10), l = env.ent(spot.x + 30, spot.y, 5); w.items = [null, null, null, null, null, null, null]; l.items = ['apple', null, null, null, null, null, null]; X.finishDuel(w, l, env.clock()); if (w.items.includes('apple')) st++; X.ents = [w]; l.state = 'move'; X.ents = []; spot = env.open(300); }
      t.ok(S.fits(st, N, r * C('thief').perRank), 'Pickpocket rank ' + r + ': stole in ' + (st / N * 100).toFixed(1) + ' % (should be ' + r * C('thief').perRank * 100 + ' %)'); }
    setup(); const a = mk(null, 0, 10), f = mk('fortune', X.PERK_BY.fortune.max, 10); const avg = e => { let s = 0; for (let i = 0; i < 4000; i++) { e.items = [null, null, null, null, null, null, null]; X.giveItem(e, env.clock(), false); s += X.ITEMS[e.items[0]].tier; } return s / 4000; };
    const a0 = avg(a), a1 = avg(f); t.ok(a1 > a0 + .15, 'Fortune: better items from boxes (' + a0.toFixed(2) + ' → ' + a1.toFixed(2) + ' average rarity)');
    setup(); const fy = mk('fairy', 1, 10); env.run(C('fairy').every + 1); t.ok(fy.items.some(Boolean), 'Item Fairy: a free item after ' + C('fairy').every + ' s');
  });
  await R.test('Perk offers in a real game: server offers, player picks, perk works', t => {
    SUITE.seed(78); setup(); const a = env.human('Picker', { x: spot.x, y: spot.y }); a.e.lvl = 2.5; X.gainXp(a.e, .01); const out = env.srv(.3);
    const offer = out.find(m => m[0] === a.cid && m[1].t === 'offer'); t.ok(!!offer, 'level 2: a perk offer arrives'); if (!offer) return;
    t.ok(offer[1].ids.length >= 1 && offer[1].ids.length <= 3 && new Set(offer[1].ids).size === offer[1].ids.length, 'up to three different cards'); t.ok(offer[1].ids.every(id => X.PERK_BY[id]), 'all cards are real perks');
    X.srvMsg(a.cid, { t: 'choose', i: 9 }); env.srv(.1); t.eq(a.e.picksDone, 0, 'an invalid choice does nothing'); X.srvMsg(a.cid, { t: 'choose', i: 0 }); env.srv(.1);
    t.eq(a.e.picksDone, 1, 'one pick done'); t.eq(X.perkR(a.e, offer[1].ids[0]), 1, 'the perk is now rank 1'); t.ok(a.e.st && Number.isFinite(a.e.st.xp), 'stats recalculated');
    X.srvMsg(a.cid, { t: 'choose', i: 0 }); env.srv(.1); t.eq(a.e.picksDone, 1, 'no second pick without a level'); X.srvLeave(a.cid);
  });
  await R.test('every perk at every rank gives finite numbers (no NaN) and works together', t => {
    SUITE.seed(79); setup(); const e = env.ent(spot.x, spot.y, 120); for (const p of X.PERKS) e.perks[p.id] = p.max; X.calcStats(e);
    for (const k in e.st) { const v = e.st[k]; t.ok(typeof v === 'boolean' || Number.isFinite(v), 'stat ' + k + ' = ' + v); }
    go(e, 1, 0, { sprint: true }); env.run(5); t.ok(Number.isFinite(e.x + e.vx + e.stamina), 'a player with every perk at max can play'); t.ok(e.st.eatT >= C('quickbite').floor - 1e-9, 'eating time never below the floor');
    t.range('phrase words for a maxed player against an equal one', X.duelWords(e, env.ent(e.x + 40, e.y, 120), false, false, false, false)[0].n, X.DU.shortestPhrase, X.DU.longestPhrase);
  });
  X.ents = []; X.foods = []; X.boxes = []; X.orbs = []; X.botDuels = []; X.king = null;
} });
})(typeof self !== 'undefined' ? self : globalThis);
